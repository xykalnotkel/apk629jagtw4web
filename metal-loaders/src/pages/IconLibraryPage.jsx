import { useState, useMemo } from 'react';
import { iconList, iconCategories } from '../data/icons';
import * as Icons from '../components/Icons';

function IconPreview({ path, name, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(path) ? path.map((d, i) => <path key={i} d={d}/>) : <path d={path}/>}
    </svg>
  );
}

export default function IconLibraryPage() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [iconSize, setIconSize] = useState(28);

  const filtered = useMemo(() => {
    let r = iconList;
    if (activeCat !== 'all') r = r.filter(i => i.cat === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(i => i.name.toLowerCase().includes(q) || i.tags.some(t => t.includes(q)));
    }
    return r;
  }, [activeCat, search]);

  const copySVG = (icon) => {
    const paths = Array.isArray(icon.path) ? icon.path.map(d => `  <path d="${d}"/>`).join('\n') : `  <path d="${icon.path}"/>`;
    const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\n${paths}\n</svg>`;
    navigator.clipboard.writeText(svg);
    setCopiedId(icon.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="library-page">
      <div className="lib-header">
        <div className="lib-title-row">
          <h1 className="lib-title"><Icons.Layers size={24}/> Icon Library</h1>
          <span className="lib-count mono">{filtered.length} icons</span>
        </div>
        <div className="lib-controls">
          <div className="search-wrap">
            <Icons.Search size={16}/>
            <input placeholder="Search icons..." value={search} onChange={e => setSearch(e.target.value)}/>
            {search && <button className="clr" onClick={() => setSearch('')}><Icons.X size={14}/></button>}
          </div>
          <div className="size-ctrl">
            <button onClick={() => setIconSize(s => Math.max(16, s-4))}>-</button>
            <span className="mono">{iconSize}px</span>
            <button onClick={() => setIconSize(s => Math.min(48, s+4))}>+</button>
          </div>
        </div>
        <div className="cat-filters">
          {iconCategories.map(c => (
            <button key={c.id} className={`cat-btn ${activeCat===c.id?'active':''}`} onClick={() => setActiveCat(c.id)}>
              {c.label} <span className="cat-num">{c.id==='all'?iconList.length:iconList.filter(i=>i.cat===c.id).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="icon-grid">
        {filtered.map(icon => (
          <div key={icon.id} className="icard metal-texture">
            <div className="icard-preview" style={{fontSize:iconSize}}>
              <IconPreview path={icon.path} name={icon.name} size={iconSize}/>
            </div>
            <div className="icard-info">
              <span className="icard-name">{icon.name}</span>
              <span className="icard-cat">{icon.cat}</span>
            </div>
            <button className="icard-copy" onClick={() => copySVG(icon)}>
              {copiedId===icon.id ? <Icons.Check size={12}/> : <Icons.Copy size={12}/>}
            </button>
            {copiedId===icon.id && <div className="toast">SVG Copied</div>}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          <Icons.Search size={48}/>
          <p>No icons found</p>
        </div>
      )}
    </div>
  );
}
