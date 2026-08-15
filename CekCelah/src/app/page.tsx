import Scanner from "@/components/Scanner";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg metal-btn flex items-center justify-center font-black text-lg italic" style={{ letterSpacing: "0.05em" }}>C</div>
      <div className="relative">
        <span className="graffiti-text text-2xl md:text-3xl" data-text="CekCelah">
          CekCelah
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-32 w-[500px] h-[500px] rounded-full bg-deep/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-ice-300/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-deep/30 blur-3xl" />

      <header className="sticky top-0 z-40 backdrop-blur-md bg-metal-900/70 border-b border-ice-300/10">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-7 text-sm text-ice-200/80">
            <a href="#scanner" className="hover:text-ice-50 transition">Scanner</a>
            <a href="#fitur" className="hover:text-ice-50 transition">Fitur</a>
            <a href="#teknologi" className="hover:text-ice-50 transition">Teknologi</a>
          </nav>
          <a href="#scanner" className="metal-btn rounded-lg px-4 py-2 text-sm font-semibold">
            Mulai Scan
          </a>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 pt-14 md:pt-20 pb-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ice-300/20 bg-metal-800/60 px-3 py-1 text-xs text-ice-200/80 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ice-300 animate-pulseSoft shadow-[0_0_8px_#bfdbfe]" />
            Native C++ Engine · Next.js 14 · 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-ice-50">
            Cek <span className="graffiti-text text-5xl md:text-7xl" data-text="Celah">Celah</span>
            <span className="block text-ice-200/80 text-2xl md:text-3xl font-bold mt-3 italic">
              Website Security · Quality · Health
            </span>
          </h1>
          <p className="mt-6 text-ice-200/70 max-w-2xl mx-auto leading-relaxed">
            Scanner web <span className="text-ice-50 font-semibold">native C++</span> yang cepat dan ringan,
            dengan antarmuka modern di atas <span className="text-ice-50 font-semibold">Next.js 14 (App Router)</span>.
            Temukan celah keamanan, ukur kualitas performa, dan cek kesehatan server secara otomatis,
            lengkap dengan saran perbaikan yang siap diimplementasikan.
          </p>
        </div>
      </section>

      <section id="scanner" className="max-w-6xl mx-auto px-5 py-6">
        <Scanner />
      </section>

      <section id="fitur" className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-ice-50 text-center mb-3">
          Fitur Unggulan
        </h2>
        <p className="text-center text-ice-200/60 mb-10 max-w-xl mx-auto">
          Stack modern dengan engine native yang mengakses jaringan secara langsung;
          hasil riil tanpa simulasi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { t: "Native C++ Engine", d: "Scanner berjalan sebagai binary C++20 statically-linked: DNS resolve, TCP connect, HTTP probe langsung dari sistem — cepat dan akurat.", l: "[N]" },
            { t: "Next.js 14 App Router", d: "Frontend dibangun dengan React Server Components dan Route Handler API modern, responsif di semua perangkat.", l: "[R]" },
            { t: "Security Header Audit", d: "Deteksi HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, cookie flags, dan server leak.", l: "[S]" },
            { t: "Performa & TTFB Riil", d: "Pengukuran waktu koneksi, TTFB, dan total respon yang sebenarnya dari socket call native, bukan perkiraan.", l: "[T]" },
            { t: "Saran Perbaikan Otomatis", d: "Setiap celah atau masalah yang ditemukan langsung dilengkapi rekomendasi teknis yang bisa diterapkan developer.", l: "[!]" },
            { t: "Laporan PDF & Riwayat", d: "Ekspor laporan ke PDF/cetak dan simpan hingga 10 riwayat scan terakhir di browser Anda.", l: "[P]" },
            { t: "Jalan di Vercel Tanpa VPS", d: "Binary C++ di-compile static dan ikut ter-commit, sehingga dieksekusi langsung di serverless function Vercel.", l: "[V]" },
            { t: "Desain Metal 2-Warna", d: "UI metalik premium dengan palet hanya dua warna: deep blue dan ice white-blue — bersih dan tegas.", l: "[M]" },
            { t: "Tanpa Emoji", d: "Seluruh UI, dokumen, dan laporan menggunakan simbol tipografi. Tidak ada emoji di mana pun.", l: "[-]" },
          ].map((f) => (
            <div key={f.t} className="metal-panel brushed p-5 relative">
              <div className="absolute top-2 left-2 rivet" />
              <div className="absolute top-2 right-2 rivet" />
              <div className="text-2xl mb-3 font-black text-ice-300 tracking-widest">{f.l}</div>
              <h3 className="text-lg font-semibold text-ice-50 mb-1.5">{f.t}</h3>
              <p className="text-sm text-ice-200/70 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="teknologi" className="max-w-6xl mx-auto px-5 py-12">
        <div className="metal-panel p-8 text-center">
          <h2 className="text-2xl font-bold text-ice-50 mb-2">Di Balik Layar</h2>
          <p className="text-ice-200/60 mb-6 text-sm">Stack yang digunakan CekCelah</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["Next.js 14", "React 18", "TypeScript", "Tailwind CSS", "C++20", "POSIX Sockets", "App Router", "Static Native Binary", "Vercel Ready"].map((t) => (
              <span key={t} className="chip" style={{ background: "rgba(30,58,138,0.25)", borderColor: "rgba(191,219,254,0.3)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-ice-300/10 mt-10">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-ice-200/50">
          <Logo />
          <p>© 2026 CekCelah · Dibuat dengan C++ dan Next.js · Untuk web yang lebih aman.</p>
        </div>
      </footer>
    </main>
  );
}
