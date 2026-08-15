# apk629jagtw4web

Repository untuk koleksi project web.

---

## Daftar Isi

| Folder | Deskripsi |
|--------|-----------|
| metal-loaders | Library animasi loading bergaya industrial/metal. 123 variasi unik, pure CSS, tanpa dependency. |

---

## metal-loaders

Library animasi loading dengan UI bergaya industrial metal. Dibangun menggunakan Vite + React.

### Fitur

- 123 animasi loading yang semuanya berbeda
- 12 kategori: Mechanical, Spinner, Dots, Morphing, Bars, Pulse, Geometric, Wave, 3D, Digital, Nature, Abstract
- Custom SVG icon library (28 icon)
- Search dan filter berdasarkan kategori
- Sistem favorites (tersimpan di localStorage)
- Copy CSS per animasi
- Grid dan List view
- Responsive (mobile-friendly)
- Dark metal theme (copper, chrome, steel)

### Tech Stack

- Vite 8
- React 19
- Pure CSS animations (no animation libraries)
- JetBrains Mono font

### Cara Menjalankan

```bash
cd metal-loaders
npm install
npm run dev
```

Buka browser di `http://localhost:3000`

### Struktur Folder

```
metal-loaders/
  src/
    components/
      IconLibrary.jsx    -- 28 custom SVG icons
    data/
      animations.js      -- Data 123 animasi + kategori
    styles/
      global.css         -- Theme metal (warna, font, texture)
      animations.css     -- Semua keyframes animasi
      components.css     -- Styling card, header, filter, dll
    App.jsx              -- Komponen utama
    main.jsx             -- Entry point React
  index.html
  package.json
  vite.config.js
```

### Cara Pakai Animasi

Setiap animasi dibuat dengan pure CSS. Untuk menggunakan salah satu animasi:

1. Copy class dan keyframes dari `src/styles/animations.css`
2. Tambahkan HTML sesuai struktur animasi yang dipilih
3. Sesuaikan warna di CSS variables

### Lisensi

Bebas digunakan untuk keperluan apapun.
