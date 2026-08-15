# apk629jagtw4web

Repository untuk koleksi project web.

---

## Daftar Isi

| Folder | Deskripsi |
|--------|-----------|
| metal-loaders | Library animasi loading + icon + UI animation bergaya purple/black metal. Vite + React. |

---

## metal-loaders

Library animasi loading dengan UI bergaya purple/black metal industrial. Dibangun menggunakan Vite 8 + React 19.

### Fitur

- 218 animasi loading yang semuanya berbeda
- 110 custom SVG icons dalam 10 kategori
- 50 UI animations (card, swipe, text, hover, scroll, transition)
- 55 styling effects (glass, border, shadow, gradient, texture, button, input, card)
- Multi-page dengan React Router
- 13 kategori filter
- Search dan favorites
- Copy SVG/CSS per item
- Purple/black metal theme
- Responsive design

### Tech Stack

- Vite 8
- React 19
- React Router
- Pure CSS animations
- Custom SVG icons
- JetBrains Mono + Space Grotesk + Inter fonts

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
      Icons.jsx          -- Custom SVG icon components
      Navbar.jsx         -- Navigation bar
    data/
      animations.js      -- 218 loading animations data
      icons.js           -- 110 icons data
      uiAnimations.js    -- 50 UI animations
      styleEffects.js    -- 55 style effects
    pages/
      Home.jsx           -- Landing page
      LoadingLibrary.jsx -- Loading animations gallery
      IconLibraryPage.jsx-- Icon gallery
      AnimationLibrary.jsx -- UI animations gallery
      StylingPage.jsx    -- Styling effects gallery
    styles/
      global.css         -- Purple/black metal theme
      components.css     -- UI components
      animations.css     -- 218 loading animations CSS
      uiAnimations.css   -- 50 UI animations CSS
      styleEffects.css   -- 55 style effects CSS
    App.jsx
    main.jsx
  .github/
    workflows/
      deploy.yml         -- GitHub Actions CI/CD
  index.html
  package.json
  vite.config.js
```

### GitHub Actions

Workflow deploy otomatis setiap push ke branch main.

### Lisensi

Bebas digunakan untuk keperluan apapun.
