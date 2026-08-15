/* ═══════════════════════════════════════════
   METAL ICONS — Custom SVG Icon Library
   Industrial/Mechanical themed icons
   ═══════════════════════════════════════════ */

import React from 'react';

const baseProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconGear = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

export const IconSearch = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="11" cy="11" r="7"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
);

export const IconCopy = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);

export const IconCheck = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

export const IconFilter = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
  </svg>
);

export const IconHeart = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

export const IconCode = (props) => (
  <svg {...baseProps} {...props}>
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

export const IconGrid = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
  </svg>
);

export const IconList = (props) => (
  <svg {...baseProps} {...props}>
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

export const IconZap = (props) => (
  <svg {...baseProps} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

export const IconBox = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

export const IconCircle = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

export const IconTriangle = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 2L2 22h20L12 2z"/>
  </svg>
);

export const IconHexagon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
  </svg>
);

export const IconDots = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="19" cy="12" r="1.5"/>
    <circle cx="5" cy="12" r="1.5"/>
  </svg>
);

export const IconWave = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M2 12c1.5-3 3-4.5 4.5-4.5S9 9 10.5 12s3 4.5 4.5 4.5S17.5 15 19 12s3-4.5 4.5-4.5"/>
  </svg>
);

export const IconLayers = (props) => (
  <svg {...baseProps} {...props}>
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);

export const IconPulse = (props) => (
  <svg {...baseProps} {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

export const IconCpu = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/>
    <line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/>
    <line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/>
    <line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1" y1="9" x2="4" y2="9"/>
    <line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
);

export const IconAtom = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="1"/>
    <path d="M20.2 20.2c2.04-2.04.9-6.28-2.54-10.22C14.48 6.04 10.24 4.9 8.2 6.94"/>
    <path d="M3.8 3.8c-2.04 2.04-.9 6.28 2.54 10.22C9.52 17.96 13.76 19.1 15.8 17.06"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)"/>
  </svg>
);

export const IconFlame = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>
  </svg>
);

export const IconClose = (props) => (
  <svg {...baseProps} {...props}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export const IconArrowUp = (props) => (
  <svg {...baseProps} {...props}>
    <line x1="12" y1="19" x2="12" y2="5"/>
    <polyline points="5 12 12 5 19 12"/>
  </svg>
);

export const IconEye = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export const IconDownload = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export const IconStar = (props) => (
  <svg {...baseProps} {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export const IconWrench = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);

export const IconSparkles = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
    <path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z"/>
    <path d="M19 14l.5 1.5L21 16l-1.5.5L19 18l-.5-1.5L17 16l1.5-.5L19 14z"/>
  </svg>
);

export const IconDatabase = (props) => (
  <svg {...baseProps} {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);

// Icon map for easy lookup
export const icons = {
  gear: IconGear,
  search: IconSearch,
  copy: IconCopy,
  check: IconCheck,
  filter: IconFilter,
  heart: IconHeart,
  code: IconCode,
  grid: IconGrid,
  list: IconList,
  zap: IconZap,
  box: IconBox,
  circle: IconCircle,
  triangle: IconTriangle,
  hexagon: IconHexagon,
  dots: IconDots,
  wave: IconWave,
  layers: IconLayers,
  pulse: IconPulse,
  cpu: IconCpu,
  atom: IconAtom,
  flame: IconFlame,
  close: IconClose,
  arrowUp: IconArrowUp,
  eye: IconEye,
  download: IconDownload,
  star: IconStar,
  wrench: IconWrench,
  sparkles: IconSparkles,
  database: IconDatabase,
};

export default icons;
