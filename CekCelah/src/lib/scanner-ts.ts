/**
 * CekCelah — TypeScript scanner fallback.
 *
 * Digunakan secara otomatis ketika binary C++ native tidak tersedia
 * (misalnya ketika di-deploy ke Vercel / platform serverless lainnya).
 *
 * Scanner ini melakukan fetch() HTTP/HTTPS yang nyata ke target,
 * mengukur timing (DNS/TCP/TTFB tidak terukur murni di fetch() browser-side,
 * tapi kita ukur wall-clock total + TTFB via response), memeriksa header
 * keamanan, kompresi, cache, dan meta tag — semuanya dari data riil.
 */

export type TSCheck = {
  category: "security" | "quality" | "health";
  id: string;
  name: string;
  status: "pass" | "warning" | "fail";
  scoreDelta: number;
  message: string;
  suggestion?: string;
};

export type TSScanResult = {
  target: {
    host: string;
    scheme: string;
    port: number;
    path: string;
    ip: string;
    url: string;
    dnsOk: boolean;
  };
  response: {
    ok: boolean;
    status: number;
    error: string;
    connectMs: number;
    ttfbMs: number;
    totalMs: number;
    server: string;
    contentType: string;
    contentEncoding: string;
    cacheControl: string;
    location: string;
  };
  security: { score: number; label: string; checks: TSCheck[]; suggestions: string[] };
  quality: { score: number; label: string; checks: TSCheck[]; suggestions: string[] };
  health: { score: number; label: string; checks: TSCheck[]; suggestions: string[] };
  overall: { score: number; label: string };
  suggestions: { category: string; title: string; text: string }[];
  engine: "native-cpp" | "typescript";
};

function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Baik";
  if (score >= 55) return "Cukup";
  if (score >= 35) return "Buruk";
  return "Kritis";
}

function normalizeUrl(input: string): { url: URL; normalized: string } | null {
  let s = input.trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (!u.hostname) return null;
    return { url: u, normalized: u.toString() };
  } catch {
    return null;
  }
}

