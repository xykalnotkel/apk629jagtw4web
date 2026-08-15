import React from 'react';
const mkIcon = (path) => ({ size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {Array.isArray(path) ? path.map((d,i) => <path key={i} d={d}/>) : <path d={path}/>}
  </svg>
);

export const Search = mkIcon(['M11 19a8 8 0 100-16 8 8 0 000 16z','M21 21l-4.35-4.35']);
export const Heart = mkIcon('M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z');
export const Copy = mkIcon(['M19 19H9a2 2 0 01-2-2V7','M5 5h10a2 2 0 012 2v10']);
export const Check = mkIcon('M20 6L9 17l-5-5');
export const X = mkIcon(['M18 6L6 18','M6 6l12 12']);
export const Zap = mkIcon('M13 2L3 14h9l-1 8 10-12h-9l1-8z');
export const Layers = mkIcon(['M12 2L2 7l10 5 10-5-10-5z','M2 17l10 5 10-5','M2 12l10 5 10-5']);
export const Play = mkIcon('M5 3l14 9-14 9V3z');
export const Sparkle = mkIcon(['M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z','M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z']);
export const ArrowRight = mkIcon(['M5 12h14','M12 5l7 7-7 7']);
export const Grid = mkIcon(['M3 3h7v7H3z','M14 3h7v7h-7z','M14 14h7v7h-7z','M3 14h7v7H3z']);
