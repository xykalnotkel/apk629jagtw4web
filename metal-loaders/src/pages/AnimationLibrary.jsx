import { useState, useMemo } from 'react';
import { uiAnimations, uiCats } from '../data/uiAnimations';
import * as Icons from '../components/Icons';

export default function AnimationLibrary() {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let r = uiAnimations;
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
          <h1 className="lib-title"><Icons.Play size={24}/> UI Animations</h1>
          <span className="lib-count mono">{filtered.length} effects</span>
        </div>
        <div className="lib-controls">
          <div className="search-wrap">
            <Icons.Search size={16}/>
            <input placeholder="Search animations..." value={search} onChange={e => setSearch(e.target.value)}/>
            {search && <button className="clr" onClick={() => setSearch('')}><Icons.X size={14}/></button>}
          </div>
        </div>
        <div className="cat-filters">
          {uiCats.map(c => (
            <button key={c.id} className={`cat-btn ${activeCat===c.id?'active':''}`} onClick={() => setActiveCat(c.id)}>
              {c.label} <span className="cat-num">{c.id==='all'?uiAnimations.length:uiAnimations.filter(a=>a.cat===c.id).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ui-grid">
        {filtered.map(anim => (
          <div key={anim.id} className="uicard metal-texture">
            <div className="uicard-stage">
              <div className={`ui-demo ui-${String(anim.id).padStart(2,'0')}`}>
                {anim.demo}
              </div>
            </div>
            <div className="uicard-info">
              <span className="uicard-name">{anim.name}</span>
              <span className="uicard-cat">{anim.cat}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
