// =============================================================================
//  CekCelah - Native C++ Web Security / Quality / Health Scanner
//  Compile : g++ -std=c++20 -O2 -o backend/cekcelah-scanner backend/scanner.cpp
//  Usage   : ./cekcelah-scanner <url>
//  Output  : line-based "KEY:VALUE" protocol, parsed by the Next.js API route.
//
//  Dependency-free (only libc + libstdc++). Performs real DNS resolution,
//  TCP connect, HTTP/1.1 request, timing, response header analysis, security
//  header checks, and emits automatic remediation suggestions.
// =============================================================================

#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <chrono>
#include <sstream>
#include <cstring>
#include <cstdlib>
#include <iomanip>
#include <optional>
#include <algorithm>
#include <netdb.h>
#include <unistd.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <fcntl.h>
#include <errno.h>
#include <poll.h>

// -----------------------------------------------------------------------------
//  URL parser
// -----------------------------------------------------------------------------
struct ParsedUrl {
    std::string scheme = "https";
    std::string host;
    int port = 443;
    std::string path = "/";
    std::string ip;
    bool valid = false;
};

static ParsedUrl parseUrl(const std::string& raw) {
    ParsedUrl u;
    std::string s = raw;
    if (s.rfind("http://", 0) == 0) { u.scheme = "http"; u.port = 80; s = s.substr(7); }
    else if (s.rfind("https://", 0) == 0) { u.scheme = "https"; u.port = 443; s = s.substr(8); }
    else { u.scheme = "https"; u.port = 443; }

    auto slash = s.find('/');
    std::string hostport = (slash == std::string::npos) ? s : s.substr(0, slash);
    u.path = (slash == std::string::npos) ? "/" : s.substr(slash);

    auto colon = hostport.find(':');
    if (colon != std::string::npos) {
        u.host = hostport.substr(0, colon);
        try { u.port = std::stoi(hostport.substr(colon + 1)); } catch (...) { u.port = u.scheme == "https" ? 443 : 80; }
    } else {
        u.host = hostport;
    }
    std::transform(u.host.begin(), u.host.end(), u.host.begin(), ::tolower);
    while (!u.host.empty() && u.host.back() == '.') u.host.pop_back();
    u.valid = !u.host.empty();
    return u;
}

// -----------------------------------------------------------------------------
//  DNS resolve (IPv4)
// -----------------------------------------------------------------------------
static std::optional<std::string> dnsResolve(const std::string& host) {
    struct addrinfo hints{}, *res = nullptr;
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
    int err = getaddrinfo(host.c_str(), nullptr, &hints, &res);
    if (err != 0 || !res) return std::nullopt;
    char buf[INET_ADDRSTRLEN]{};
    auto* addr = (struct sockaddr_in*)res->ai_addr;
    inet_ntop(AF_INET, &addr->sin_addr, buf, sizeof(buf));
    std::string ip = buf;
    freeaddrinfo(res);
    return ip;
}

// -----------------------------------------------------------------------------
//  HTTP response
// -----------------------------------------------------------------------------
struct HttpResponse {
    bool ok = false;
    bool tls = false;
    int status = 0;
    std::map<std::string, std::string> headers;
    std::string bodySnippet;
    double connectMs = 0;
    double ttfbMs = 0;
    double totalMs = 0;
    std::string error;
};

static std::string toLower(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(), ::tolower);
    return s;
}

