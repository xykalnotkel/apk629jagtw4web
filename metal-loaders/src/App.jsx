import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { animations, categories } from './data/animations';
import { icons } from './components/IconLibrary';
import './styles/global.css';
import './styles/animations.css';
import './styles/components.css';

/* ─── Animation Stage JSX ─── */
function AnimStage({ id }) {
  const n = String(id).padStart(3, '0');
  const cls = `anim-${n}`;
  
  switch(id) {
    case 1: return <div className={`anim-stage ${cls}`}><div className="ring"/></div>;
    case 2: return <div className={`anim-stage ${cls}`}><div className="r1"/><div className="r2"/></div>;
    case 3: return <div className={`anim-stage ${cls}`}><i/><i/><i/></div>;
    case 4: return <div className={`anim-stage ${cls}`}><div className="blob"/></div>;
    case 5: return <div className={`anim-stage ${cls}`}><div className="ring"/></div>;
    case 6: return <div className={`anim-stage ${cls}`}>{Array.from({length:8},(_,i)=><i key={i} style={{animationDelay:`${i*.1}s`}}/>)} </div>;
    case 7: return <div className={`anim-stage ${cls}`}><div className="card"/></div>;
    case 8: return <div className={`anim-stage ${cls}`}><div className="radar"/></div>;
    case 9: return <div className={`anim-stage ${cls}`}><div className="heart"/></div>;
    case 10: return <div className={`anim-stage ${cls}`}><div className="inf"/></div>;
    case 11: return <div className={`anim-stage ${cls}`}>{Array.from({length:8},(_,i)=><i key={i} style={{animationDelay:`${i*.12}s`}}/>)} </div>;
    case 12: return <div className={`anim-stage ${cls}`}><div className="piston"/><div className="base"/></div>;
    case 13: return <div className={`anim-stage ${cls}`}><div className="gbox"/></div>;
    case 14: return <div className={`anim-stage ${cls}`}><div className="belt"/></div>;
    case 15: return <div className={`anim-stage ${cls}`}><div className="center"/><div className="orbit"/><div className="orbit"/></div>;
    case 16: return <div className={`anim-stage ${cls}`}><div className="arm"/></div>;
    case 17: return <div className={`anim-stage ${cls}`}><div className="crt"/></div>;
    case 18: return <div className={`anim-stage ${cls}`}><div className="spring"/><div className="ball"/></div>;
    case 19: return <div className={`anim-stage ${cls}`}><div className="drop"/></div>;
    case 20: return <div className={`anim-stage ${cls}`}><div className="metal"/></div>;
    case 21: return <div className={`anim-stage ${cls}`}><div className="cursor"/></div>;
    case 22: return <div className={`anim-stage ${cls}`}><div className="gear"/><div className="gear"/></div>;
    case 23: return <div className={`anim-stage ${cls}`}><div/></div>;
    case 24: return <div className={`anim-stage ${cls}`}><div className="neuron"/><div className="neuron"/><div className="neuron"/><div className="neuron"/><div className="neuron"/></div>;
    case 25: return <div className={`anim-stage ${cls}`}><div className="bar"/></div>;
    case 26: return <div className={`anim-stage ${cls}`}><div className="dia"/></div>;
    case 27: return <div className={`anim-stage ${cls}`}>{Array.from({length:8},(_,i)=><i key={i} style={{animationDelay:`${i*.1}s`}}/>)} </div>;
    case 28: return <div className={`anim-stage ${cls}`}><div className="tri"/></div>;
    case 29: return <div className={`anim-stage ${cls}`}><div className="ball"/></div>;
    case 30: return <div className={`anim-stage ${cls}`}><div className="rip"/><div className="rip"/><div className="rip"/></div>;
    case 31: return <div className={`anim-stage ${cls}`}><div className="face"/></div>;
    case 32: return <div className={`anim-stage ${cls}`}><div className="cross"/></div>;
    case 33: return <div className={`anim-stage ${cls}`}><div className="dot"/></div>;
    case 34: return <div className={`anim-stage ${cls}`}><div className="ring"/><div className="ring"/><div className="ring"/></div>;
    case 35: return <div className={`anim-stage ${cls}`}><div className="bub"/><div className="bub"/><div className="bub"/></div>;
    case 36: return <div className={`anim-stage ${cls}`}><i/><i/><i/><i/></div>;
    case 37: return <div className={`anim-stage ${cls}`}><div className="moon"/></div>;
    case 38: return <div className={`anim-stage ${cls}`}><div className="nucleus"/><div className="electron"/><div className="electron"/><div className="electron"/></div>;
    case 39: return <div className={`anim-stage ${cls}`}><div className="flame"/></div>;
    case 40: return <div className={`anim-stage ${cls}`}><div className="bolt"/></div>;
    case 41: return <div className={`anim-stage ${cls}`}><div className="crystal"/><div className="crystal"/><div className="crystal"/></div>;
    case 42: return <div className={`anim-stage ${cls}`}><div className="clock"><div className="hand"/></div></div>;
    case 43: return <div className={`anim-stage ${cls}`}>{Array.from({length:16},(_,i)=><i key={i} style={{animationDelay:`${i*.1}s`}}/>)} </div>;
    case 44: return <div className={`anim-stage ${cls}`}><div className="arc"/><div className="arc"/><div className="arc"/></div>;
    case 45: return <div className={`anim-stage ${cls}`}><div className="text">LOADING</div></div>;
    case 46: return <div className={`anim-stage ${cls}`}><div className="plus">+</div></div>;
    case 47: return <div className={`anim-stage ${cls}`}><div className="c"/><div className="c"/><div className="c"/></div>;
    case 48: return <div className={`anim-stage ${cls}`}><div className="sq"/><div className="sq"/></div>;
    case 49: return <div className={`anim-stage ${cls}`}><div className="cab"/></div>;
    case 50: return <div className={`anim-stage ${cls}`}><div className="coin"/></div>;
    case 51: return <div className={`anim-stage ${cls}`}><div className="seg" style={{transform:'rotate(0deg)'}}/><div className="seg" style={{transform:'rotate(36deg)'}}/><div className="seg" style={{transform:'rotate(72deg)'}}/><div className="seg" style={{transform:'rotate(108deg)'}}/><div className="seg" style={{transform:'rotate(144deg)'}}/></div>;
    case 52: return <div className={`anim-stage ${cls}`}>{Array.from({length:8},(_,i)=><i key={i} style={{animationDelay:`${i*.12}s`}}/>)} </div>;
    case 53: return <div className={`anim-stage ${cls}`}><div className="shim"/></div>;
    case 54: return <div className={`anim-stage ${cls}`}>{Array.from({length:8},(_,i)=><i key={i} style={{animationDelay:`${i*.15}s`}}/>)} </div>;
    case 55: return <div className={`anim-stage ${cls}`}><div/></div>;
    case 56: return <div className={`anim-stage ${cls}`}>{Array.from({length:8},(_,i)=><div key={i} className="dot" style={{animationDelay:`${i*.1}s`,animationName:'a056',animationDuration:'1.5s',animationTimingFunction:'ease-out',animationIterationCount:'infinite',animationFillMode:'both',['--dx']:`${Math.cos(i*45*Math.PI/180)*25}px`,['--dy']:`${Math.sin(i*45*Math.PI/180)*25}px`}}/>)} </div>;
    case 57: return <div className={`anim-stage ${cls}`}><div className="wrench"/></div>;
    case 58: return <div className={`anim-stage ${cls}`}><div className="valve"/></div>;
    case 59: return <div className={`anim-stage ${cls}`}><div className="smoke" style={{animationDelay:'0s'}}/><div className="smoke" style={{animationDelay:'.7s',left:'24px'}}/><div className="smoke" style={{animationDelay:'1.4s',left:'36px'}}/></div>;
    case 60: return <div className={`anim-stage ${cls}`}><div className="spiral"/></div>;
    case 61: return <div className={`anim-stage ${cls}`}><div className="digit">0</div></div>;
    case 62: return <div className={`anim-stage ${cls}`}><div className="field"/><div className="field"/><div className="field"/></div>;
    case 63: return <div className={`anim-stage ${cls}`}><div className="cell"/></div>;
    case 64: return <div className={`anim-stage ${cls}`}><i/><i/><i/><i/></div>;
    case 65: return <div className={`anim-stage ${cls}`}><div className="path"/></div>;
    case 66: return <div className={`anim-stage ${cls}`}><i>0</i><i>1</i><i>1</i><i>0</i><i>1</i></div>;
    case 67: return <div className={`anim-stage ${cls}`}><div className="tunnel"/><div className="tunnel"/><div className="tunnel"/></div>;
    case 68: return <div className={`anim-stage ${cls}`}>{Array.from({length:8},(_,i)=><div key={i} className="streak" style={{left:`${8+i*6}px`,animationDelay:`${i*.1}s`}}/>)} </div>;
    case 69: return <div className={`anim-stage ${cls}`}><div className="lock"/></div>;
    case 70: return <div className={`anim-stage ${cls}`}><div className="ball"/></div>;
    case 71: return <div className={`anim-stage ${cls}`}><div className="box"/></div>;
    case 72: return <div className={`anim-stage ${cls}`}><div className="breath"/></div>;
    case 73: return <div className={`anim-stage ${cls}`}>{Array.from({length:16},(_,i)=><i key={i} style={{animationDelay:`${i*.1}s`}}/>)} </div>;
    case 74: return <div className={`anim-stage ${cls}`}><div className="door"/><div className="door"/></div>;
    case 75: return <div className={`anim-stage ${cls}`}><i style={{top:0,left:'27px'}}/><i style={{bottom:0,left:'27px'}}/><i style={{top:'27px',left:0}}/><i style={{top:'27px',right:0}}/></div>;
    case 76: return <div className={`anim-stage ${cls}`}><div className="scan"/></div>;
    case 77: return <div className={`anim-stage ${cls}`}>{Array.from({length:6},(_,i)=><i key={i} style={{animationDelay:`${i*.12}s`}}/>)} </div>;
    case 78: return <div className={`anim-stage ${cls}`}><div className="mr"/></div>;
    case 79: return <div className={`anim-stage ${cls}`}>{Array.from({length:8},(_,i)=><div key={i} className="spark" style={{animationDelay:`${i*.12}s`,left:'27px',top:'27px',animationName:'a056',animationDuration:'1s',animationTimingFunction:'ease-out',animationIterationCount:'infinite',animationFillMode:'both',['--dx']:`${Math.cos(i*45*Math.PI/180)*22}px`,['--dy']:`${Math.sin(i*45*Math.PI/180)*22}px`}}/>)} </div>;
    case 80: return <div className={`anim-stage ${cls}`}><div className="strand" style={{top:'8px',animationDelay:'0s'}}/><div className="strand" style={{top:'20px',animationDelay:'.3s'}}/><div className="strand" style={{top:'32px',animationDelay:'.6s'}}/><div className="strand" style={{top:'44px',animationDelay:'.9s'}}/></div>;
    case 81: return <div className={`anim-stage ${cls}`}><div className="td" style={{animationDelay:'0s'}}/><div className="td" style={{animationDelay:'.16s'}}/><div className="td" style={{animationDelay:'.32s'}}/></div>;
    case 82: return <div className={`anim-stage ${cls}`}><div className="sweep"/></div>;
    case 83: return <div className={`anim-stage ${cls}`}><div className="inter"/><div className="inter"/></div>;
    case 84: return <div className={`anim-stage ${cls}`}><div className="track"/><div className="chase"/></div>;
    case 85: return <div className={`anim-stage ${cls}`}><div className="sq"/></div>;
    case 86: return <div className={`anim-stage ${cls}`}>{Array.from({length:12},(_,i)=><i key={i} style={{animationDelay:`${i*.08}s`}}/>)} </div>;
    case 87: return <div className={`anim-stage ${cls}`}><div className="fan">{[0,90,180,270].map(a=><div key={a} className="blade" style={{transform:`rotate(${a}deg)`}}/>)}</div></div>;
    case 88: return <div className={`anim-stage ${cls}`}><div className="dc"/></div>;
    case 89: return <div className={`anim-stage ${cls}`}><div className="link"/><div className="link"/><div className="link"/></div>;
    case 90: return <div className={`anim-stage ${cls}`}><div className="sr"/></div>;
    case 91: return <div className={`anim-stage ${cls}`}><div className="rs"/></div>;
    case 92: return <div className={`anim-stage ${cls}`}><div className="zig"/></div>;
    case 93: return <div className={`anim-stage ${cls}`}><div className="sun"/><div className="moon2"/></div>;
    case 94: return <div className={`anim-stage ${cls}`}><div className="fp"/><div className="fp" style={{width:'30px',height:'30px',top:'7px',left:'7px',animationDelay:'-.3s'}}/><div className="fp" style={{width:'20px',height:'20px',top:'12px',left:'12px',animationDelay:'-.6s'}}/></div>;
    case 95: return <div className={`anim-stage ${cls}`}><div className="hammer"/></div>;
    case 96: return <div className={`anim-stage ${cls}`}><div className="pc"/><div className="pc"/></div>;
    case 97: return <div className={`anim-stage ${cls}`}><div className="ring"/></div>;
    case 98: return <div className={`anim-stage ${cls}`}><div className="glyph">◇</div></div>;
    case 99: return <div className={`anim-stage ${cls}`}><div className="dash"/></div>;
    case 100: return <div className={`anim-stage ${cls}`}><div className="crys"/></div>;
    case 101: return <div className={`anim-stage ${cls}`}><div className="therm"/><div className="bulb"/></div>;
    case 102: return <div className={`anim-stage ${cls}`}><div className="cube"/></div>;
    case 103: return <div className={`anim-stage ${cls}`}>{Array.from({length:9},(_,i)=><i key={i} style={{animationDelay:`${i*.12}s`}}/>)} </div>;
    case 104: return <div className={`anim-stage ${cls}`}><div className="hg"/></div>;
    case 105: return <div className={`anim-stage ${cls}`}><div className="dot"/><div className="ring2"/></div>;
    case 106: return <div className={`anim-stage ${cls}`}><div className="cs"/><div className="cs"/><div className="cs"/></div>;
    case 107: return <div className={`anim-stage ${cls}`}><div className="pill"/></div>;
    case 108: return <div className={`anim-stage ${cls}`}><div className="sr" style={{width:'16px',height:'16px',animationDelay:'0s'}}/><div className="sr" style={{width:'28px',height:'28px',animationDelay:'.3s'}}/><div className="sr" style={{width:'40px',height:'40px',animationDelay:'.6s'}}/></div>;
    case 109: return <div className={`anim-stage ${cls}`}><div className="ls"/></div>;
    case 110: return <div className={`anim-stage ${cls}`}><i/><i/><i/><i/></div>;
    case 111: return <div className={`anim-stage ${cls}`}><div className="es"/><div className="es"/></div>;
    case 112: return <div className={`anim-stage ${cls}`}><div className="rf"/></div>;
    case 113: return <div className={`anim-stage ${cls}`}>{Array.from({length:8},(_,i)=><i key={i} style={{animationDelay:`${i*.1}s`}}/>)} </div>;
    case 114: return <div className={`anim-stage ${cls}`}><div className="dot"/></div>;
    case 115: return <div className={`anim-stage ${cls}`}><div className="md"/></div>;
    case 116: return <div className={`anim-stage ${cls}`}>{Array.from({length:5},(_,i)=><i key={i} style={{animationDelay:`${i*.12}s`}}/>)} </div>;
    case 117: return <div className={`anim-stage ${cls}`}><div className="arc"/></div>;
    case 118: return <div className={`anim-stage ${cls}`}>{Array.from({length:16},(_,i)=><i key={i} style={{animationDelay:`${i*.1}s`}}/>)} </div>;
    case 119: return <div className={`anim-stage ${cls}`}><div/></div>;
    case 120: return <div className={`anim-stage ${cls}`}>{[0,60,120,180,240,300].map(a=><div key={a} className="petal" style={{transform:`rotate(${a}deg)`}}/>)} </div>;
    case 121: return <div className={`anim-stage ${cls}`}><div className="cog">{[0,45,90,135,180,225,270,315].map(a=><div key={a} className="tooth" style={{transform:`rotate(${a}deg) translateY(-18px)`}}/>)}</div></div>;
    case 122: return <div className={`anim-stage ${cls}`}><div className="glass"><div className="liquid"/></div></div>;
    case 123: return <div className={`anim-stage ${cls}`}><div className="orb"/></div>;
    default: return <div className="anim-stage"><div className="ring"/></div>;
  }
}

