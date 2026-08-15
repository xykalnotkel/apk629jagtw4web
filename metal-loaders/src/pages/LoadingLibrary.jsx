import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { animations, categories } from '../data/animations';
import * as Icons from '../components/Icons';

/* Animation stages for original 123 + 100 new */
function AnimStage({ id }) {
  const cls = `anim-${String(id).padStart(3,'0')}`;
  // Original animations 1-123 (simplified - using CSS classes)
  const baseAnims = {
    1:<div className="ring"/>,2:<><div className="r1"/><div className="r2"/></>,3:<><i/><i/><i/></>,
    4:<div className="blob"/>,5:<div className="ring"/>,6:<>
      {Array.from({length:8},(_,i)=><i key={i} style={{animationDelay:`${i*.1}s`}}/>)}</>,
    7:<div className="card3d"/>,8:<div className="radar"/>,9:<div className="heart"/>,
    10:<div className="inf"/>,11:<>
      {Array.from({length:8},(_,i)=><i key={i} style={{animationDelay:`${i*.12}s`}}/>)}</>,
    12:<><div className="piston"/><div className="base"/></>,13:<div className="gbox"/>,
    14:<div className="belt"/>,15:<><div className="ctr"/><div className="orbit"/><div className="orbit"/></>,
    16:<div className="arm"/>,17:<div className="crt"/>,18:<><div className="spring"/><div className="ball"/></>,
    19:<div className="drop"/>,20:<div className="metal"/>,21:<div className="cursor"/>,
    22:<><div className="gear"/><div className="gear"/></>,23:<div className="hexm"/>,
    24:<>
      {Array.from({length:5},(_,i)=><div key={i} className="neuron"/>)}
    </>,25:<div className="bar"/>,26:<div className="dia"/>,27:<>
      {Array.from({length:8},(_,i)=><i key={i} style={{animationDelay:`${i*.1}s`}}/>)}</>,
    28:<div className="tri2"/>,29:<div className="ball"/>,30:<>
      {Array.from({length:3},(_,i)=><div key={i} className="rip"/>)}
    </>,31:<div className="face"/>,32:<div className="cross"/>,33:<div className="dot33"/>,
    34:<>
      {Array.from({length:3},(_,i)=><div key={i} className="ring34"/>)}
    </>,35:<>
      {Array.from({length:3},(_,i)=><div key={i} className="bub"/>)}</>,
    36:<><i/><i/><i/><i/></>,37:<div className="moon"/>,38:<><div className="nuc"/><div className="elec"/><div className="elec"/><div className="elec"/></>,
    39:<div className="flame"/>,40:<div className="bolt"/>,41:<>
      {Array.from({length:3},(_,i)=><div key={i} className="crystal"/>)}
    </>,42:<div className="clck"><div className="hand"/></div>,
    43:<>
      {Array.from({length:16},(_,i)=><i key={i} style={{animationDelay:`${i*.1}s`}}/>)}</>,
    44:<>
      {Array.from({length:3},(_,i)=><div key={i} className="arc"/>)}</>,
    45:<div className="txt">LOADING</div>,46:<div className="plus">+</div>,
    47:<>
      {Array.from({length:3},(_,i)=><div key={i} className="c47"/>)}
    </>,48:<>
      {Array.from({length:2},(_,i)=><div key={i} className="sq48"/>)}
    </>,49:<div className="cab"/>,50:<div className="coin"/>,
  };

  // Generate stages dynamically for new animations 124-223
  const newAnims = {};
  for (let i = 124; i <= 223; i++) {
    newAnims[i] = <div className={`new-anim-${i}`}/>;
  }

  return (
    <div className={`anim-stage ${cls}`}>
      {baseAnims[id] || newAnims[id] || <div className="ring"/>}
    </div>
  );
}

export default function LoadingLibrary() {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vault-favs') || '[]'); } catch { return []; }
  });
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { localStorage.setItem('vault-favs', JSON.stringify(favs)); }, [favs]);

  const toggleFav = useCallback((id) => {
    setFavs(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id]);
  }, []);

  const copyCode = useCallback((id, name) => {
    navigator.clipboard.writeText(`/* ${name} #${id} - Pure CSS */\n.${String(id).padStart(3,'0')} { /* animation code */ }`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const filtered = useMemo(() => {
    let r = animations;
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
          <h1 className="lib-title">
            <Icons.Zap size={24}/> Loading Library
          </h1>
          <span className="lib-count mono">{filtered.length} animations</span>
        </div>
        <div className="lib-controls">
          <div className="search-wrap">
            <Icons.Search size={16}/>
            <input placeholder="Search loaders..." value={search} onChange={e => setSearch(e.target.value)}/>
            {search && <button className="clr" onClick={() => setSearch('')}><Icons.X size={14}/></button>}
          </div>
        </div>
        <div className="cat-filters">
          {categories.map(c => (
            <button key={c.id} className={`cat-btn ${activeCat===c.id?'active':''}`} onClick={() => setActiveCat(c.id)}>
              {c.label} <span className="cat-num">{c.id==='all'?animations.length:animations.filter(a=>a.cat===c.id).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="lib-grid">
        {filtered.map(anim => (
          <div key={anim.id} className="lcard metal-texture">
            <div className="lcard-top">
              <span className="lcard-num">#{String(anim.id).padStart(3,'0')}</span>
              <div className="lcard-acts">
                <button className={`lcard-btn ${favs.includes(anim.id)?'fav':''}`} onClick={() => toggleFav(anim.id)}>
                  <Icons.Heart size={13} fill={favs.includes(anim.id)?'var(--purple)':'none'}/>
                </button>
                <button className="lcard-btn" onClick={() => copyCode(anim.id, anim.name)}>
                  {copiedId===anim.id ? <Icons.Check size={13}/> : <Icons.Copy size={13}/>}
                </button>
              </div>
            </div>
            <div className="lcard-stage">
              <AnimStage id={anim.id}/>
            </div>
            <div className="lcard-foot">
              <span className="lcard-name">{anim.name}</span>
              <span className="lcard-cat">{anim.cat}</span>
            </div>
            {copiedId===anim.id && <div className="toast">Copied</div>}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          <Icons.Search size={48}/>
          <p>No animations found</p>
        </div>
      )}
    </div>
  );
}
