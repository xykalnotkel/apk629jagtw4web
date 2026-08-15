import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { URL } from "url";
import { scanWithTS } from "@/lib/scanner-ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Check = {
  category: "security" | "quality" | "health";
  id: string;
  name: string;
  status: "pass" | "warning" | "fail";
  scoreDelta: number;
  message: string;
  suggestion?: string;
};

function normalizeUrl(input: string): string | null {
  let s = input.trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (!u.hostname) return null;
    return u.toString();
  } catch {
    return null;
  }
}

function findBinary(cwd: string): string | null {
  const candidates = [
    path.join(cwd, "backend", "cekcelah-scanner"),
    path.join(process.cwd(), "backend", "cekcelah-scanner"),
    path.join("/var/task", "backend", "cekcelah-scanner"),
  ];
  for (const b of candidates) {
    try {
      if (fs.existsSync(b)) {
        try { fs.chmodSync(b, 0o755); } catch {}
        return b;
      }
    } catch {}
  }
  return null;
}

function runScanner(
  targetUrl: string,
  binPath: string
): Promise<{ kv: Record<string, string>; checks: Check[] }> {
  return new Promise((resolve, reject) => {
    try { fs.chmodSync(binPath, 0o755); } catch {}
    const proc = spawn(binPath, [targetUrl], {
      timeout: 15000,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, LD_LIBRARY_PATH: "" },
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code !== 0 && !stdout) return reject(new Error(`scanner exit ${code}: ${stderr || ""}`));
      const kv: Record<string, string> = {};
      const checks: Check[] = [];
      for (const line of stdout.split(/\r?\n/)) {
        if (!line.trim()) continue;
        const parts = line.split("\t");
        if (parts[0] === "CHECK") {
          const [, category, id, name, status, deltaStr, message, suggestion] = parts;
          checks.push({
            category: category as Check["category"],
            id,
            name,
            status: (["pass", "warning", "fail"].includes(status) ? status : "warning") as Check["status"],
            scoreDelta: parseInt(deltaStr || "0", 10) || 0,
            message: message || "",
            suggestion: suggestion || undefined,
          });
        } else {
          kv[parts[0]] = parts.slice(1).join("\t");
        }
      }
      resolve({ kv, checks });
    });
  });
}

function scoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Baik";
  if (score >= 55) return "Cukup";
  if (score >= 35) return "Buruk";
  return "Kritis";
}

function resultFromNative(kv: Record<string, string>, checks: Check[], targetUrl: string) {
  const byCat: Record<string, Check[]> = { security: [], quality: [], health: [] };
  for (const c of checks) byCat[c.category]?.push(c);
  const cats: Record<string, { score: number; label: string; checks: Check[]; suggestions: string[] }> = {};
  for (const cat of ["security", "quality", "health"] as const) {
    const list = byCat[cat] || [];
    const score = Math.min(100, Math.max(0, list.reduce((a, c) => a + (c.scoreDelta || 0), 0)));
    cats[cat] = {
      score,
      label: scoreLabel(score),
      checks: list,
      suggestions: list.filter((c) => c.suggestion).map((c) => c.suggestion!),
    };
  }
  const parsed = new URL(targetUrl);
  const overallScore = Math.round((cats.security.score + cats.quality.score + cats.health.score) / 3);
  return {
    target: {
      host: kv.HOST || parsed.hostname,
      scheme: kv.SCHEME || parsed.protocol.replace(":", ""),
      port: parseInt(kv.PORT || (parsed.protocol === "https:" ? "443" : "80"), 10),
      path: kv.PATH || parsed.pathname,
      ip: kv.IP || "",
      url: targetUrl,
      dnsOk: kv.DNS_OK === "true",
    },
    response: {
      ok: kv.REACHABLE === "true",
      status: parseInt(kv.STATUS || "0", 10) || 0,
      error: kv.ERROR || "",
      connectMs: parseFloat(kv.CONNECT_MS || "0") || 0,
      ttfbMs: parseFloat(kv.TTFB_MS || "0") || 0,
      totalMs: parseFloat(kv.TOTAL_MS || "0") || 0,
      server: kv.SERVER || "",
      contentType: kv.CONTENT_TYPE || "",
      contentEncoding: kv.CONTENT_ENCODING || "",
      cacheControl: kv.CACHE_CONTROL || "",
      location: kv.LOCATION || "",
    },
    security: cats.security,
    quality: cats.quality,
    health: cats.health,
    overall: { score: overallScore, label: scoreLabel(overallScore) },
    suggestions: checks.filter((c) => c.suggestion).map((c) => ({ category: c.category, title: c.name, text: c.suggestion! })),
    engine: "native-cpp" as const,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const input = typeof body?.url === "string" ? body.url : "";
  const targetUrl = normalizeUrl(input);
  if (!targetUrl) return NextResponse.json({ error: "URL tidak valid." }, { status: 400 });

  // On Vercel / serverless environment, binary cannot do TLS handshake (we don't link OpenSSL),
  // so we always prefer the TypeScript fetch engine which handles HTTPS natively.
  // The native C++ binary is used when running locally with HTTP targets or when
  // FORCE_NATIVE=1 is set.
  const forceNative = process.env.FORCE_NATIVE === "1";
  const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

  try {
    if (forceNative || (!isServerless && findBinary(process.cwd()))) {
      const bin = findBinary(process.cwd());
      if (bin) {
        try {
          const { kv, checks } = await runScanner(targetUrl, bin);
          // If native scanner failed to read a response (e.g. plain HTTP to TLS port),
          // fall through to TS engine.
          const status = parseInt(kv.STATUS || "0", 10);
          const reachable = kv.REACHABLE === "true";
          if (reachable && status > 0) {
            return NextResponse.json(resultFromNative(kv, checks, targetUrl));
          }
        } catch (e) {
          // fall through to TS engine
          console.warn("native engine failed:", (e as Error).message);
        }
      }
    }

    const ts = await scanWithTS(targetUrl);
    return NextResponse.json(ts);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Terjadi kesalahan saat menjalankan scanner." },
      { status: 500 }
    );
  }
}