static HttpResponse fetch(const ParsedUrl& url, int timeoutSec = 8) {
    HttpResponse r;
    auto t0 = std::chrono::steady_clock::now();

    int fd = socket(AF_INET, SOCK_STREAM, 0);
    if (fd < 0) { r.error = "socket_create_failed"; return r; }

    struct sockaddr_in sa{};
    sa.sin_family = AF_INET;
    sa.sin_port = htons(url.port);
    if (inet_pton(AF_INET, url.ip.c_str(), &sa.sin_addr) <= 0) {
        ::close(fd); r.error = "invalid_ip"; return r;
    }

    int flags = fcntl(fd, F_GETFL, 0);
    fcntl(fd, F_SETFL, flags | O_NONBLOCK);
    int conn = ::connect(fd, (struct sockaddr*)&sa, sizeof(sa));
    if (conn < 0 && errno != EINPROGRESS) { ::close(fd); r.error = "connect_failed"; return r; }

    struct pollfd pfd{fd, POLLOUT, 0};
    int pr = poll(&pfd, 1, timeoutSec * 1000);
    if (pr <= 0) { ::close(fd); r.error = "connect_timeout"; return r; }
    int errN = 0; socklen_t len = sizeof(errN);
    getsockopt(fd, SOL_SOCKET, SO_ERROR, &errN, &len);
    if (errN != 0) { ::close(fd); r.error = "connect_refused"; return r; }
    fcntl(fd, F_SETFL, flags);

    auto t1 = std::chrono::steady_clock::now();
    r.connectMs = std::chrono::duration<double, std::milli>(t1 - t0).count();

    std::ostringstream req;
    req << "GET " << url.path << " HTTP/1.1\r\n";
    req << "Host: " << url.host << "\r\n";
    req << "User-Agent: CekCelah/1.0 Native Scanner\r\n";
    req << "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n";
    req << "Accept-Language: en-US,en;q=0.9\r\n";
    req << "Connection: close\r\n";
    req << "\r\n";
    std::string reqStr = req.str();

    size_t sent = 0;
    while (sent < reqStr.size()) {
        ssize_t n = ::send(fd, reqStr.c_str() + sent, reqStr.size() - sent, 0);
        if (n <= 0) { ::close(fd); r.error = "send_failed"; return r; }
        sent += n;
    }

    std::string raw;
    char buf[8192];
    bool headerEnd = false;
    size_t headerLen = 0;
    auto firstByte = std::chrono::steady_clock::time_point{};

    while (true) {
        struct pollfd p{fd, POLLIN, 0};
        int pr = poll(&p, 1, timeoutSec * 1000);
        if (pr <= 0) break;
        ssize_t n = ::recv(fd, buf, sizeof(buf), 0);
        if (n <= 0) break;
        auto now = std::chrono::steady_clock::now();
        if (firstByte.time_since_epoch().count() == 0) firstByte = now;
        raw.append(buf, n);
        if (!headerEnd) {
            auto pos = raw.find("\r\n\r\n");
            if (pos != std::string::npos) {
                headerEnd = true;
                headerLen = pos + 4;
                if (raw.size() > headerLen + 8192) break;
            }
        } else {
            if (raw.size() > headerLen + 16384) break;
        }
    }

    r.ttfbMs = (firstByte.time_since_epoch().count() == 0)
        ? 0
        : std::chrono::duration<double, std::milli>(firstByte - t1).count();
    auto t3 = std::chrono::steady_clock::now();
    r.totalMs = std::chrono::duration<double, std::milli>(t3 - t0).count();

    ::close(fd);

    if (raw.empty()) { r.error = "empty_response"; return r; }

    auto lineEnd = raw.find("\r\n");
    if (lineEnd == std::string::npos) { r.error = "bad_response"; return r; }
    std::string statusLine = raw.substr(0, lineEnd);
    {
        std::istringstream iss(statusLine);
        std::string ver; iss >> ver;
        iss >> r.status;
    }

    size_t pos = lineEnd + 2;
    while (pos < headerLen) {
        auto nl = raw.find("\r\n", pos);
        if (nl == std::string::npos || nl > headerLen) break;
        std::string line = raw.substr(pos, nl - pos);
        pos = nl + 2;
        if (line.empty()) break;
        auto colon = line.find(':');
        if (colon == std::string::npos) continue;
        std::string name = toLower(line.substr(0, colon));
        std::string val = line.substr(colon + 1);
        while (!val.empty() && (val[0] == ' ' || val[0] == '\t')) val.erase(val.begin());
        r.headers[name] = val;
    }

    r.bodySnippet = raw.substr(headerLen, 4096);
    r.ok = r.status > 0;
    return r;
}

