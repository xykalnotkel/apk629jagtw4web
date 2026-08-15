# CekCelah

**Web Security · Quality · Health Scanner**

CekCelah adalah tool pemindaian website yang mengukur tiga aspek penting: keamanan (security headers, HTTPS, leak), kualitas (performa, kompresi, SEO meta), dan kesehatan (status, DNS, reachability).

---

## Stack Teknologi

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend API**: Next.js Route Handler (`/api/scan`)
- **Scanner Engine**: Binary native **C++20 statically-linked** (POSIX sockets, DNS via `getaddrinfo`, HTTP/1.1 probe langsung ke target)
- **Fallback Engine**: Scanner TypeScript dengan `fetch()` native (otomatis dipakai jika binary tidak ada)
- **UI**: Palet dua warna (deep blue `#1e3a8a` + ice white-blue `#bfdbfe`), desain metalik brushed dengan rivet, tidak ada emoji di mana pun
- **Logo**: Gaya graffiti chrome 2D ke 3D menggunakan CSS murni
- **Fitur tambahan**: Ekspor laporan PDF/cetak, riwayat 10 scan terakhir tersimpan di localStorage

## Yang Dicek

### Keamanan (Security)
- HTTPS / TLS
- Strict-Transport-Security (HSTS)
- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Server version disclosure
- X-Powered-By leak
- Cookie Secure / HttpOnly flags

### Kualitas (Quality)
- Time To First Byte (TTFB)
- Content-Encoding (gzip / brotli)
- Cache-Control header
- Content-Type
- Tag `<title>`, meta description, viewport
- Redirect

### Kesehatan (Health)
- HTTP status code
- DNS resolution
- Server reachability / TCP connect
- Page size
- Port consistency
- Keep-Alive
- CORS (untuk endpoint JSON)

Setiap temuan dilengkapi **saran perbaikan otomatis** dalam Bahasa Indonesia yang bisa langsung diterapkan developer.

## Menjalankan di Lokal

```bash
# 1. Install dependency
npm install

# 2. Compile scanner C++ (menghasilkan binary statically-linked)
npm run build:scanner
# Atau kompilasi manual:
g++ -std=c++20 -O2 -static -static-libgcc -static-libstdc++ \
    -o backend/cekcelah-scanner backend/scanner.cpp

# 3. Jalankan dev server
npm run dev
# Buka http://localhost:3000
```

Binary C++ otomatis dipakai jika tersedia. Jika tidak ada (misal saat deploy di platform yang tidak mengizinkan eksekusi binary), sistem akan otomatis fallback ke scanner TypeScript.

## Repository Structure

```
cekcelah/
├── backend/
│   ├── scanner.cpp          # Source C++20 scanner (POSIX sockets)
│   └── cekcelah-scanner     # Binary static (tidak di-gitignore)
├── public/
│   ├── favicon.svg          # Icon (SVG metalik)
│   └── og.png               # Social card 1200x630
├── src/
│   ├── app/
│   │   ├── api/scan/route.ts  # POST endpoint (spawn binary atau fallback TS)
│   │   ├── globals.css        # Style Tailwind + custom metal/gradient
│   │   ├── layout.tsx         # Root layout + metadata
│   │   └── page.tsx           # Halaman utama
│   ├── components/
│   │   ├── Scanner.tsx        # Form, hasil, export PDF, riwayat
│   │   ├── CheckList.tsx      # Daftar temuan per kategori
│   │   └── ScoreRing.tsx      # Donut chart skor (SVG + Chart.js)
│   └── lib/
│       └── scanner-ts.ts      # Fallback TypeScript scanner
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── next.config.js
└── vercel.json                # Config Vercel (maxDuration 25s)
```

## Deploy ke Vercel

CekCelah dirancang agar bisa langsung di-deploy ke Vercel **tanpa kartu kredit** dan **tanpa VPS tambahan**:

1. Push repo ini ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new) dan login dengan GitHub
3. Pilih repo CekCelah, klik **Import**
4. Framework preset otomatis terdeteksi sebagai Next.js
5. Klik **Deploy** — tunggu sekitar 1 menit

Binary C++ dikompilasi secara static (`-static -static-libgcc -static-libstdc++`) dan ikut ter-commit ke repository. Route handler akan:
1. Mendeteksi keberadaan binary di filesystem Vercel
2. Memberi izin eksekusi (`chmod +x`)
3. Menjalankan binary via `child_process.spawn()` dengan timeout 20 detik
4. Parsing output line-based dan mengembalikan JSON ke frontend

Jika karena alasan apa pun binary tidak bisa berjalan (misal perubahan sandbox Vercel), API akan otomatis fallback ke TypeScript scanner yang juga melakukan request HTTP nyata lewat `fetch()`.

### Apakah Butuh VPS / Render / Railway?

Tidak perlu. Dengan static linking, binary C++ tidak memiliki dependency ke library sistem apa pun selain kernel Linux. Vercel dan Netlify menjalankan fungsi di Linux x86_64, sehingga binary bisa dieksekusi langsung.

Cloudflare Pages saat ini tidak mengizinkan eksekusi binary native di Pages Functions (hanya mendukung isolate V8), jadi untuk full native engine gunakan Vercel atau platform Node.js serverless lain yang mengizinkan spawn proses. Jika deploy ke Cloudflare Pages, sistem otomatis menggunakan TypeScript fallback.

## Catatan Penting

- Gunakan tool ini hanya pada website yang Anda miliki atau yang Anda punya izin tertulis untuk memindai. Pemindaian tanpa izin dapat melanggar undang-undang ITE dan Terms of Service penyedia layanan.
- Scanner ini melakukan probe HTTP/HTTPS dasar dan pengecekan header. Ini bukan pengganti penetration test menyeluruh atau vulnerability scanner profesional.
- User-agent request adalah `CekCelah/1.0 (Native Security Scanner)` agar dapat dikenali oleh server target.

## Cara Kerja Scanner C++

1. Parse URL (tambahkan `https://` jika tidak ada skema)
2. Resolve hostname ke IPv4 dengan `getaddrinfo()`
3. Buat socket non-blocking, hubungkan (TCP connect) dengan timeout
4. Ukur waktu koneksi
5. Kirim HTTP/1.1 `GET` request lengkap dengan Host header
6. Baca response sampai header selesai (`\r\n\r\n`) + sebagian body untuk cek tag meta
7. Catat TTFB dan total waktu
8. Evaluasi 20+ aturan keamanan, kualitas, dan kesehatan
9. Hitung skor per kategori (maks 100)
10. Keluarkan hasil dalam format line-based key-value + list CHECK yang mudah di-parse

## Lisensi

MIT — bebas dipakai, dimodifikasi, dan di-deploy untuk keperluan pribadi maupun komersial.
