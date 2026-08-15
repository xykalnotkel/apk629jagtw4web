import React from 'react';
const D = (cls, children, style) => React.createElement('div', { className: cls, style }, children);

export const styleCats = [
  { id: 'all', label: 'All' },
  { id: 'glass', label: 'Glass' },
  { id: 'border', label: 'Border' },
  { id: 'shadow', label: 'Shadow' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'texture', label: 'Texture' },
  { id: 'button', label: 'Button' },
  { id: 'input', label: 'Input' },
  { id: 'card', label: 'Card' },
];

export const styleEffects = [
  // GLASS (1-7)
  { id:1, name:'Glassmorphism', cat:'glass', tags:['frosted','blur'], demo: D('sfx-box glass-1', 'Glass') },
  { id:2, name:'Frosted Dark', cat:'glass', tags:['dark','frosted'], demo: D('sfx-box glass-2', 'Dark') },
  { id:3, name:'Frosted Light', cat:'glass', tags:['light','clean'], demo: D('sfx-box glass-3', 'Light') },
  { id:4, name:'Glass Card', cat:'glass', tags:['card','panel'], demo: D('sfx-box glass-4', D('gc-inner','Panel')) },
  { id:5, name:'Glass Morph', cat:'glass', tags:['morph','animate'], demo: D('sfx-box glass-5', 'Morph') },
  { id:6, name:'Glass Layered', cat:'glass', tags:['stack','depth'], demo: D('glass-6', [D('gl-back'),D('gl-front','Layered')]) },
  { id:7, name:'Glass Tint', cat:'glass', tags:['color','tint'], demo: D('sfx-box glass-7', 'Tint') },
  // BORDER (8-15)
  { id:8, name:'Gradient Border', cat:'border', tags:['color','rainbow'], demo: D('sfx-box border-8', 'Gradient') },
  { id:9, name:'Animated Border', cat:'border', tags:['rotate','spin'], demo: D('sfx-box border-9', 'Animated') },
  { id:10, name:'Dashed Border', cat:'border', tags:['dash','moving'], demo: D('sfx-box border-10', 'Dashed') },
  { id:11, name:'Double Border', cat:'border', tags:['double','inset'], demo: D('sfx-box border-11', 'Double') },
  { id:12, name:'Corner Border', cat:'border', tags:['corner','bracket'], demo: D('sfx-box border-12', 'Corner') },
  { id:13, name:'Neon Border', cat:'border', tags:['glow','neon'], demo: D('sfx-box border-13', 'Neon') },
  { id:14, name:'Border Draw', cat:'border', tags:['draw','svg'], demo: D('sfx-box border-14', 'Draw') },
  { id:15, name:'Dotted Border', cat:'border', tags:['dot','moving'], demo: D('sfx-box border-15', 'Dotted') },
  // SHADOW (16-22)
  { id:16, name:'Neumorphism', cat:'shadow', tags:['soft','raised'], demo: D('sfx-box shadow-16', 'Neumorph') },
  { id:17, name:'Deep Shadow', cat:'shadow', tags:['deep','heavy'], demo: D('sfx-box shadow-17', 'Deep') },
  { id:18, name:'Color Shadow', cat:'shadow', tags:['color','glow'], demo: D('sfx-box shadow-18', 'Color') },
  { id:19, name:'Layered Shadow', cat:'shadow', tags:['stack','layer'], demo: D('sfx-box shadow-19', 'Layered') },
  { id:20, name:'Inset Shadow', cat:'shadow', tags:['inner','pressed'], demo: D('sfx-box shadow-20', 'Inset') },
  { id:21, name:'Glow Shadow', cat:'shadow', tags:['glow','light'], demo: D('sfx-box shadow-21', 'Glow') },
  { id:22, name:'Float Shadow', cat:'shadow', tags:['float','elevate'], demo: D('sfx-box shadow-22', 'Float') },
  // GRADIENT (23-30)
  { id:23, name:'Linear Gradient', cat:'gradient', tags:['linear','basic'], demo: D('sfx-box grad-23', 'Linear') },
  { id:24, name:'Radial Gradient', cat:'gradient', tags:['radial','spot'], demo: D('sfx-box grad-24', 'Radial') },
  { id:25, name:'Conic Gradient', cat:'gradient', tags:['conic','wheel'], demo: D('sfx-box grad-25', 'Conic') },
  { id:26, name:'Mesh Gradient', cat:'gradient', tags:['mesh','organic'], demo: D('sfx-box grad-26', 'Mesh') },
  { id:27, name:'Animated Gradient', cat:'gradient', tags:['animate','flow'], demo: D('sfx-box grad-27', 'Flow') },
  { id:28, name:'Gradient Text', cat:'gradient', tags:['text','color'], demo: D('sfx-box grad-28', D('grad-text','Text')) },
  { id:29, name:'Gradient Border', cat:'gradient', tags:['border','glow'], demo: D('sfx-box grad-29', 'Border') },
  { id:30, name:'Aurora Gradient', cat:'gradient', tags:['aurora','north'], demo: D('sfx-box grad-30', 'Aurora') },
  // TEXTURE (31-38)
  { id:31, name:'Noise Texture', cat:'texture', tags:['noise','grain'], demo: D('sfx-box tex-31', 'Noise') },
  { id:32, name:'Brushed Metal', cat:'texture', tags:['metal','steel'], demo: D('sfx-box tex-32', 'Metal') },
  { id:33, name:'Carbon Fiber', cat:'texture', tags:['carbon','pattern'], demo: D('sfx-box tex-33', 'Carbon') },
  { id:34, name:'Wood Grain', cat:'texture', tags:['wood','natural'], demo: D('sfx-box tex-34', 'Wood') },
  { id:35, name:'Dot Pattern', cat:'texture', tags:['dots','grid'], demo: D('sfx-box tex-35', 'Dots') },
  { id:36, name:'Grid Lines', cat:'texture', tags:['grid','blueprint'], demo: D('sfx-box tex-36', 'Grid') },
  { id:37, name:'Diagonal Lines', cat:'texture', tags:['lines','stripe'], demo: D('sfx-box tex-37', 'Stripes') },
  { id:38, name:'Hatch Pattern', cat:'texture', tags:['hatch','cross'], demo: D('sfx-box tex-38', 'Hatch') },
  // BUTTON (39-44)
  { id:39, name:'3D Button', cat:'button', tags:['push','depth'], demo: D('sfx-box btn-39', D('btn3d','Push')) },
  { id:40, name:'Outline Button', cat:'button', tags:['outline','minimal'], demo: D('sfx-box btn-40', D('btn-outline','Outline')) },
  { id:41, name:'Pill Button', cat:'button', tags:['pill','rounded'], demo: D('sfx-box btn-41', D('btn-pill','Pill')) },
  { id:42, name:'Icon Button', cat:'button', tags:['icon','round'], demo: D('sfx-box btn-42', D('btn-icon','+')) },
  { id:43, name:'Gradient Button', cat:'button', tags:['gradient','color'], demo: D('sfx-box btn-43', D('btn-grad','Gradient')) },
  { id:44, name:'Glass Button', cat:'button', tags:['glass','transparent'], demo: D('sfx-box btn-44', D('btn-glass','Glass')) },
  // INPUT (45-48)
  { id:45, name:'Floating Label', cat:'input', tags:['label','material'], demo: D('sfx-box input-45', D('float-wrap', [D('float-input'), D('float-label','Label')])) },
  { id:46, name:'Underline Input', cat:'input', tags:['underline','minimal'], demo: D('sfx-box input-46', D('ul-input')) },
  { id:47, name:'Glow Input', cat:'input', tags:['glow','focus'], demo: D('sfx-box input-47', D('glow-input')) },
  { id:48, name:'Search Input', cat:'input', tags:['search','icon'], demo: D('sfx-box input-48', D('search-input', D('si-icon','Q'))) },
  // CARD STYLES (49-55)
  { id:49, name:'Metal Card', cat:'card', tags:['metal','industrial'], demo: D('sfx-box scard-49', 'Metal') },
  { id:50, name:'Holographic Card', cat:'card', tags:['holo','rainbow'], demo: D('sfx-box scard-50', 'Holo') },
  { id:51, name:'Paper Card', cat:'card', tags:['paper','flat'], demo: D('sfx-box scard-51', 'Paper') },
  { id:52, name:'Ticket Card', cat:'card', tags:['ticket','coupon'], demo: D('sfx-box scard-52', 'Ticket') },
  { id:53, name:'Profile Card', cat:'card', tags:['avatar','user'], demo: D('sfx-box scard-53', [D('pc-avatar'),D('pc-info','Name')]) },
  { id:54, name:'Pricing Card', cat:'card', tags:['price','plan'], demo: D('sfx-box scard-54', [D('price-tag','$9'),D('price-label','Plan')]) },
  { id:55, name:'Notification Card', cat:'card', tags:['alert','toast'], demo: D('sfx-box scard-55', [D('notif-dot'),D('notif-text','Alert')]) },
];