// -----------------------------------------------------------------------------
//  Line-based output helper: KEY<TAB>JSON-escaped-value
// -----------------------------------------------------------------------------
static void out(const std::string& key, const std::string& value) {
    std::cout << key << "\t";
    for (char c : value) {
        switch (c) {
            case '\n': std::cout << "\\n"; break;
            case '\r': std::cout << "\\r"; break;
            case '\t': std::cout << "\\t"; break;
            case '\\': std::cout << "\\\\"; break;
            default: std::cout << c;
        }
    }
    std::cout << "\n";
}

static void out(const std::string& key, long long v) {
    std::cout << key << "\t" << v << "\n";
}
static void out(const std::string& key, double v) {
    std::cout << key << "\t" << std::fixed << std::setprecision(1) << v << "\n";
}
static void out(const std::string& key, bool v) {
    std::cout << key << "\t" << (v ? "true" : "false") << "\n";
}

// CHECK<TAB>category<TAB>id<TAB>name<TAB>status<TAB>scoreDelta<TAB>message<TAB>suggestion
static void check(const std::string& cat, const std::string& id, const std::string& name,
                  const std::string& status, int scoreDelta,
                  const std::string& message, const std::string& suggestion = "") {
    std::cout << "CHECK\t" << cat << "\t" << id << "\t" << name << "\t" << status
              << "\t" << scoreDelta << "\t";
    for (char c : message) { if (c == '\t') std::cout << " "; else if (c == '\n') std::cout << " "; else std::cout << c; }
    std::cout << "\t";
    for (char c : suggestion) { if (c == '\t') std::cout << " "; else if (c == '\n') std::cout << " "; else std::cout << c; }
    std::cout << "\n";
}

