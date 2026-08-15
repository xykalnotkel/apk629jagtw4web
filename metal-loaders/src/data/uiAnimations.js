import React from 'react';

export const uiCats = [
  { id: 'all', label: 'All' },
  { id: 'card', label: 'Card' },
  { id: 'swipe', label: 'Swipe' },
  { id: 'text', label: 'Text' },
  { id: 'hover', label: 'Hover' },
  { id: 'scroll', label: 'Scroll' },
  { id: 'transition', label: 'Transition' },
];

const D = (cls, children) => React.createElement('div', { className: cls }, children);

export const uiAnimations = [
  // CARD (1-10)
  { id:1, name:'Card Flip', cat:'card', tags:['flip','3d'], demo: D('demo-card flip-demo', D('flip-inner', [D('flip-front','Front'), D('flip-back','Back')])) },
  { id:2, name:'Card Lift', cat:'card', tags:['elevate','shadow'], demo: D('demo-card lift-demo', D('card-lift', 'Hover Me')) },
  { id:3, name:'Card Tilt', cat:'card', tags:['tilt','3d'], demo: D('demo-card tilt-demo', D('card-tilt', 'Tilt')) },
  { id:4, name:'Card Shine', cat:'card', tags:['glare','gloss'], demo: D('demo-card shine-demo', D('card-shine', 'Shine')) },
  { id:5, name:'Card Fold', cat:'card', tags:['fold','paper'], demo: D('demo-card fold-demo', D('card-fold', 'Fold')) },
  { id:6, name:'Card Expand', cat:'card', tags:['grow','scale'], demo: D('demo-card expand-demo', D('card-expand', 'Expand')) },
  { id:7, name:'Card Slide Up', cat:'card', tags:['reveal','content'], demo: D('demo-card slideup-demo', [D('slideup-bg'), D('slideup-overlay', 'Revealed')]) },
  { id:8, name:'Card Border Draw', cat:'card', tags:['border','draw'], demo: D('demo-card borderdraw-demo', D('card-bd', 'Border')) },
  { id:9, name:'Card Blur Reveal', cat:'card', tags:['blur','focus'], demo: D('demo-card blur-demo', D('card-blur', 'Blur')) },
  { id:10, name:'Card Corner Fold', cat:'card', tags:['corner','paper'], demo: D('demo-card cornerfold-demo', D('card-cf', 'Corner')) },
  // SWIPE (11-20)
  { id:11, name:'Swipe Reveal', cat:'swipe', tags:['drag','reveal'], demo: D('swipe-demo', D('swipe-track', D('swipe-thumb'))) },
  { id:12, name:'Page Curl', cat:'swipe', tags:['page','turn'], demo: D('curl-demo', D('curl-page')) },
  { id:13, name:'Parallax Slide', cat:'swipe', tags:['layer','depth'], demo: D('parallax-demo', [D('plx-bg'), D('plx-fg')]) },
  { id:14, name:'Carousel Spin', cat:'swipe', tags:['rotate','items'], demo: D('carousel-demo', D('carousel-track', [D('ci','A'),D('ci','B'),D('ci','C')])) },
  { id:15, name:'Stack Swipe', cat:'swipe', tags:['stack','tinder'], demo: D('stack-demo', [D('stack-card'),D('stack-card'),D('stack-card')]) },
  { id:16, name:'Cover Flow', cat:'swipe', tags:['3d','album'], demo: D('cover-demo', [D('cover-item'),D('cover-item active'),D('cover-item')]) },
  { id:17, name:'Pull to Refresh', cat:'swipe', tags:['pull','down'], demo: D('pull-demo', D('pull-arrow')) },
  { id:18, name:'Slide Toggle', cat:'swipe', tags:['toggle','switch'], demo: D('toggle-demo', D('toggle-track', D('toggle-knob'))) },
  { id:19, name:'Morph Slide', cat:'swipe', tags:['shape','transition'], demo: D('morph-slide-demo', D('morph-shape')) },
  { id:20, name:'Snap Scroll', cat:'swipe', tags:['snap','scroll'], demo: D('snap-demo', [D('snap-item'),D('snap-item'),D('snap-item')]) },
  // TEXT (21-35)
  { id:21, name:'Typewriter', cat:'text', tags:['type','cursor'], demo: D('tw-demo', D('tw-text','Hello World')) },
  { id:22, name:'Text Glitch', cat:'text', tags:['error','distort'], demo: D('glitch-demo', D('glitch-text','GLITCH')) },
  { id:23, name:'Text Wave', cat:'text', tags:['wave','letter'], demo: D('textwave-demo', 'WAVE TEXT'.split('').map((c,i) => D('tw-letter', { key:i, style:{animationDelay:`${i*0.08}s`} }, c))) },
  { id:24, name:'Text Scramble', cat:'text', tags:['decode','matrix'], demo: D('scramble-demo', D('scramble-text','DECODE')) },
  { id:25, name:'Neon Flicker', cat:'text', tags:['neon','sign'], demo: D('neon-demo', D('neon-text','NEON')) },
  { id:26, name:'Text Blur In', cat:'text', tags:['blur','fade'], demo: D('blurin-demo', D('blurin-text','BLUR IN')) },
  { id:27, name:'Text Gradient Flow', cat:'text', tags:['gradient','flow'], demo: D('gradflow-demo', D('gradflow-text','GRADIENT')) },
  { id:28, name:'Text Bounce', cat:'text', tags:['bounce','letter'], demo: D('textbounce-demo', 'BOUNCE'.split('').map((c,i) => D('tb-letter', { key:i, style:{animationDelay:`${i*0.1}s`} }, c))) },
  { id:29, name:'Text Rotate Y', cat:'text', tags:['rotate','flip'], demo: D('textrotate-demo', D('textrotate-inner','ROTATE')) },
  { id:30, name:'Text Stroke', cat:'text', tags:['outline','stroke'], demo: D('stroke-demo', D('stroke-text','STROKE')) },
  { id:31, name:'Text Slide In', cat:'text', tags:['slide','enter'], demo: D('slidein-demo', D('slidein-text','SLIDE')) },
  { id:32, name:'Text Clip Reveal', cat:'text', tags:['clip','mask'], demo: D('clip-demo', D('clip-text','REVEAL')) },
  { id:33, name:'Text Elastic', cat:'text', tags:['elastic','stretch'], demo: D('elastic-demo', D('elastic-text','ELASTIC')) },
  { id:34, name:'Text Split', cat:'text', tags:['split','divide'], demo: D('split-demo', [D('split-top','SPLIT'),D('split-bot','SPLIT')]) },
  { id:35, name:'Text Shadow Pop', cat:'text', tags:['shadow','pop'], demo: D('shpop-demo', D('shpop-text','POP')) },
  // HOVER (36-45)
  { id:36, name:'Button Ripple', cat:'hover', tags:['click','ripple'], demo: D('ripple-demo', D('ripple-btn','Click')) },
  { id:37, name:'Magnetic Hover', cat:'hover', tags:['attract','cursor'], demo: D('magnetic-demo', D('magnetic-dot')) },
  { id:38, name:'Icon Bounce', cat:'hover', tags:['icon','jump'], demo: D('iconbounce-demo', D('icon-bounce','*')) },
  { id:39, name:'Link Underline', cat:'hover', tags:['link','draw'], demo: D('underline-demo', D('ul-link','Hover Link')) },
  { id:40, name:'Button Fill', cat:'hover', tags:['button','fill'], demo: D('fill-demo', D('fill-btn','Fill')) },
  { id:41, name:'Glow Button', cat:'hover', tags:['glow','neon'], demo: D('glowbtn-demo', D('glow-btn','Glow')) },
  { id:42, name:'Badge Pulse', cat:'hover', tags:['badge','notification'], demo: D('badge-demo', D('badge-dot')) },
  { id:43, name:'Avatar Ring', cat:'hover', tags:['avatar','ring'], demo: D('avatar-demo', D('avatar-ring')) },
  { id:44, name:'Menu Reveal', cat:'hover', tags:['menu','dropdown'], demo: D('menu-demo', [D('menu-trigger','Menu'), D('menu-drop', [D('menu-item','Item 1'),D('menu-item','Item 2')])]) },
  { id:45, name:'Tooltip Pop', cat:'hover', tags:['tooltip','info'], demo: D('tooltip-demo', [D('tooltip-target','?'), D('tooltip-bubble','Info')]) },
  // SCROLL (46-50)
  { id:46, name:'Fade In Up', cat:'scroll', tags:['reveal','enter'], demo: D('fiu-demo', D('fiu-box')) },
  { id:47, name:'Parallax Layer', cat:'scroll', tags:['depth','move'], demo: D('plx2-demo', [D('plx2-back'),D('plx2-front')]) },
  { id:48, name:'Progress Scroll', cat:'scroll', tags:['progress','bar'], demo: D('scrollprog-demo', D('scrollprog-bar')) },
  { id:49, name:'Pin Element', cat:'scroll', tags:['sticky','pin'], demo: D('pin-demo', D('pin-el')) },
  { id:50, name:'Count Up', cat:'scroll', tags:['number','animate'], demo: D('countup-demo', D('countup-num','123')) },
];
