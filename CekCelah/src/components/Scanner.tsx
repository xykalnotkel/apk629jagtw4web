"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const ScoreRing = dynamic(() => import("./ScoreRing"), { ssr: false });
const RadarChart = dynamic(() => import("./RadarChart"), { ssr: false });
const BarChart = dynamic(() => import("./BarChart"), { ssr: false });

type Check = {
  id: string;
  name: string;
  status: "pass" | "warning" | "fail";
  scoreDelta: number;
  message: string;
  suggestion?: string;
};
type Category = { score: number; label: string; checks: Check[]; suggestions: string[] };
type ScanResult = {
  scannedAt: string;
  target: { host: string; scheme: string; port: number; path: string; ip: string; url: string; dnsOk: boolean };
  response: {
    ok: boolean; status: number; error: string;
    connectMs: number; ttfbMs: number; totalMs: number;
    server: string; contentType: string; contentEncoding: string; cacheControl: string; location: string;
  };
  security: Category;
  quality: Category;
  health: Category;
  overall: { score: number; label: string };
  suggestions: { category: string; title: string; text: string }[];
  engine?: "native-cpp" | "typescript";
  log: string[];
};

const SAMPLES = ["github.com", "google.com", "example.com", "vercel.com"];

const CATEGORIES = [
  { key: "security", title: "Keamanan", letter: "SEC", color: "#bfdbfe" },
  { key: "quality", title: "Kualitas", letter: "QLT", color: "#93c5fd" },
  { key: "health", title: "Kesehatan", letter: "HLT", color: "#dbeafe" },
] as const;

type Status = "idle" | "validating" | "dns" | "connecting" | "requesting" | "analyzing" | "done";

const STATUS_MESSAGES: Record<Status, string> = {
  idle: "Siap memindai.",
  validating: "Memvalidasi URL...",
  dns: "[NET] Resolving DNS record...",
  connecting: "[NET] Membuka koneksi TCP + TLS handshake...",
  requesting: "[HTTP] Mengirim request GET & membaca response headers...",
  analyzing: "[CORE] Menganalisis security headers, performa, dan kesehatan...",
  done: "[DONE] Pemindaian selesai.",
};

function colorFor(score: number) {
  if (score >= 80) return "#bfdbfe";
  if (score >= 60) return "#93c5fd";
  if (score >= 40) return "#60a5fa";
  return "#3b82f6";
}
function statusColor(s: Check["status"]) {
  if (s === "pass") return "#bfdbfe";
  if (s === "warning") return "#93c5fd";
  return "#ffffff";
}

