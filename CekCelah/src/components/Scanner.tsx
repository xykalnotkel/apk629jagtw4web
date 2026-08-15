"use client";

import { useState, useEffect } from "react";
import ScoreRing from "./ScoreRing";
import CheckList, { type Check } from "./CheckList";

type CategoryResult = {
  score: number;
  label: string;
  checks: Check[];
  suggestions: string[];
};

type ScanResult = {
  scannedAt: string;
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
  security: CategoryResult;
  quality: CategoryResult;
  health: CategoryResult;
  overall: { score: number; label: string };
  suggestions: { category: string; title: string; text: string }[];
  engine?: "native-cpp" | "typescript";
};

const SAMPLES = ["example.com", "google.com", "github.com", "cloudflare.com"];
const HISTORY_KEY = "cekcelah_history_v1";

function loadHistory(): ScanResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, 10) : [];
  } catch {
    return [];
  }
}

function saveHistory(list: ScanResult[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 10)));
  } catch {}
}

function exportPDF(result: ScanResult) {
  const w = window.open("", "_blank", "width=900,height=1100");
  if (!w) {
    alert("Popup diblokir browser. Izinkan popup untuk export laporan.");
    return;
  }

  const row = (k: string, v: string) => `<tr><td style="padding:6px 10px;border:1px solid #1e3a8a;color:#0b1a3f;font-weight:600;width:40%">${k}</td><td style="padding:6px 10px;border:1px solid #dbeafe;color:#0f2557;font-family:ui-monospace,monospace">${v}</td></tr>`;

  const checkRows = (title: string, color: string, cat: CategoryResult) => {
    const items = cat.checks.map(c => {
      const badge = c.status === "pass" ? "AMAN" : c.status === "warning" ? "PERINGATAN" : "KRITIS";
      const bg = c.status === "pass" ? "#dbeafe" : c.status === "warning" ? "#93c5fd" : "#1e3a8a";
      const fg = c.status === "fail" ? "#ffffff" : "#0b1a3f";
      return `<tr>
        <td style="padding:8px 10px;border:1px solid #dbeafe;color:#0f2557;font-weight:500">${c.name}</td>
        <td style="padding:8px 10px;border:1px solid #dbeafe;text-align:center"><span style="background:${bg};color:${fg};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700">${badge}</span></td>
        <td style="padding:8px 10px;border:1px solid #dbeafe;color:#0b1a3f;font-size:13px">${c.message}${c.suggestion ? `<br><span style="color:#1e3a8a"><b>Saran:</b> ${c.suggestion}</span>` : ""}</td>
      </tr>`;
    }).join("");
    return `
      <h3 style="color:${color};margin:24px 0 8px;border-bottom:2px solid ${color};padding-bottom:6px">${title} — Skor: ${cat.score}/100 (${cat.label})</h3>
      <table style="width:100%;border-collapse:collapse;margin-top:10px;font-size:13px">
        <thead><tr><th style="padding:8px 10px;background:#1e3a8a;color:#f7fbff;text-align:left;border:1px solid #1e3a8a">Item</th><th style="padding:8px 10px;background:#1e3a8a;color:#f7fbff;border:1px solid #1e3a8a;width:100px">Status</th><th style="padding:8px 10px;background:#1e3a8a;color:#f7fbff;text-align:left;border:1px solid #1e3a8a">Detail</th></tr></thead>
        <tbody>${items}</tbody>
      </table>
    `;
  };

  const sugItems = result.suggestions.map(s => `
    <li style="margin-bottom:8px"><b>[${s.category.toUpperCase()}]</b> ${s.title} &mdash; <span style="color:#1e3a8a">${s.text}</span></li>
  `).join("");

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Laporan CekCelah — ${result.target.host}</title>
    <style>
      body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:0;padding:32px;color:#0b1a3f;background:#f7fbff}
      h1{font-family:Impact,Arial Black,sans-serif;font-style:italic;letter-spacing:.03em;color:#0f2557;margin:0 0 4px;text-shadow:1px 1px 0 #1e3a8a,2px 2px 0 #1e3a8a,3px 3px 0 #12306b;transform:skewX(-8deg);display:inline-block}
      .badge{display:inline-block;background:#1e3a8a;color:#f7fbff;padding:6px 14px;border-radius:6px;font-weight:700;font-size:14px;margin-left:8px}
      table{width:100%;border-collapse:collapse}
      .score-box{display:inline-block;text-align:center;padding:12px 20px;border:2px solid #1e3a8a;border-radius:10px;margin:4px;background:linear-gradient(180deg,#dbeafe,#f7fbff)}
      .score-big{font-size:32px;font-weight:900;color:#0b1a3f}
      @media print{body{padding:0}}
    </style>
  </head><body>
    <div style="text-align:center;margin-bottom:24px">
      <h1>CekCelah</h1>
      <div style="color:#1e3a8a;font-size:12px;letter-spacing:.3em;margin-top:6px">WEB SECURITY · QUALITY · HEALTH</div>
    </div>

    <h2 style="color:#0b1a3f;border-bottom:2px solid #1e3a8a;padding-bottom:6px">Ringkasan — ${result.target.host}</h2>
    <p style="color:#12306b"><b>URL:</b> ${result.target.url} &nbsp;·&nbsp; <b>Waktu scan:</b> ${new Date(result.scannedAt).toLocaleString("id-ID")} &nbsp;·&nbsp; <b>Engine:</b> ${result.engine === "native-cpp" ? "Native C++" : "TypeScript"}</p>

    <div style="text-align:center;margin:20px 0">
      <div class="score-box"><div class="score-big">${result.overall.score}</div><div style="font-size:11px;letter-spacing:.2em;color:#1e3a8a">OVERALL — ${result.overall.label}</div></div>
      <div class="score-box"><div class="score-big">${result.security.score}</div><div style="font-size:11px;letter-spacing:.2em;color:#1e3a8a">KEAMANAN</div></div>
      <div class="score-box"><div class="score-big">${result.quality.score}</div><div style="font-size:11px;letter-spacing:.2em;color:#1e3a8a">KUALITAS</div></div>
      <div class="score-box"><div class="score-big">${result.health.score}</div><div style="font-size:11px;letter-spacing:.2em;color:#1e3a8a">KESEHATAN</div></div>
    </div>

    <h3 style="color:#0f2557;margin:24px 0 8px;border-bottom:2px solid #1e3a8a;padding-bottom:6px">Informasi Target</h3>
    <table>${row("Host", result.target.host)}${row("URL", result.target.url)}${row("IP", result.target.ip || "-")}${row("HTTP Status", String(result.response.status))}${row("TTFB", result.response.ttfbMs + " ms")}${row("Connect", result.response.connectMs + " ms")}${row("Total", result.response.totalMs + " ms")}${row("Server", result.response.server || "(disembunyikan)")}${row("Content-Encoding", result.response.contentEncoding || "tidak ada")}</table>

    ${checkRows("Keamanan", "#1e3a8a", result.security)}
    ${checkRows("Kualitas", "#12306b", result.quality)}
    ${checkRows("Kesehatan", "#0b1a3f", result.health)}

    <h3 style="color:#0f2557;margin:24px 0 8px;border-bottom:2px solid #1e3a8a;padding-bottom:6px">Rekomendasi Perbaikan</h3>
    <ol style="padding-left:20px;color:#0b1a3f;font-size:13px;line-height:1.5">${sugItems || "<li>Tidak ada rekomendasi mendesak. Pertahankan konfigurasi yang sudah baik.</li>"}</ol>

    <div style="text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #dbeafe;color:#1e3a8a;font-size:11px;letter-spacing:.2em">
      Dihasilkan oleh CekCelah &mdash; Native C++ + Next.js
      <div style="margin-top:8px"><button onclick="window.print()" style="background:#1e3a8a;color:#f7fbff;border:0;padding:8px 18px;border-radius:6px;cursor:pointer;font-weight:700;letter-spacing:.1em">CETAK / SIMPAN PDF</button></div>
    </div>
  </body></html>`;

  w.document.open();
  w.document.write(html);
  w.document.close();
}

export default function Scanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Siap");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  async function runScan(targetUrl: string) {
    setErr(null);
    setResult(null);
    setLoading(true);
    setProgress(5);
    setStatus("Memvalidasi URL...");

    const steps = [
      { p: 12, s: "Menyiapkan scanner..." },
      { p: 25, s: "Resolve DNS (getaddrinfo)..." },
      { p: 40, s: "Membuka koneksi TCP ke server..." },
      { p: 55, s: "Mengirim request HTTP/1.1..." },
      { p: 70, s: "Membaca response header & body..." },
      { p: 84, s: "Menganalisis security headers..." },
      { p: 92, s: "Menghitung skor & membuat saran otomatis..." },
      { p: 100, s: "Selesai." },
    ];
    let i = 0;
    const timer = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i].p);
        setStatus(steps[i].s);
        i++;
      }
    }, 350);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Scan gagal");
      }
      const finalResult: ScanResult = { ...data, scannedAt: new Date().toISOString() };
      setResult(finalResult);
      const newHist = [finalResult, ...loadHistory().filter(h => h.target.url !== finalResult.target.url)].slice(0, 10);
      saveHistory(newHist);
      setHistory(newHist);
    } catch (e: any) {
      setErr(e?.message || "Terjadi kesalahan");
    } finally {
      clearInterval(timer);
      setProgress(100);
      setStatus("Selesai");
      setLoading(false);
      setTimeout(() => setProgress(0), 600);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    runScan(url.trim());
  }

  function labelColor(score: number) {
    if (score >= 85) return "text-ice-50";
    if (score >= 65) return "text-ice-100";
    if (score >= 45) return "text-ice-200";
    return "text-ice-300";
  }

  function clearHistory() {
    saveHistory([]);
    setHistory([]);
  }

  return (
    <section className="w-full">
      <form onSubmit={onSubmit} className="metal-panel brushed p-5 md:p-7 relative overflow-hidden">
        <div className="absolute top-3 left-3 rivet" />
        <div className="absolute top-3 right-3 rivet" />
        <div className="absolute bottom-3 left-3 rivet" />
        <div className="absolute bottom-3 right-3 rivet" />

        <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
          <h2 className="text-lg font-semibold text-ice-50 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-ice-300 shadow-[0_0_8px_#bfdbfe]" />
            Mulai Pemindaian
          </h2>
          <button
            type="button"
            onClick={() => setShowHistory(v => !v)}
            className="text-xs text-ice-200/80 border border-ice-300/20 rounded-md px-3 py-1 hover:bg-ice-300/10 hover:border-ice-300/40 transition"
          >
            Riwayat ({history.length})
          </button>
        </div>
        <p className="text-sm text-ice-200/60 mb-5">
          Masukkan URL website. Scanner C++ native melakukan DNS-resolve, TCP connect,
          HTTP probe, dan analisis header secara langsung.
        </p>

        {showHistory && history.length > 0 && (
          <div className="mb-4 rounded-lg border border-ice-300/15 bg-metal-800/40 p-3 max-h-48 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-ice-300/60">10 scan terakhir</span>
              <button type="button" onClick={clearHistory} className="text-xs text-ice-300/70 hover:text-ice-50">Hapus semua</button>
            </div>
            <div className="space-y-1">
              {history.map((h, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setResult(h); setUrl(h.target.url); setShowHistory(false); window.scrollTo({ top: document.getElementById("hasil")?.offsetTop || 0, behavior: "smooth" }); }}
                  className="w-full text-left flex items-center justify-between gap-3 text-xs px-2 py-1.5 rounded hover:bg-ice-300/10"
                >
                  <span className="font-mono text-ice-100 truncate">{h.target.host}</span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className={`font-bold tabular-nums ${labelColor(h.overall.score)}`}>{h.overall.score}</span>
                    <span className="text-ice-200/50">{new Date(h.scannedAt).toLocaleString("id-ID", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" })}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        {showHistory && history.length === 0 && (
          <div className="mb-4 rounded-lg border border-ice-300/10 bg-metal-800/40 p-3 text-xs text-ice-200/50">
            Belum ada riwayat scan. Riwayat tersimpan di browser Anda.
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ice-300/70 font-mono font-bold">/</span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://contoh.com"
              className="metal-input w-full pl-11 pr-4 py-3.5 rounded-xl text-ice-50"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="metal-btn rounded-xl px-6 py-3.5 font-semibold min-w-[160px] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Memindai...
              </>
            ) : (
              <>CEK CELAH</>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs text-ice-200/50 self-center mr-1">Contoh:</span>
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setUrl(s); }}
              className="text-xs text-ice-200/80 border border-ice-300/20 rounded-full px-3 py-1 hover:bg-ice-300/10 hover:border-ice-300/40 transition"
              disabled={loading}
            >
              {s}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-ice-200/70 mb-1.5">
              <span>{status}</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-metal-900 overflow-hidden">
              <div
                className="h-full shimmer-bar rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </form>

      {err && (
        <div className="mt-6 metal-panel p-4 border-l-4 border-l-ice-100">
          <p className="text-ice-50 font-medium">Error</p>
          <p className="text-sm text-ice-200/80 mt-1">{err}</p>
        </div>
      )}

      {result && !loading && (
        <div id="hasil" className="mt-8 space-y-6 animate-[rise_0.5s_ease-out_both]">
          <div className="metal-panel p-6 relative">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <h2 className="text-lg font-semibold text-ice-50">Hasil Pemindaian</h2>
              <button
                onClick={() => exportPDF(result)}
                className="metal-btn rounded-lg px-4 py-2 text-sm font-semibold"
              >
                Export Laporan (PDF/Cetak)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1 flex flex-col items-center justify-center">
                <ScoreRing score={result.overall.score} label="OVERALL" size={180} />
                <p className={`mt-2 text-lg font-semibold ${labelColor(result.overall.score)}`}>
                  {result.overall.label}
                </p>
              </div>
              <div className="md:col-span-2 grid grid-cols-3 gap-4">
                {[
                  { key: "security", data: result.security, title: "Keamanan", letter: "S" },
                  { key: "quality", data: result.quality, title: "Kualitas", letter: "Q" },
                  { key: "health", data: result.health, title: "Kesehatan", letter: "H" },
                ].map((c) => (
                  <div key={c.key} className="text-center rounded-xl border border-ice-300/10 bg-metal-800/40 p-3">
                    <div className="text-xl mb-1 font-black text-ice-300 tracking-widest">{c.letter}</div>
                    <div className="text-2xl font-bold text-ice-50 tabular-nums">{c.data.score}</div>
                    <div className="text-[11px] uppercase tracking-wider text-ice-200/60">{c.title}</div>
                    <div className={`text-xs font-medium mt-1 ${labelColor(c.data.score)}`}>
                      {c.data.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-metal-800/60 border border-ice-300/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase tracking-widest text-ice-300/60">Target</div>
                  <span className={`chip ${result.engine === "native-cpp" ? "chip-pass" : "chip-warn"}`}>
                    {result.engine === "native-cpp" ? "NATIVE C++" : "TYPESCRIPT FALLBACK"}
                  </span>
                </div>
                <div className="space-y-1 text-ice-100">
                  <div><span className="text-ice-300/60">Host:</span> <span className="font-mono">{result.target.host}</span></div>
                  <div><span className="text-ice-300/60">URL:</span> <span className="font-mono break-all">{result.target.url}</span></div>
                  <div><span className="text-ice-300/60">IP:</span> <span className="font-mono">{result.target.ip || "-"}</span></div>
                  <div><span className="text-ice-300/60">Waktu:</span> <span className="font-mono">{new Date(result.scannedAt).toLocaleString("id-ID")}</span></div>
                </div>
              </div>
              <div className="rounded-lg bg-metal-800/60 border border-ice-300/10 p-4">
                <div className="text-xs uppercase tracking-widest text-ice-300/60 mb-2">Response</div>
                <div className="grid grid-cols-2 gap-1 text-ice-100 text-xs">
                  <div>Status: <span className="font-mono text-ice-50">{result.response.status || "-"}</span></div>
                  <div>TTFB: <span className="font-mono text-ice-50">{result.response.ttfbMs} ms</span></div>
                  <div>Connect: <span className="font-mono text-ice-50">{result.response.connectMs} ms</span></div>
                  <div>Total: <span className="font-mono text-ice-50">{result.response.totalMs} ms</span></div>
                  <div className="col-span-2">Server: <span className="font-mono text-ice-50">{result.response.server || "(disembunyikan)"}</span></div>
                  <div className="col-span-2">Encoding: <span className="font-mono text-ice-50">{result.response.contentEncoding || "tidak ada"}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { key: "security", data: result.security, title: "Detail Keamanan" },
              { key: "quality", data: result.quality, title: "Detail Kualitas" },
              { key: "health", data: result.health, title: "Detail Kesehatan" },
            ].map((c) => (
              <div key={c.key} className="metal-panel p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-ice-50">{c.title}</h3>
                  <span className={`text-2xl font-bold tabular-nums ${labelColor(c.data.score)}`}>
                    {c.data.score}
                  </span>
                </div>
                <CheckList checks={c.data.checks} />
              </div>
            ))}
          </div>

          <div className="metal-panel p-6">
            <h3 className="font-semibold text-ice-50 mb-4 flex items-center gap-2">
              Saran Perbaikan Otomatis
              <span className="text-xs font-normal text-ice-300/60">
                ({result.suggestions.length} rekomendasi)
              </span>
            </h3>
            {result.suggestions.length === 0 ? (
              <div className="rounded-lg border border-ice-300/30 bg-ice-300/5 p-4 text-ice-100">
                <p className="font-medium">Website Anda dalam kondisi sangat baik.</p>
                <p className="text-sm text-ice-200/70 mt-1">
                  Tidak ada rekomendasi perbaikan mendesak. Pertahankan konfigurasi keamanan dan performa yang sudah solid.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {result.suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border-l-2 border-ice-300/60 bg-metal-800/50 p-4"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="chip chip-pass uppercase tracking-wider">{s.category}</span>
                      <span className="text-sm font-medium text-ice-50">{s.title}</span>
                    </div>
                    <p className="text-sm text-ice-200/80 leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