export async function scanWithTS(rawUrl: string): Promise<TSScanResult> {
  const norm = normalizeUrl(rawUrl);
  if (!norm) {
    throw new Error("URL tidak valid.");
  }

  const { url, normalized } = norm;
  const checks: TSCheck[] = [];

  const tStart = performance.now();
  let resp: Response | null = null;
  let err: string = "";
  let tTtfb = 0;
  let text = "";

  try {
    // Abort after 15s
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 15000);
    // Gunakan request manual agar kita bisa ukur TTFB sedekat mungkin.
    const tBeforeFetch = performance.now();
    resp = await fetch(normalized, {
      method: "GET",
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "CekCelah/1.0 (TypeScript Scanner)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    tTtfb = performance.now() - tBeforeFetch;
    clearTimeout(to);
    // Baca body untuk cek meta tag (potong agar ringan)
    text = (await resp.text()).slice(0, 65536);
  } catch (e: any) {
    err = e?.name === "AbortError" ? "timeout" : (e?.message || "network_error");
  }
  const tTotal = performance.now() - tStart;

  const headersObj: Record<string, string> = {};
  if (resp) {
    resp.headers.forEach((v, k) => {
      headersObj[k.toLowerCase()] = v;
    });
  }

  const isHttps = url.protocol === "https:";
  const status = resp?.status || 0;
  const ok = !!resp && status > 0;
  const isRedirect = status >= 300 && status < 400;
  const isSuccess = status >= 200 && status < 400;

  // === DNS/TCP (kita tidak bisa ukur DNS/TCP terpisah di fetch(),
  //     tapi kita asumsikan koneksi berhasil jika ok) ===
  checks.push({
    category: "health",
    id: "dns",
    name: "DNS Resolution & Reachability",
    status: ok ? "pass" : "fail",
    scoreDelta: ok ? 30 : 0,
    message: ok
      ? `Host ${url.hostname} berhasil di-resolve dan dihubungi melalui jaringan.`
      : `Tidak dapat menjangkau ${url.hostname}: ${err}`,
    suggestion: ok
      ? undefined
      : "Pastikan domain terdaftar di DNS, A/AAAA record benar, dan server web berjalan.",
  });

  // ===== SECURITY =====
  checks.push({
    category: "security",
    id: "https",
    name: "HTTPS Connection",
    status: isHttps && ok ? "pass" : isHttps ? "warning" : "fail",
    scoreDelta: isHttps && ok ? 15 : isHttps ? 8 : 0,
    message: isHttps && ok
      ? "Website menggunakan koneksi HTTPS terenkripsi."
      : isHttps
      ? "URL menggunakan skema HTTPS namun koneksi gagal."
      : "Website menggunakan HTTP (tidak terenkripsi).",
    suggestion: isHttps && ok ? undefined : "Pasang SSL/TLS dan paksa redirect ke HTTPS.",
  });

  const hsts = headersObj["strict-transport-security"];
  checks.push({
    category: "security",
    id: "hsts",
    name: "Strict-Transport-Security (HSTS)",
    status: hsts ? "pass" : "warning",
    scoreDelta: hsts ? 10 : 0,
    message: hsts ? `HSTS terpasang: ${hsts}` : "Header HSTS tidak ditemukan.",
    suggestion: hsts ? undefined : "Tambahkan 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload'.",
  });

  const csp = headersObj["content-security-policy"] || headersObj["content-security-policy-report-only"];
  checks.push({
    category: "security",
    id: "csp",
    name: "Content-Security-Policy",
    status: csp ? "pass" : "warning",
    scoreDelta: csp ? 15 : 0,
    message: csp ? `CSP aktif.` : "Tidak ada Content-Security-Policy.",
    suggestion: csp ? undefined : "Terapkan CSP ketat untuk mencegah XSS dan code injection.",
  });

  const xfo = headersObj["x-frame-options"];
  const frameAncestors = csp && csp.includes("frame-ancestors");
  checks.push({
    category: "security",
    id: "xframe",
    name: "X-Frame-Options / frame-ancestors",
    status: xfo || frameAncestors ? "pass" : "warning",
    scoreDelta: xfo || frameAncestors ? 10 : 0,
    message: xfo ? `X-Frame-Options: ${xfo}` : frameAncestors ? "Frame-ancestors diatur via CSP." : "Tidak ada proteksi clickjacking.",
    suggestion: xfo || frameAncestors ? undefined : "Tambahkan 'X-Frame-Options: DENY' atau 'SAMEORIGIN' (atau CSP frame-ancestors).",
  });

  const xcto = headersObj["x-content-type-options"];
  checks.push({
    category: "security",
    id: "xcto",
    name: "X-Content-Type-Options",
    status: xcto ? "pass" : "warning",
    scoreDelta: xcto ? 8 : 0,
    message: xcto ? `X-Content-Type-Options: ${xcto}` : "X-Content-Type-Options tidak diset.",
    suggestion: xcto ? undefined : "Tambahkan 'X-Content-Type-Options: nosniff'.",
  });

  const rp = headersObj["referrer-policy"];
  checks.push({
    category: "security",
    id: "referrer",
    name: "Referrer-Policy",
    status: rp ? "pass" : "warning",
    scoreDelta: rp ? 7 : 0,
    message: rp ? `Referrer-Policy: ${rp}` : "Referrer-Policy tidak diset.",
    suggestion: rp ? undefined : "Tambahkan 'Referrer-Policy: strict-origin-when-cross-origin'.",
  });

  const pp = headersObj["permissions-policy"] || headersObj["feature-policy"];
  checks.push({
    category: "security",
    id: "permissions",
    name: "Permissions-Policy",
    status: pp ? "pass" : "warning",
    scoreDelta: pp ? 5 : 0,
    message: pp ? "Permissions-Policy aktif." : "Permissions-Policy tidak diset.",
    suggestion: pp ? undefined : "Batasi fitur browser (camera, microphone, geolocation) dengan Permissions-Policy.",
  });

  const server = headersObj["server"] || "";
  const serverLeak = /[a-z]+\/[\d.]+/i.test(server) || /(apache|nginx|iis|express|php|jetty|tomcat)/i.test(server);
  checks.push({
    category: "security",
    id: "serverleak",
    name: "Server Version Disclosure",
    status: serverLeak ? "warning" : "pass",
    scoreDelta: serverLeak ? 0 : 5,
    message: server ? `Server header: ${server}` : "Server version tidak di-expose.",
    suggestion: serverLeak ? "Sembunyikan versi server agar penyerang tidak mudah menargetkan exploit spesifik." : undefined,
  });

  const xpb = headersObj["x-powered-by"];
  checks.push({
    category: "security",
    id: "xpowered",
    name: "X-Powered-By Leak",
    status: xpb ? "warning" : "pass",
    scoreDelta: xpb ? 0 : 5,
    message: xpb ? `Tech stack terekspos: ${xpb}` : "Tidak ada kebocoran X-Powered-By.",
    suggestion: xpb ? "Hapus header X-Powered-By (Express/PHP/ASP)." : undefined,
  });

  // ===== QUALITY =====
  const ttfb = Math.round(tTtfb);
  const ttfbFast = ok && ttfb < 400;
  const ttfbOk = ok && ttfb < 800;
  checks.push({
    category: "quality",
    id: "ttfb",
    name: "Time to First Byte (TTFB)",
    status: ttfbFast ? "pass" : ttfbOk ? "warning" : "fail",
    scoreDelta: ttfbFast ? 20 : ttfbOk ? 12 : 0,
    message: ok
      ? `TTFB terukur ~${ttfb} ms (wall-clock).`
      : "Tidak dapat mengukur TTFB (koneksi gagal).",
    suggestion: ttfbFast ? undefined : "Gunakan caching (Redis/Varnish), CDN, dan optimasi DB agar TTFB < 400 ms.",
  });

  const enc = headersObj["content-encoding"] || "";
  const hasGzip = /gzip|br|deflate/i.test(enc);
  checks.push({
    category: "quality",
    id: "compression",
    name: "Content Compression",
    status: hasGzip ? "pass" : "warning",
    scoreDelta: hasGzip ? 15 : 0,
    message: hasGzip ? `Konten terkompresi (${enc}).` : "Tidak ada kompresi gzip/brotli.",
    suggestion: hasGzip ? undefined : "Aktifkan Brotli/gzip di web server atau CDN.",
  });

  const cc = headersObj["cache-control"] || "";
  const hasCache = /max-age|public|immutable/i.test(cc);
  checks.push({
    category: "quality",
    id: "cache",
    name: "Cache-Control Header",
    status: hasCache ? "pass" : "warning",
    scoreDelta: hasCache ? 10 : 0,
    message: cc ? `Cache-Control: ${cc}` : "Cache-Control tidak diatur.",
    suggestion: hasCache ? undefined : "Set Cache-Control yang sesuai untuk aset statis (max-age, immutable).",
  });

  const ct = headersObj["content-type"] || "";
  checks.push({
    category: "quality",
    id: "ct",
    name: "Content-Type",
    status: ct ? "pass" : "warning",
    scoreDelta: ct ? 8 : 0,
    message: ct ? `Content-Type: ${ct}` : "Tidak ada Content-Type.",
    suggestion: ct ? undefined : "Pastikan setiap response menyertakan Content-Type yang benar beserta charset.",
  });

  const hasTitle = /<title[^>]*>/i.test(text);
  const hasDesc = /name=["']description["']/i.test(text);
  const hasVP = /name=["']viewport["']/i.test(text);
  checks.push({
    category: "quality",
    id: "meta",
    name: "SEO Meta (title/description/viewport)",
    status: hasTitle && hasDesc && hasVP ? "pass" : "warning",
    scoreDelta: hasTitle && hasDesc && hasVP ? 15 : hasTitle ? 8 : 0,
    message: `Title: ${hasTitle ? "ada" : "TIDAK"}, Description: ${hasDesc ? "ada" : "TIDAK"}, Viewport: ${hasVP ? "ada" : "TIDAK"}.`,
    suggestion: hasTitle && hasDesc && hasVP ? undefined : "Tambahkan <title>, <meta name='description'>, dan <meta name='viewport'>.",
  });

  checks.push({
    category: "quality",
    id: "redirect",
    name: "Redirects",
    status: isRedirect ? "warning" : isSuccess ? "pass" : "fail",
    scoreDelta: isSuccess ? 10 : isRedirect ? 5 : 0,
    message: isSuccess
      ? "URL merespon langsung tanpa redirect."
      : isRedirect
      ? `Redirect ke: ${headersObj["location"] || "-"}`
      : `Status ${status}.`,
    suggestion: isSuccess ? undefined : "Kurangi redirect chain dan pastikan canonical URL memberikan 200.",
  });

  // ===== HEALTH =====
  checks.push({
    category: "health",
    id: "status",
    name: "HTTP Status Code",
    status: isSuccess ? "pass" : isRedirect ? "warning" : "fail",
    scoreDelta: isSuccess ? 20 : isRedirect ? 10 : 0,
    message: `Status: ${status || "(tidak ada response)"} ${statusText(status)}.`,
    suggestion: isSuccess ? undefined : `Perbaiki error pada halaman (status ${status}).`,
  });

  const cl = headersObj["content-length"];
  const size = cl ? parseInt(cl, 10) : text.length;
  const sizeOk = size < 1024 * 500;
  checks.push({
    category: "health",
    id: "size",
    name: "Page Size Estimate",
    status: sizeOk ? "pass" : "warning",
    scoreDelta: sizeOk ? 10 : 5,
    message: size > 0 ? `Ukuran response ~${(size / 1024).toFixed(1)} KB.` : "Tidak dapat mengukur ukuran.",
    suggestion: sizeOk ? undefined : "Kompress asset, hapus script yang tidak perlu, dan optimasi gambar.",
  });

  const cors = headersObj["access-control-allow-origin"];
  checks.push({
    category: "health",
    id: "cors",
    name: "CORS Header (API)",
    status: !ct.includes("application/json") ? "pass" : cors ? "pass" : "warning",
    scoreDelta: !ct.includes("application/json") ? 10 : cors ? 10 : 4,
    message: ct.includes("application/json")
      ? cors
        ? `Access-Control-Allow-Origin: ${cors}`
        : "Endpoint JSON tanpa CORS header."
      : "Halaman HTML (CORS tidak diperlukan).",
    suggestion: ct.includes("application/json") && !cors ? "Set Access-Control-Allow-Origin jika API diakses dari domain lain." : undefined,
  });

  // Aggregate
  const byCat: Record<string, TSCheck[]> = { security: [], quality: [], health: [] };
  for (const c of checks) byCat[c.category].push(c);

  const cats = {
    security: buildCat(byCat.security),
    quality: buildCat(byCat.quality),
    health: buildCat(byCat.health),
  };

  const overall = Math.round((cats.security.score + cats.quality.score + cats.health.score) / 3);

  const suggestions = checks
    .filter((c) => c.suggestion)
    .map((c) => ({ category: c.category, title: c.name, text: c.suggestion! }));

  return {
    target: {
      host: url.hostname,
      scheme: url.protocol.replace(":", ""),
      port: url.port ? parseInt(url.port, 10) : (url.protocol === "https:" ? 443 : 80),
      path: url.pathname || "/",
      ip: "",
      url: normalized,
      dnsOk: ok,
    },
    response: {
      ok,
      status,
      error: err,
      connectMs: 0, // fetch() tidak expose connect terpisah
      ttfbMs: Math.round(tTtfb),
      totalMs: Math.round(tTotal),
      server,
      contentType: ct,
      contentEncoding: enc,
      cacheControl: cc,
      location: headersObj["location"] || "",
    },
    security: cats.security,
    quality: cats.quality,
    health: cats.health,
    overall: { score: overall, label: scoreLabel(overall) },
    suggestions,
    engine: "typescript",
  };
}

function buildCat(list: TSCheck[]) {
  const score = Math.min(100, Math.max(0, list.reduce((a, c) => a + c.scoreDelta, 0)));
  return {
    score,
    label: scoreLabel(score),
    checks: list,
    suggestions: list.filter((c) => c.suggestion).map((c) => c.suggestion!),
  };
}

function statusText(code: number): string {
  const map: Record<number, string> = {
    200: "OK", 201: "Created", 204: "No Content",
    301: "Moved Permanently", 302: "Found", 304: "Not Modified", 307: "Temporary Redirect", 308: "Permanent Redirect",
    400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 408: "Request Timeout", 429: "Too Many Requests",
    500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable", 504: "Gateway Timeout",
  };
  return map[code] || "";
}