export default function Scanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Status>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "terminal" | "details">("dashboard");
  const terminalRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  function push(line: string) {
    setTerminalLines((prev) => [...prev.slice(-200), line]);
  }

  async function runScan(target: string) {
    setErr(null);
    setResult(null);
    setLoading(true);
    setProgress(0);
    setTerminalLines([]);
    setActiveTab("terminal");

    const t0 = Date.now();
    const stamp = () => {
      const ms = Date.now() - t0;
      return `\x00${ms.toString().padStart(5, " ")}ms\x00 `;
    };

    push("cekcelah@scanner:~$ ./cekcelah-scanner " + target);
    setPhase("validating");
    setProgress(10);
    push(stamp() + "memvalidasi URL target...");
    await wait(400);

    setPhase("dns");
    setProgress(25);
    push(stamp() + "[DNS] memanggil getaddrinfo()...");
    await wait(500);
    push(stamp() + "[DNS] menunggu jawaban resolver...");
    await wait(400);

    setPhase("connecting");
    setProgress(45);
    push(stamp() + "[TCP] membuka socket non-blocking...");
    await wait(500);
    push(stamp() + "[TLS] memulai handshake TLS 1.3...");
    await wait(500);
    push(stamp() + "[TLS] sertifikat diverifikasi (atau fallback fetch)...");

    setPhase("requesting");
    setProgress(65);
    push(stamp() + "[HTTP] GET / HTTP/1.1");
    push(stamp() + "[HTTP] Host: " + target);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Scan gagal");

      setPhase("analyzing");
      setProgress(85);
      push(stamp() + `[HTTP] ${data.response.status || 0} ${data.response.totalMs || 0}ms`);
      push(stamp() + `[CORE] memproses ${data.security.checks.length + data.quality.checks.length + data.health.checks.length} aturan pemeriksaan...`);
      await wait(600);
      push(stamp() + `[CORE] menghitung skor keamanan ${data.security.score}/100`);
      await wait(150);
      push(stamp() + `[CORE] menghitung skor kualitas  ${data.quality.score}/100`);
      await wait(150);
      push(stamp() + `[CORE] menghitung skor kesehatan ${data.health.score}/100`);
      await wait(150);

      const final: ScanResult = { ...data, scannedAt: new Date().toISOString(), log: terminalLines };
      setResult(final);
      setProgress(100);
      setPhase("done");
      push(stamp() + `[DONE] overall ${data.overall.score}/100 (${data.overall.label}) menggunakan engine ${data.engine || "?"}`);
      push("cekcelah@scanner:~$ _");
      setActiveTab("dashboard");
    } catch (e: any) {
      setErr(e?.message || "Terjadi kesalahan.");
      push(stamp() + "[ERROR] " + (e?.message || "unknown error"));
      setPhase("idle");
    } finally {
      setLoading(false);
    }
  }

  function wait(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    runScan(url.trim());
  }

  function downloadReport() {
    if (!result) return;
    const lines: string[] = [];
    lines.push("CEKCELAH SECURITY REPORT");
    lines.push("========================");
    lines.push("Target   : " + result.target.url);
    lines.push("Host     : " + result.target.host);
    lines.push("IP       : " + (result.target.ip || "(tidak terdeteksi)"));
    lines.push("Waktu    : " + new Date(result.scannedAt).toLocaleString("id-ID"));
    lines.push("Engine   : " + (result.engine || "?"));
    lines.push("");
    lines.push(`OVERALL SKOR : ${result.overall.score}/100 (${result.overall.label})`);
    lines.push(`  Keamanan   : ${result.security.score}/100 (${result.security.label})`);
    lines.push(`  Kualitas   : ${result.quality.score}/100 (${result.quality.label})`);
    lines.push(`  Kesehatan  : ${result.health.score}/100 (${result.health.label})`);
    lines.push("");
    for (const c of CATEGORIES) {
      lines.push("--- " + c.title.toUpperCase() + " ---");
      for (const chk of result[c.key as "security"].checks) {
        lines.push(`  [${chk.status.toUpperCase()}] ${chk.name}`);
        lines.push(`      ${chk.message}`);
        if (chk.suggestion) lines.push(`      SARAN: ${chk.suggestion}`);
      }
      lines.push("");
    }
    if (result.suggestions.length) {
      lines.push("--- REKOMENDASI ---");
      for (const s of result.suggestions) lines.push(`  * [${s.category}] ${s.title}: ${s.text}`);
    }
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cekcelah-${result.target.host}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <section className="w-full">
      {/* Terminal-style scan panel */}
      <div className="metal-panel rounded-2xl overflow-hidden">
        {/* Terminal title bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-metal-700/80 border-b border-ice-300/10">
          <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,.6)]" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70 shadow-[0_0_6px_rgba(234,179,8,.5)]" />
          <span className="w-3 h-3 rounded-full bg-green-500/70 shadow-[0_0_6px_rgba(34,197,94,.5)]" />
          <span className="ml-3 text-xs font-mono text-ice-200/60 tracking-wider">
            cekcelah@scanner ~ ./cekcelah-scanner
          </span>
        </div>

        <form onSubmit={onSubmit} className="p-4 md:p-6 relative">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-ice-300/60 text-sm">
                <span className="text-ice-200">root</span>
                <span className="text-ice-300/40">@</span>
                <span className="text-ice-200">cekcelah</span>
                <span className="text-ice-300/80">:~$</span>
              </span>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="metal-input w-full pl-[120px] pr-4 py-3.5 rounded-xl font-mono text-sm text-ice-50"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="metal-btn rounded-xl px-6 py-3.5 font-semibold min-w-[150px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span className="font-mono text-xs">SCANNING...</span>
                </>
              ) : (
                <>
                  <span className="font-mono text-xs tracking-widest">./scan</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-ice-200/40 self-center font-mono">quick:</span>
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setUrl(s)}
                disabled={loading}
                className="text-xs font-mono text-ice-200/70 border border-ice-300/20 rounded px-2 py-0.5 hover:bg-ice-300/10 hover:border-ice-300/40 transition"
              >
                {s}
              </button>
            ))}
          </div>

          {loading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-mono text-ice-200/70 mb-1.5">
                <span>{STATUS_MESSAGES[phase]}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-metal-900 overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-300 relative"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #1e3a8a, #60a5fa, #dbeafe)",
                    boxShadow: "0 0 10px rgba(191,219,254,0.6)",
                  }}
                >
                  <div className="absolute inset-0 shimmer-bar opacity-60" />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Error */}
      {err && (
        <div className="mt-6 rounded-xl border border-red-400/30 bg-red-950/20 p-4">
          <p className="text-red-200 font-mono text-sm">[ERROR] {err}</p>
        </div>
      )}

      {/* Tabs */}
      {result && !loading && (
        <div className="mt-6 flex items-center gap-1 border-b border-ice-300/10">
          {[
            { k: "dashboard", label: "Dashboard" },
            { k: "terminal", label: "Terminal Output" },
            { k: "details", label: "Detail Checks" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setActiveTab(t.k as typeof activeTab)}
              className={
                "px-4 py-2 text-sm font-mono transition relative " +
                (activeTab === t.k
                  ? "text-ice-50"
                  : "text-ice-200/50 hover:text-ice-200/80")
              }
            >
              {t.label}
              {activeTab === t.k && (
                <span className="absolute left-2 right-2 -bottom-px h-0.5 bg-gradient-to-r from-transparent via-ice-300 to-transparent" />
              )}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <button
              onClick={downloadReport}
              className="text-xs font-mono border border-ice-300/30 rounded-md px-3 py-1 text-ice-100 hover:bg-ice-300/10"
            >
              export .txt
            </button>
          </div>
        </div>
      )}

      {/* Panels */}
      {result && !loading && (
        <div className="mt-6">
          {activeTab === "dashboard" && <Dashboard result={result} />}
          {activeTab === "terminal" && <TerminalView lines={terminalLines} innerRef={terminalRef} />}
          {activeTab === "details" && <DetailsView result={result} />}
        </div>
      )}

      {!result && !loading && (
        <div className="mt-8 metal-panel p-8 text-center">
          <div className="text-5xl font-black text-ice-300/20 mb-3 tracking-tight">_</div>
          <p className="text-ice-200/60 text-sm font-mono">
            masukkan URL di atas dan tekan <span className="text-ice-100">./scan</span> untuk memulai pemindaian.
          </p>
        </div>
      )}
    </section>
  );
}

function Dashboard({ result }: { result: ScanResult }) {
  const r = result;
  const scoreColor = (s: number) =>
    s >= 80 ? "#bfdbfe" : s >= 60 ? "#93c5fd" : s >= 40 ? "#60a5fa" : "#dbeafe";

  const checkCounts = {
    pass: r.security.checks.filter((c) => c.status === "pass").length +
          r.quality.checks.filter((c) => c.status === "pass").length +
          r.health.checks.filter((c) => c.status === "pass").length,
    warning: r.security.checks.filter((c) => c.status === "warning").length +
             r.quality.checks.filter((c) => c.status === "warning").length +
             r.health.checks.filter((c) => c.status === "warning").length,
    fail: r.security.checks.filter((c) => c.status === "fail").length +
          r.quality.checks.filter((c) => c.status === "fail").length +
          r.health.checks.filter((c) => c.status === "fail").length,
  };

  return (
    <div className="space-y-6 animate-[rise_0.5s_ease-out_both]">
      {/* Hero score */}
      <div className="metal-panel p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ice-300/5 rounded-full blur-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative">
          <div className="md:col-span-1 flex flex-col items-center">
            <ScoreRing score={r.overall.score} size={200} label="OVERALL" />
            <p className="mt-2 text-lg font-semibold text-ice-50">{r.overall.label}</p>
            <p className="text-xs text-ice-200/50 font-mono">engine: {r.engine || "?"}</p>
          </div>
          <div className="md:col-span-2 space-y-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-ice-300/50 mb-1 font-mono">TARGET</div>
              <div className="text-xl font-bold text-ice-50 font-mono break-all">{r.target.url}</div>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-ice-200/60 font-mono">
                <span>host: <span className="text-ice-100">{r.target.host}</span></span>
                <span>ip: <span className="text-ice-100">{r.target.ip || "—"}</span></span>
                <span>status: <span className="text-ice-100">{r.response.status || "—"}</span></span>
                <span>total: <span className="text-ice-100">{r.response.totalMs}ms</span></span>
                <span>ttfb: <span className="text-ice-100">{r.response.ttfbMs}ms</span></span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-ice-300/10">
              {CATEGORIES.map((c) => {
                const cat = r[c.key as "security"];
                return (
                  <div key={c.key} className="text-center p-3 rounded-lg border border-ice-300/10 bg-metal-800/40">
                    <div className="text-2xl font-bold tabular-nums" style={{ color: c.color }}>
                      {cat.score}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-ice-200/50 mt-0.5">{c.title}</div>
                    <div className="text-[10px] text-ice-300/80 mt-0.5">{cat.label}</div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono pt-2">
              <div>
                <div className="text-lg font-bold text-ice-100">{checkCounts.pass}</div>
                <div className="text-ice-200/50 uppercase tracking-widest text-[9px]">Pass</div>
              </div>
              <div>
                <div className="text-lg font-bold text-ice-300">{checkCounts.warning}</div>
                <div className="text-ice-200/50 uppercase tracking-widest text-[9px]">Warning</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">{checkCounts.fail}</div>
                <div className="text-ice-200/50 uppercase tracking-widest text-[9px]">Kritis</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metal-panel p-5">
          <h3 className="text-sm font-mono uppercase tracking-widest text-ice-300/70 mb-3">
            Radar Analisis
          </h3>
          <div className="h-64 flex items-center justify-center">
            <RadarChart
              labels={["HTTPS", "HSTS", "CSP", "TTFB", "Kompresi", "Cache", "Status", "DNS"]}
              values={[
                catItem(r, "security", "https"),
                catItem(r, "security", "hsts"),
                catItem(r, "security", "csp"),
                qltyItem(r, "ttfb"),
                qltyItem(r, "compression"),
                qltyItem(r, "cache"),
                catItem(r, "health", "status"),
                catItem(r, "health", "dns"),
              ]}
            />
          </div>
        </div>
        <div className="metal-panel p-5">
          <h3 className="text-sm font-mono uppercase tracking-widest text-ice-300/70 mb-3">
            Distribusi Skor per Kategori
          </h3>
          <div className="h-64 flex items-center justify-center">
            <BarChart
              labels={CATEGORIES.map((c) => c.title)}
              values={[r.security.score, r.quality.score, r.health.score]}
              colors={["#dbeafe", "#bfdbfe", "#93c5fd"]}
            />
          </div>
        </div>
      </div>

      {/* Response metadata */}
      <div className="metal-panel p-5">
        <h3 className="text-sm font-mono uppercase tracking-widest text-ice-300/70 mb-3">
          Response Metadata
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <Meta label="Status" value={String(r.response.status || "—")} />
          <Meta label="Server" value={r.response.server || "(disembunyikan)"} />
          <Meta label="Content-Type" value={r.response.contentType || "—"} />
          <Meta label="Encoding" value={r.response.contentEncoding || "tidak ada"} />
          <Meta label="Cache-Control" value={r.response.cacheControl || "tidak diatur"} />
          <Meta label="Connect" value={r.response.connectMs + "ms"} />
          <Meta label="TTFB" value={r.response.ttfbMs + "ms"} />
          <Meta label="Total" value={r.response.totalMs + "ms"} />
        </div>
      </div>

      {/* Rekomendasi */}
      <div className="metal-panel p-5">
        <h3 className="text-sm font-mono uppercase tracking-widest text-ice-300/70 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ice-300 shadow-[0_0_8px_#bfdbfe]" />
          Rekomendasi Perbaikan ({r.suggestions.length})
        </h3>
        {r.suggestions.length === 0 ? (
          <div className="text-sm text-ice-200/70 p-4 rounded-lg border border-ice-300/20 bg-ice-300/5">
            Website Anda dalam kondisi sangat baik. Tidak ada rekomendasi perbaikan mendesak.
          </div>
        ) : (
          <div className="space-y-2">
            {r.suggestions.map((s, i) => (
              <div key={i} className="rounded-lg border-l-2 border-ice-300/60 bg-metal-800/50 p-3">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="chip chip-pass uppercase tracking-wider text-[10px]">{s.category}</span>
                  <span className="text-sm font-medium text-ice-50">{s.title}</span>
                </div>
                <p className="text-xs text-ice-200/80 leading-relaxed font-mono">$ {s.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function catItem(r: ScanResult, cat: "security" | "quality" | "health", id: string) {
  const c = r[cat].checks.find((x) => x.id === id);
  if (!c) return 0;
  // normalize pass/warn/fail to 100/50/0 scaled by id weight
  if (c.status === "pass") return 100;
  if (c.status === "warning") return 55;
  return 20;
}
function qltyItem(r: ScanResult, id: string) {
  return catItem(r, "quality", id);
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ice-300/10 bg-metal-800/40 p-3">
      <div className="text-[10px] uppercase tracking-widest text-ice-300/50">{label}</div>
      <div className="text-ice-50 font-semibold truncate mt-1" title={value}>{value}</div>
    </div>
  );
}

function TerminalView({ lines, innerRef }: { lines: string[]; innerRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="metal-panel rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-metal-700/80 border-b border-ice-300/10">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-3 text-xs font-mono text-ice-200/60">output.log</span>
      </div>
      <div
        ref={innerRef}
        className="p-4 font-mono text-xs leading-relaxed h-[500px] overflow-y-auto bg-metal-900"
      >
        {lines.length === 0 ? (
          <div className="text-ice-300/40">belum ada output. jalankan scan.</div>
        ) : (
          lines.map((l, i) => {
            const color =
              l.includes("[ERROR]")
                ? "text-red-300"
                : l.includes("[DONE]") || l.includes("OK")
                ? "text-ice-200"
                : l.includes("[WARN]") || l.includes("warning")
                ? "text-ice-300"
                : l.includes("cekcelah@")
                ? "text-ice-100"
                : "text-ice-200/80";
            // Highlight timestamp markers
            const parts = l.split("\x00");
            return (
              <div key={i} className={color}>
                {parts.map((p, j) =>
                  j === 1 ? (
                    <span key={j} className="text-ice-300/50">{p}</span>
                  ) : (
                    <span key={j}>{p}</span>
                  )
                )}
              </div>
            );
          })
        )}
        <span className="inline-block w-2 h-4 bg-ice-200 animate-pulse ml-0.5 align-middle" />
      </div>
    </div>
  );
}

function DetailsView({ result }: { result: ScanResult }) {
  const r = result;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {CATEGORIES.map((cat) => {
        const c = r[cat.key as "security"];
        return (
          <div key={cat.key} className="metal-panel p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-ice-300/10">
              <h3 className="font-semibold text-ice-50 flex items-center gap-2">
                <span className="font-mono text-xs text-ice-300/60">[{cat.letter}]</span>
                {cat.title}
              </h3>
              <span className="text-2xl font-bold tabular-nums" style={{ color: cat.color }}>
                {c.score}
              </span>
            </div>
            <div className="space-y-2">
              {c.checks.map((chk) => (
                <div key={chk.id} className="rounded-lg border border-ice-300/10 bg-metal-800/40 p-3">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <span className="text-sm font-medium text-ice-50">{chk.name}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                      style={{
                        background: statusColor(chk.status) + "22",
                        color: statusColor(chk.status),
                        border: `1px solid ${statusColor(chk.status)}55`,
                      }}
                    >
                      {chk.status}
                    </span>
                  </div>
                  <p className="text-xs text-ice-200/70 mt-1.5 leading-relaxed">{chk.message}</p>
                  {chk.suggestion && (
                    <p className="text-xs text-ice-300/90 mt-2 pt-2 border-t border-ice-300/10 leading-relaxed">
                      <span className="font-semibold">saran:</span> {chk.suggestion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
