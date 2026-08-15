import { useState, useMemo } from 'react';
import { styleEffects, styleCats } from '../data/styleEffects';
import * as Icons from '../components/Icons';

export default function StylingPage() {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let r = styleEffects;
    if (activeCat !== 'all') r = r.filter(a => a.cat === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(a => a.name.toLowerCase().includes(q) || a.tags.some(t => t.includes(q)));
    }
    return r;
  }, [activeCat, search]);

  return (
    <div className="library-page">
      <div className="lib-header">
        <div className="lib-title-row">
          <h1 className="lib-title"><Icons.Sparkle size={24}/> Styling Effects</h1>
          <span className="lib-count mono">{filtered.length} effects</span>
        </div>
        <div className="lib-controls">
          <div className="search-wrap">
            <Icons.Search size={16}/>
            <input placeholder="Search effects..." value={search} onChange={e => setSearch(e.target.value)}/>
            {search && <button className="clr" onClick={() => setSearch('')}><Icons.X size={14}/></button>}
          </div>
        </div>
        <div className="cat-filters">
          {styleCats.map(c => (
            <button key={c.id} className={`cat-btn ${activeCat===c.id?'active':''}`} onClick={() => setActiveCat(c.id)}>
              {c.label} <span className="cat-num">{c.id==='all'?styleEffects.length:styleEffects.filter(a=>a.cat===c.id).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="st-grid">
        {filtered.map(fx => (
          <div key={fx.id} className={`stcard metal-texture st-${String(fx.id).padStart(2,'0')}`}>
            <div className="stcard-demo">
              <div className={`st-demo sfx-${String(fx.id).padStart(2,'0')}`}>{fx.demo}</div>
            </div>
            <div className="stcard-info">
              <span className="stcard-name">{fx.name}</span>
              <span className="stcard-cat">{fx.cat}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
