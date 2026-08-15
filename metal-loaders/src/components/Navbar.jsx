import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { path: '/loaders', label: 'Loaders', icon: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' },
  { path: '/icons', label: 'Icons', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { path: '/animations', label: 'Animations', icon: 'M5 3v18l7-3 7 3V3z' },
  { path: '/styling', label: 'Styling', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" strokeDasharray="4 2"/>
            <circle cx="12" cy="12" r="4"/>
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
          </svg>
          <div className="logo-text">
            <span className="logo-title">VAULT UI</span>
            <span className="logo-sub">Industrial Design System</span>
          </div>
        </Link>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${loc.pathname === item.path ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon}/>
              </svg>
              {item.label}
            </Link>
          ))}
        </div>

        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
          </svg>
        </button>
      </div>
    </nav>
  );
}
