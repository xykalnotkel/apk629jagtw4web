import { Link } from 'react-router-dom';

const stats = [
  { label: 'Loading Animations', value: '223+' },
  { label: 'Custom Icons', value: '100+' },
  { label: 'UI Animations', value: '50+' },
  { label: 'Styling Effects', value: '50+' },
];

const libraries = [
  { path: '/loaders', title: 'Loading Library', desc: '223 unique loading animations across 13 categories. Pure CSS, copy and use.', count: '223', icon: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4' },
  { path: '/icons', title: 'Icon Library', desc: '100+ custom SVG icons. Industrial, interface, nature, tech categories.', count: '100', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { path: '/animations', title: 'Animation Library', desc: '50+ card, swipe, text, and transition animations for interactive UI.', count: '50', icon: 'M5 3v18l7-3 7 3V3z' },
  { path: '/styling', title: 'Styling Effects', desc: '50+ UI styling effects: glassmorphism, neumorphism, glow, border effects.', count: '50', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z' },
];

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg"/>
        <div className="hero-content">
          <div className="hero-badge">Open Source Design System</div>
          <h1 className="hero-title">
            <span className="hero-purple">VAULT</span> UI
          </h1>
          <p className="hero-desc">
            Industrial-grade animation and icon library. 400+ unique assets built with pure CSS and custom SVG. Zero dependencies. Purple metal aesthetic.
          </p>
          <div className="hero-actions">
            <Link to="/loaders" className="btn btn-primary">Explore Loaders</Link>
            <Link to="/icons" className="btn btn-outline">Browse Icons</Link>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        {stats.map(s => (
          <div key={s.label} className="stat-item">
            <span className="stat-val">{s.value}</span>
            <span className="stat-lbl">{s.label}</span>
          </div>
        ))}
      </section>

      <section className="libraries-grid">
        {libraries.map(lib => (
          <Link key={lib.path} to={lib.path} className="lib-card metal-texture">
            <div className="lib-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d={lib.icon}/>
              </svg>
            </div>
            <div className="lib-info">
              <h3>{lib.title}</h3>
              <p>{lib.desc}</p>
            </div>
            <div className="lib-count">{lib.count}+</div>
          </Link>
        ))}
      </section>

      <section className="tech-section">
        <h2 className="section-title">Built With</h2>
        <div className="tech-grid">
          {['React 19','Vite 8','Pure CSS','SVG','JetBrains Mono','Space Grotesk','React Router','GitHub Actions'].map(t => (
            <div key={t} className="tech-badge">{t}</div>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <p>VAULT UI v3.0 -- Industrial Design System -- All assets pure CSS/SVG</p>
      </footer>
    </div>
  );
}
