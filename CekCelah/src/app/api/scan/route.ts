import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { URL } from "url";
import { scanWithTS } from "@/lib/scanner-ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 25;

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
    if (!u.hostname || !/^[a-z0-9.-]+$/i.test(u.hostname)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

function findBinary(cwd: string): string | null {
  const candidates = [
    path.join(cwd, "backend", "cekcelah-scanner"),
    path.join(cwd, "..", "backend", "cekcelah-scanner"),
    path.join(process.cwd(), "backend", "cekcelah-scanner"),
    path.join("/var/task", "backend", "cekcelah-scanner"), // Vercel
    path.join("/var/task", "..", "backend", "cekcelah-scanner"),
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

function runScanner(targetUrl: string, binPath: string): Promise<ChecksOutput> {
  return new Promise((resolve, reject) => {
    // Make sure binary is executable (serverless FS sometimes drops x bit)
    try { fs.chmodSync(binPath, 0o755); } catch {}

    const proc = spawn(binPath, [targetUrl], {
      timeout: 20000,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, LD_LIBRARY_PATH: "" },
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("error", (e) => reject(e));
    proc.on("close", (code) => {
      if (code !== 0 && !stdout) {
        return reject(new Error(`Scanner exit ${code}: ${stderr || "unknown error"}`));
      }
      try {
        resolve(parseOutput(stdout));
      } catch (e: any) {
        reject(new Error("Gagal parse output scanner: " + e.message));
      }
    });
  });
}

type ParsedKV = Record<string, string>;
type ChecksOutput = {
  kv: ParsedKV;
  checks: Check[];
};

function parseOutput(raw: string): ChecksOutput {
  const lines = raw.split(/\r?\n/);
  const kv: ParsedKV = {};
  const checks: Check[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split("\t");
    const kind = parts[0];

    if (kind === "CHECK") {
      // CHECK \t category \t id \t name \t status \t scoreDelta \t message \t suggestion
      const [_, category, id, name, status, deltaStr, message, suggestion] = parts;
      const scoreDelta = parseInt(deltaStr || "0", 10) || 0;
      const statusNorm = (["pass", "warning", "fail"].includes(status) ? status : "warning") as Check["status"];
      checks.push({
        category: category as Check["category"],
        id,
        name,
        status: statusNorm,
        scoreDelta,
        message: unescapeLine(message || ""),
        suggestion: suggestion ? unescapeLine(suggestion) : undefined,
      });
    } else {
      kv[kind] = parts.length > 1 ? parts.slice(1).join("\t") : "";
    }
  }
  return { kv, checks };
}

function unescapeLine(s: string): string {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\");
}

function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Baik";
  if (score >= 55) return "Cukup";
  if (score >= 35) return "Buruk";
  return "Kritis";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const input = typeof body?.url === "string" ? body.url : "";
  const targetUrl = normalizeUrl(input);
  if (!targetUrl) {
    return NextResponse.json({ error: "URL tidak valid." }, { status: 400 });
  }

  try {
    const cwd = process.cwd();
    const bin = findBinary(cwd);
    const useNative = !!bin;

    if (useNative && bin) {
      // === Jalankan scanner C++ native static binary (works di Vercel/serverless) ===
      const { kv, checks } = await runScanner(targetUrl, bin);

      const byCat: Record<string, Check[]> = { security: [], quality: [], health: [] };
      for (const c of checks) byCat[c.category]?.push(c);

      const cats: Record<string, { score: number; label: string; checks: Check[]; suggestions: string[] }> = {};
      for (const cat of ["security", "quality", "health"] as const) {
        const list = byCat[cat] || [];
        const score = Math.min(
          100,
          Math.max(0, list.reduce((acc, c) => acc + (c.scoreDelta || 0), 0))
        );
        cats[cat] = {
          score,
          label: scoreLabel(score),
          checks: list,
          suggestions: list.filter((c) => c.suggestion).map((c) => c.suggestion!)
        };
      }

      const overallScore = Math.round((cats.security.score + cats.quality.score + cats.health.score) / 3);
      const parsedTarget = new URL(targetUrl);

      const suggestions = checks
        .filter((c) => c.suggestion)
        .map((c) => ({ category: c.category, title: c.name, text: c.suggestion! }));

      return NextResponse.json({
        target: {
          host: kv.HOST || parsedTarget.hostname,
          scheme: kv.SCHEME || parsedTarget.protocol.replace(":", ""),
          port: parseInt(kv.PORT || (parsedTarget.protocol === "https:" ? "443" : "80"), 10),
          path: kv.PATH || parsedTarget.pathname,
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
        suggestions,
        engine: "native-cpp",
      });
    }

    // === Fallback: gunakan scanner TypeScript (cocok untuk Vercel/serverless) ===
    const ts = await scanWithTS(targetUrl);
    return NextResponse.json(ts);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Terjadi kesalahan saat menjalankan scanner." },
      { status: 500 }
    );
  }
}