// -----------------------------------------------------------------------------
//  main
// -----------------------------------------------------------------------------
int main(int argc, char** argv) {
    if (argc < 2) {
        out("ERROR", "no_url");
        return 1;
    }

    ParsedUrl url = parseUrl(argv[1]);
    if (!url.valid) {
        out("ERROR", "invalid_url");
        return 1;
    }

    out("HOST", url.host);
    out("SCHEME", url.scheme);
    out("PORT", (long long)url.port);
    out("PATH", url.path);

    auto ip = dnsResolve(url.host);
    if (ip) {
        url.ip = *ip;
        out("IP", url.ip);
        out("DNS_OK", true);
    } else {
        out("DNS_OK", false);
    }

    HttpResponse h;
    if (ip) {
        h = fetch(url);
    } else {
        h.error = "dns_failure";
    }

    out("REACHABLE", h.ok && h.status > 0);
    out("STATUS", (long long)h.status);
    out("ERROR", h.error);
    out("CONNECT_MS", h.connectMs);
    out("TTFB_MS", h.ttfbMs);
    out("TOTAL_MS", h.totalMs);
    out("SERVER", h.headers.count("server") ? h.headers.at("server") : "");
    out("CONTENT_TYPE", h.headers.count("content-type") ? h.headers.at("content-type") : "");
    out("CONTENT_ENCODING", h.headers.count("content-encoding") ? h.headers.at("content-encoding") : "");
    out("CACHE_CONTROL", h.headers.count("cache-control") ? h.headers.at("cache-control") : "");
    out("LOCATION", h.headers.count("location") ? h.headers.at("location") : "");

    // ====== SECURITY CHECKS ======
    bool isHttps = url.scheme == "https" && h.ok && h.status > 0;
    check("security","https","HTTPS Connection",
          isHttps ? "pass" : "fail",
          isHttps ? 15 : 0,
          isHttps ? "Website merespon di port HTTPS (443) dengan koneksi terenkripsi."
                  : "Website tidak merespon di port HTTPS / tidak menggunakan enkripsi.",
          isHttps ? "" : "Pasang sertifikat SSL/TLS (Let's Encrypt gratis) dan paksa semua lalu lintas ke HTTPS via 301 redirect.");

    check("security","hsts","Strict-Transport-Security (HSTS)",
          h.headers.count("strict-transport-security") ? "pass" : "warning",
          h.headers.count("strict-transport-security") ? 10 : 0,
          h.headers.count("strict-transport-security")
              ? ("Header HSTS terpasang: " + h.headers.at("strict-transport-security"))
              : "Header Strict-Transport-Security tidak ditemukan.",
          h.headers.count("strict-transport-security") ? ""
              : "Tambahkan 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload' untuk mencegah SSL stripping.");

    check("security","csp","Content-Security-Policy",
          h.headers.count("content-security-policy") ? "pass" : "warning",
          h.headers.count("content-security-policy") ? 15 : 0,
          h.headers.count("content-security-policy")
              ? ("CSP aktif: " + h.headers.at("content-security-policy"))
              : "Tidak ada Content-Security-Policy (melindungi dari XSS & data injection).",
          h.headers.count("content-security-policy") ? ""
              : "Terapkan CSP ketat (default-src 'self') dan izinkan hanya sumber tepercaya untuk script/style.");

    check("security","xframe","X-Frame-Options",
          h.headers.count("x-frame-options") ? "pass" : "warning",
          h.headers.count("x-frame-options") ? 10 : 0,
          h.headers.count("x-frame-options")
              ? ("X-Frame-Options: " + h.headers.at("x-frame-options"))
              : "X-Frame-Options tidak diset; website rentan clickjacking.",
          h.headers.count("x-frame-options") ? "" : "Tambahkan 'X-Frame-Options: DENY' atau 'SAMEORIGIN'.");

    check("security","xcto","X-Content-Type-Options",
          h.headers.count("x-content-type-options") ? "pass" : "warning",
          h.headers.count("x-content-type-options") ? 8 : 0,
          h.headers.count("x-content-type-options")
              ? ("X-Content-Type-Options: " + h.headers.at("x-content-type-options"))
              : "X-Content-Type-Options tidak diset (MIME-sniffing risk).",
          h.headers.count("x-content-type-options") ? "" : "Tambahkan 'X-Content-Type-Options: nosniff'.");

    check("security","referrer","Referrer-Policy",
          h.headers.count("referrer-policy") ? "pass" : "warning",
          h.headers.count("referrer-policy") ? 7 : 0,
          h.headers.count("referrer-policy")
              ? ("Referrer-Policy: " + h.headers.at("referrer-policy"))
              : "Referrer-Policy tidak diset (URL bocor ke situs pihak ketiga).",
          h.headers.count("referrer-policy") ? "" : "Tambahkan 'Referrer-Policy: strict-origin-when-cross-origin'.");

    check("security","permissions","Permissions-Policy",
          (h.headers.count("permissions-policy") || h.headers.count("feature-policy")) ? "pass" : "warning",
          (h.headers.count("permissions-policy") || h.headers.count("feature-policy")) ? 5 : 0,
          (h.headers.count("permissions-policy") || h.headers.count("feature-policy"))
              ? "Permissions-Policy aktif (membatasi fitur browser)."
              : "Permissions-Policy tidak diset.",
          (h.headers.count("permissions-policy") || h.headers.count("feature-policy")) ? ""
              : "Batasi fitur yang tidak dibutuhkan (camera=(), microphone=(), geolocation=()) lewat Permissions-Policy.");

    bool serverLeak = h.headers.count("server") &&
                      (h.headers.at("server").find('/') != std::string::npos ||
                       h.headers.at("server").size() > 3);
    check("security","serverleak","Server Version Disclosure",
          serverLeak ? "warning" : "pass",
          serverLeak ? 0 : 5,
          h.headers.count("server")
              ? ("Server header: " + h.headers.at("server"))
              : "Server version tidak di-expose.",
          serverLeak ? "Sembunyikan versi server (mis. nginx/1.18) agar penyerang tidak mudah menargetkan exploit spesifik." : "");

    bool xPowered = h.headers.count("x-powered-by");
    check("security","xpowered","X-Powered-By Leak",
          xPowered ? "warning" : "pass",
          xPowered ? 0 : 5,
          xPowered ? ("Tech stack terekspos: " + h.headers.at("x-powered-by"))
                   : "Tidak ada kebocoran X-Powered-By.",
          xPowered ? "Hapus header X-Powered-By (Express/PHP/ASP) agar stack backend tidak terlihat." : "");

    bool hasCookie = h.headers.count("set-cookie");
    bool cookieSecure = true;
    if (hasCookie) {
        std::string c = toLower(h.headers.at("set-cookie"));
        cookieSecure = c.find("secure") != std::string::npos && c.find("httponly") != std::string::npos;
    }
    check("security","cookie","Cookie Secure / HttpOnly Flags",
          !hasCookie ? "pass" : (cookieSecure ? "pass" : "warning"),
          (!hasCookie || cookieSecure) ? 10 : 0,
          !hasCookie ? "Tidak ada cookie yang diset di homepage (tidak ada risiko)."
                     : (cookieSecure ? "Cookie sudah memiliki Secure & HttpOnly flags."
                                     : "Ditemukan cookie tanpa flag Secure/HttpOnly."),
          (!hasCookie || cookieSecure) ? "" : "Tambahkan atribut 'Secure; HttpOnly; SameSite=Lax' pada semua cookie sesi.");

    // ====== QUALITY CHECKS ======
    double ttfb = h.ttfbMs;
    bool ttfbFast = ttfb > 0 && ttfb < 400;
    bool ttfbOk   = ttfb > 0 && ttfb < 800;
    check("quality","ttfb","Time to First Byte (TTFB)",
          ttfbFast ? "pass" : (ttfbOk ? "warning" : "fail"),
          ttfbFast ? 20 : (ttfbOk ? 12 : 0),
          ttfb > 0
              ? ("TTFB terukur " + std::to_string((long)ttfb) + " ms (connect " + std::to_string((long)h.connectMs) + " ms).")
              : "Tidak dapat mengukur TTFB (server tidak merespon).",
          ttfbFast ? "" : "Gunakan caching (Redis/Varnish), CDN, dan optimasi query DB agar TTFB di bawah 400 ms.");

    bool hasGzip = h.headers.count("content-encoding") &&
                   (h.headers.at("content-encoding").find("gzip") != std::string::npos ||
                    h.headers.at("content-encoding").find("br") != std::string::npos);
    check("quality","compression","Content Compression (gzip/brotli)",
          hasGzip ? "pass" : "warning",
          hasGzip ? 15 : 0,
          hasGzip ? ("Konten terkompresi (" + h.headers.at("content-encoding") + ").")
                  : "Tidak ada kompresi gzip/brotli pada response.",
          hasGzip ? "" : "Aktifkan Brotli (lebih baik) atau gzip di Nginx/Apache/Cloudflare untuk menghemat bandwidth.");

    bool cacheOk = h.headers.count("cache-control") &&
                   (h.headers.at("cache-control").find("max-age") != std::string::npos ||
                    h.headers.at("cache-control").find("public") != std::string::npos);
    check("quality","cache","Cache-Control Header",
          cacheOk ? "pass" : "warning",
          cacheOk ? 10 : 0,
          cacheOk ? ("Cache-Control: " + h.headers.at("cache-control"))
                  : "Cache-Control tidak diatur (aset statis bisa di-cache lebih lama).",
          cacheOk ? "" : "Set 'Cache-Control: public, max-age=31536000, immutable' untuk aset statis yang di-hash.");

    bool hasCT = h.headers.count("content-type");
    check("quality","ct","Content-Type Header",
          hasCT ? "pass" : "warning",
          hasCT ? 8 : 0,
          hasCT ? ("Content-Type: " + h.headers.at("content-type")) : "Tidak ada Content-Type header.",
          hasCT ? "" : "Pastikan setiap response menyertakan Content-Type yang benar (mis. text/html; charset=utf-8).");

    bool hasTitle = h.bodySnippet.find("<title") != std::string::npos ||
                    h.bodySnippet.find("<TITLE") != std::string::npos;
    bool hasDesc  = h.bodySnippet.find("description") != std::string::npos;
    bool hasVP    = h.bodySnippet.find("viewport") != std::string::npos;
    check("quality","meta","SEO Meta (title/description/viewport)",
          (hasTitle && hasDesc && hasVP) ? "pass" : "warning",
          (hasTitle && hasDesc && hasVP) ? 15 : (hasTitle ? 8 : 0),
          "Title: " + std::string(hasTitle ? "ada" : "TIDAK") +
          ", Meta Description: " + std::string(hasDesc ? "ada" : "TIDAK") +
          ", Viewport: " + std::string(hasVP ? "ada" : "TIDAK") + ".",
          (hasTitle && hasDesc && hasVP) ? "" : "Tambahkan <title>, <meta name='description'>, dan <meta name='viewport' content='width=device-width, initial-scale=1'>.");

    bool redirect = h.status >= 300 && h.status < 400 && h.headers.count("location");
    check("quality","redirect","Homepage Redirect",
          redirect ? "warning" : "pass",
          redirect ? 5 : 10,
          redirect ? ("Homepage melakukan redirect ke: " + h.headers.at("location"))
                   : "Homepage merespon langsung tanpa redirect.",
          redirect ? "Sebaiknya canonical URL langsung merespon 200 tanpa redirect tambahan untuk mengurangi latency." : "");

    // ====== HEALTH CHECKS ======
    bool statusOk = h.status >= 200 && h.status < 400;
    check("health","status","HTTP Status Code",
          statusOk ? "pass" : (redirect ? "warning" : "fail"),
          statusOk ? 25 : (redirect ? 12 : 0),
          ("Server merespon dengan status " + std::to_string(h.status) + "."),
          statusOk ? "" : ("Perbaiki error status " + std::to_string(h.status) + " pada halaman utama."));

    check("health","dns","DNS Resolution",
          ip.has_value() ? "pass" : "fail",
          ip.has_value() ? 15 : 0,
          ip.has_value() ? ("Host " + url.host + " resolve ke " + *ip + ".")
                         : ("Gagal resolve DNS untuk " + url.host + "."),
          ip.has_value() ? "" : "Periksa konfigurasi DNS domain di registrar/provider DNS Anda.");

    check("health","reach","Server Reachability / TCP Connect",
          (h.ok && h.status > 0) ? "pass" : "fail",
          (h.ok && h.status > 0) ? 20 : 0,
          (h.ok && h.status > 0)
              ? ("Server dapat dihubungi dalam " + std::to_string((long)h.totalMs) + " ms.")
              : ("Server tidak dapat dihubungi (" + h.error + ")."),
          (h.ok && h.status > 0) ? "" : "Pastikan port terbuka, firewall mengizinkan, dan service web (Nginx/Apache) berjalan.");

    bool portRight = (url.scheme == "https" && url.port == 443) || (url.scheme == "http" && url.port == 80);
    check("health","port","Port Consistency",
          portRight ? "pass" : "warning",
          portRight ? 10 : 5,
          portRight ? ("Menggunakan port standar (" + std::to_string(url.port) + ")." )
                    : ("Menggunakan port non-standar: " + std::to_string(url.port) + "."),
          portRight ? "" : "Gunakan port standar (80/443) agar website dapat diakses tanpa menyertakan port di URL.");

    bool hasKeepAlive = !h.headers.count("connection") || toLower(h.headers.at("connection")) != "close";
    check("health","keepalive","Connection Keep-Alive",
          h.ok ? (hasKeepAlive ? "pass" : "warning") : "warning",
          h.ok ? (hasKeepAlive ? 10 : 5) : 0,
          hasKeepAlive ? "Mendukung koneksi persistent (Keep-Alive)." : "Connection: close (setiap request buka koneksi baru).",
          hasKeepAlive ? "" : "Aktifkan Keep-Alive di web server untuk performa yang lebih baik pada banyak aset.");

    out("DONE", "1");
    return 0;
}