/* ─── CSS Generator ─── */
function generateCSS(id, name) {
  const n = String(id).padStart(3, '0');
  return `/* ${name} — Animation #${id} */
.anim-${n} .stage {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Add your animation keyframes below */
@keyframes anim-${n} {
  /* ... */
}`;
}

/* ─── Main App ─── */
export default function App() {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('metal-favs') || '[]'); } catch { return []; }
  });
  const [copiedId, setCopiedId] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('metal-favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleFav = useCallback((id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, []);

  const copyCode = useCallback((id, name) => {
    const css = generateCSS(id, name);
    navigator.clipboard.writeText(css).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = animations;
    if (activeCat !== 'all') {
      result = result.filter(a => a.cat === activeCat);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.tags.some(t => t.includes(q)) ||
        a.cat.includes(q)
      );
    }
    return result;
  }, [activeCat, search]);

  const catCounts = useMemo(() => {
    const counts = { all: animations.length };
    categories.forEach(c => {
      if (c.id !== 'all') counts[c.id] = animations.filter(a => a.cat === c.id).length;
    });
    return counts;
  }, []);

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header metal-texture">
        <div className="header-inner">
          <div className="header-top">
            <div className="logo">
              <div className="logo-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" strokeDasharray="4 2"/>
                  <circle cx="12" cy="12" r="4"/>
                  <line x1="12" y1="2" x2="12" y2="6"/>
                  <line x1="12" y1="18" x2="12" y2="22"/>
                  <line x1="2" y1="12" x2="6" y2="12"/>
                  <line x1="18" y1="12" x2="22" y2="12"/>
                </svg>
              </div>
              <div>
                <h1>METAL LOADERS</h1>
                <p className="subtitle">Industrial Loading Animation Library — {animations.length} Unique Variations</p>
              </div>
            </div>
            <div className="header-actions">
              <div className="search-box">
                <icons.search width={16} height={16} />
                <input 
                  type="text" 
                  placeholder="Search animations..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && <button className="search-clear" onClick={() => setSearch('')}><icons.close width={14} height={14}/></button>}
              </div>
              <div className="view-toggle">
                <button className={viewMode==='grid'?'active':''} onClick={()=>setViewMode('grid')}>
                  <icons.grid width={16} height={16}/>
                </button>
                <button className={viewMode==='list'?'active':''} onClick={()=>setViewMode('list')}>
                  <icons.list width={16} height={16}/>
                </button>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="stats">
            <div className="stat">
              <span className="stat-num">{animations.length}</span>
              <span className="stat-label">Animations</span>
            </div>
            <div className="stat">
              <span className="stat-num">{categories.length - 1}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat">
              <span className="stat-num">{favorites.length}</span>
              <span className="stat-label">Favorites</span>
            </div>
            <div className="stat">
              <span className="stat-num">0</span>
              <span className="stat-label">Dependencies</span>
            </div>
          </div>

          {/* FILTERS */}
          <div className="filters">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-btn ${activeCat===cat.id?'active':''}`}
                onClick={() => setActiveCat(cat.id)}
              >
                {cat.icon && icons[cat.icon] && React.createElement(icons[cat.icon], {width:14,height:14})}
                <span>{cat.label}</span>
                <span className="filter-count">{catCounts[cat.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* GRID */}
      <main className="main" ref={gridRef}>
        <div className="result-info">
          <span>{filtered.length} animation{filtered.length!==1?'s':''} found</span>
        </div>
        <div className={`grid ${viewMode==='list'?'list-view':''}`}>
          {filtered.map(anim => (
            <div key={anim.id} className={`card metal-texture ${viewMode==='list'?'card-list':''}`}>
              <div className="card-header">
                <span className="card-id">#{String(anim.id).padStart(3,'0')}</span>
                <div className="card-actions">
                  <button 
                    className={`card-btn ${favorites.includes(anim.id)?'fav-active':''}`}
                    onClick={() => toggleFav(anim.id)}
                    title="Favorite"
                  >
                    <icons.heart width={14} height={14} fill={favorites.includes(anim.id)?'currentColor':'none'}/>
                  </button>
                  <button className="card-btn" onClick={() => copyCode(anim.id, anim.name)} title="Copy CSS">
                    {copiedId === anim.id ? <icons.check width={14} height={14}/> : <icons.copy width={14} height={14}/>}
                  </button>
                </div>
              </div>
              <div className="card-stage">
                <AnimStage id={anim.id}/>
              </div>
              <div className="card-footer">
                <span className="card-name">{anim.name}</span>
                <span className="card-cat">{anim.cat}</span>
              </div>
              {copiedId === anim.id && <div className="copied-toast">CSS Copied!</div>}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <icons.search width={48} height={48}/>
            <p>No animations found</p>
            <span>Try a different search or category</span>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer metal-texture">
        <div className="footer-inner">
          <div className="footer-rivet"/>
          <p>METAL LOADERS v2.0 — Pure CSS Animations — No Dependencies</p>
          <div className="footer-rivet"/>
        </div>
      </footer>

      {/* SCROLL TOP */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
          <icons.arrowUp width={20} height={20}/>
        </button>
      )}
    </div>
  );
}
