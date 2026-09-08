'use client';

/**
 * Every world owns a palette. Scrolling into a world repaints the document,
 * and the COLORS section lets the visitor repaint it by hand.
 * All of it flows through the same CSS custom properties, so background,
 * type, shapes and shadows always move together.
 */

export interface Palette {
  id: string;
  name: string;
  bg: string;
  fg: string;
  a: string;
  b: string;
  c: string;
  d: string;
  surface: string;
}

export const PALETTES: Palette[] = [
  { id: 'cream',   name: 'Vainilla Pop',  bg: '#FFF4E4', fg: '#100C14', a: '#FF4433', b: '#2B2BFF', c: '#FFCE00', d: '#58E3B4', surface: '#FFFFFF' },
  { id: 'lemon',   name: 'Limón Alto',   bg: '#FFCE00', fg: '#241A00', a: '#FF4433', b: '#7B3FE4', c: '#FFF4E4', d: '#2B2BFF', surface: '#FFF0B8' },
  { id: 'bubble',  name: 'Chicle',    bg: '#FF7FC4', fg: '#2A0016', a: '#FFCE00', b: '#2B2BFF', c: '#FFF4E4', d: '#B7F04A', surface: '#FFC2E2' },
  { id: 'electric',name: 'Eléctrico',     bg: '#2B2BFF', fg: '#EFF0FF', a: '#FFCE00', b: '#FF7FC4', c: '#58E3B4', d: '#FF7A1A', surface: '#4B4BFF' },
  { id: 'lime',    name: 'Lima Ácida',    bg: '#B7F04A', fg: '#0F1A00', a: '#E5007D', b: '#2B2BFF', c: '#FF7A1A', d: '#100C14', surface: '#D3FA8C' },
  { id: 'mint',    name: 'Menta Fría',    bg: '#58E3B4', fg: '#00291D', a: '#FF4433', b: '#7B3FE4', c: '#FFCE00', d: '#2B2BFF', surface: '#93EFCE' },
  { id: 'grape',   name: 'Uva',   bg: '#7B3FE4', fg: '#F5EEFF', a: '#B7F04A', b: '#FF7FC4', c: '#FFCE00', d: '#6FD0FF', surface: '#9464EC' },
  { id: 'tomato',  name: 'Tomate',  bg: '#FF4433', fg: '#2A0400', a: '#FFCE00', b: '#2B2BFF', c: '#FFF4E4', d: '#FF7FC4', surface: '#FF7062' },
  { id: 'sky',     name: 'Cielo',    bg: '#6FD0FF', fg: '#04263A', a: '#FF4433', b: '#FFCE00', c: '#7B3FE4', d: '#FFF4E4', surface: '#A2E1FF' },
  { id: 'ink',     name: 'Medianoche', bg: '#100C14', fg: '#FFF4E4', a: '#FFCE00', b: '#FF7FC4', c: '#58E3B4', d: '#2B2BFF', surface: '#241C2C' },
  { id: 'orange',  name: 'Atardecer', bg: '#FF7A1A', fg: '#2A1000', a: '#2B2BFF', c: '#FFF4E4', b: '#FFCE00', d: '#E5007D', surface: '#FF9C52' },
  { id: 'magenta', name: 'Magenta',  bg: '#E5007D', fg: '#FFF0F8', a: '#FFCE00', b: '#58E3B4', c: '#FFF4E4', d: '#6FD0FF', surface: '#F23D9E' },
];

export const byId = (id: string) => PALETTES.find((p) => p.id === id) ?? PALETTES[0];

let current = PALETTES[0].id;
const subs = new Set<(p: Palette) => void>();

export function applyPalette(p: Palette | string, instant = false) {
  const pal = typeof p === 'string' ? byId(p) : p;
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (instant) root.style.setProperty('transition', 'none');
  root.style.setProperty('--bg', pal.bg);
  root.style.setProperty('--fg', pal.fg);
  root.style.setProperty('--a', pal.a);
  root.style.setProperty('--b', pal.b);
  root.style.setProperty('--c', pal.c);
  root.style.setProperty('--d', pal.d);
  root.style.setProperty('--surface', pal.surface);
  root.style.setProperty('--shade', hexA(pal.fg, 0.16));
  if (instant) requestAnimationFrame(() => root.style.removeProperty('transition'));
  current = pal.id;
  subs.forEach((s) => s(pal));
}

export function currentPaletteId() { return current; }

export function onPalette(fn: (p: Palette) => void) {
  subs.add(fn);
  return () => subs.delete(fn);
}

export function hexA(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** Perceived luminance — used to keep labels legible on any world colour. */
export function isDark(hex: string) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.55;
}
