import Scanner from "@/components/Scanner";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-lg metal-btn flex items-center justify-center font-black text-lg italic" style={{ letterSpacing: "0.05em" }}>
        <span className="relative" style={{ textShadow: "0 1px 2px rgba(0,0,0,.5)" }}>C</span>
      </div>
      <div className="relative">
        <span className="graffiti-text text-2xl md:text-3xl" data-text="CekCelah">CekCelah</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Background glows */}
      <div className="pointer-events-none fixed -top-40 -left-32 w-[600px] h-[600px] rounded-full bg-deep/30 blur-3xl" />
      <div className="pointer-events-none fixed top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-ice-300/5 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full bg-deep/20 blur-3xl" />
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-metal-900/70 border-b border-ice-300/10">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-7 text-sm text-ice-200/75 font-mono">
            <a href="#scanner" className="hover:text-ice-50 transition">./scanner</a>
            <a href="#fitur" className="hover:text-ice-50 transition">./fitur</a>
            <a href="#stack" className="hover:text-ice-50 transition">./stack</a>
          </nav>
          <a href="#scanner" className="metal-btn rounded-lg px-4 py-2 text-sm font-semibold font-mono">
            ./scan
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-12 md:pt-20 pb-4 relative">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-md border border-ice-300/20 bg-metal-800/60 px-3 py-1 font-mono text-[11px] text-ice-200/80 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ice-300 animate-pulse shadow-[0_0_8px_#bfdbfe]" />
            <span>$</span>
            <span className="text-ice-100">native-cpp-engine</span>
            <span className="text-ice-300/50">//</span>
            <span>nextjs-14</span>
            <span className="text-ice-300/50">//</span>
            <span>v1.0.0</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
            <span className="block text-ice-50 italic">Cek</span>
            <span className="graffiti-text text-6xl md:text-8xl lg:text-9xl" data-text="Celah">Celah</span>
            <span className="block text-ice-200/70 text-xl md:text-2xl font-bold mt-4 italic font-sans not-italic tracking-normal">
              Web Security · Quality · Health Scanner
            </span>
          </h1>
          <p className="mt-6 text-ice-200/70 max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-mono">
            <span className="text-ice-300">$</span> Pemindai website dengan engine native C++20 dan antarmuka Next.js.
            Audit keamanan, ukur kualitas, cek kesehatan server. Hasil riil, saran perbaikan otomatis,
            laporan bisa di-export.
          </p>
        </div>
      </section>

      {/* Scanner */}
      <section id="scanner" className="max-w-6xl mx-auto px-5 py-8 relative z-10">
        <Scanner />
      </section>

      {/* Features */}
      <section id="fitur" className="max-w-6xl mx-auto px-5 py-16 relative">
        <div className="mb-10 text-center">
          <div className="inline-block font-mono text-[11px] text-ice-300/60 mb-2 tracking-widest">// FEATURES</div>
          <h2 className="text-2xl md:text-3xl font-bold text-ice-50">Fitur Utama</h2>
          <p className="text-ice-200/60 text-sm mt-2 max-w-xl mx-auto">
            Engine native C++ dengan analisis header riil, antarmuka terminal-style, visualisasi grafik, dan saran perbaikan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { k: "[00]", t: "Native C++ Engine", d: "Binary statically-linked x86_64. DNS resolve via getaddrinfo, TCP non-blocking connect, HTTP/1.1 probe langsung tanpa dependensi." },
            { k: "[01]", t: "Terminal Output", d: "Real-time log bergaya CLI dengan timestamp, tahapan scan, dan status kode warna persis terminal Linux." },
            { k: "[02]", t: "Radar & Bar Chart", d: "Visualisasi radar 8 dimensi (HTTPS, HSTS, CSP, TTFB, kompresi, cache, status, DNS) dan distribusi skor kategori." },
            { k: "[03]", t: "Security Headers", d: "Deteksi HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, cookie flags, server leak." },
            { k: "[04]", t: "Performance Metrics", d: "Ukur TTFB, status code, content-encoding (gzip/brotli), cache-control, content-type, page size." },
            { k: "[05]", t: "Auto Suggestions", d: "Setiap temuan disertai saran perbaikan teknis dalam Bahasa Indonesia yang bisa langsung diimplementasikan." },
            { k: "[06]", t: "Export Laporan", d: "Download laporan sebagai file .txt plaintext yang rapi untuk dokumentasi tim/devOps." },
            { k: "[07]", t: "Vercel Ready", d: "Binary static ikut ter-commit, API route otomatis detect environment. Deploy 1 klik tanpa VPS atau kartu kredit." },
            { k: "[08]", t: "2-Color Metal UI", d: "Palet hanya dua warna (deep blue + ice white-blue) dengan tekstur metal brushed chrome, rivet, dan gradient chrome 3D." },
          ].map((f) => (
            <div key={f.k} className="metal-panel brushed p-5 relative group">
              <div className="absolute top-2 left-2 rivet" />
              <div className="absolute top-2 right-2 rivet" />
              <div className="font-mono text-[10px] text-ice-300/50 tracking-widest mb-2">{f.k}</div>
              <h3 className="text-lg font-semibold text-ice-50 mb-1.5 flex items-center gap-2">
                {f.t}
              </h3>
              <p className="text-sm text-ice-200/70 leading-relaxed font-mono">
                <span className="text-ice-300/50"># </span>{f.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="max-w-6xl mx-auto px-5 py-12 relative">
        <div className="metal-panel p-8">
          <div className="text-center mb-6">
            <div className="font-mono text-[11px] text-ice-300/60 mb-2 tracking-widest">// TECH STACK</div>
            <h2 className="text-2xl font-bold text-ice-50">Di Balik Layar</h2>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Next.js 14 (App Router)",
              "React 18",
              "TypeScript 5",
              "Tailwind CSS 3",
              "C++20 (POSIX sockets)",
              "Statically-linked ELF x86_64",
              "Node.js 20 Runtime",
              "Vercel Serverless",
              "GitHub Actions CI/CD",
              "Chrome SVG Charts",
              "getaddrinfo DNS",
              "non-blocking TCP",
            ].map((t) => (
              <span
                key={t}
                className="chip chip-pass font-mono"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-ice-300/10 mt-10 relative">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-ice-200/50 font-mono">
          <Logo />
          <p>$ echo "© 2026 CekCelah -- built with C++ and Next.js"; exit 0</p>
        </div>
      </footer>
    </main>
  );
}
