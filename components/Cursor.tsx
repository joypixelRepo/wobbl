'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsTouch, useRaf } from '@/lib/hooks';

type Mode = 'default' | 'play' | 'grab' | 'build' | 'open' | 'drag' | 'view' | 'press';

const SHAPES: Record<Mode, { size: number; label: string; shape: 'dot' | 'ring' | 'star' | 'puzzle' | 'hand' | 'ball' }> = {
  default: { size: 18, label: '', shape: 'dot' },
  play:    { size: 84, label: 'JUGAR', shape: 'ring' },
  grab:    { size: 76, label: 'COGER', shape: 'hand' },
  build:   { size: 82, label: 'MONTAR', shape: 'puzzle' },
  open:    { size: 80, label: 'ABRIR', shape: 'ring' },
  drag:    { size: 72, label: 'MUEVE', shape: 'ball' },
  view:    { size: 86, label: 'MIRAR', shape: 'ring' },
  press:   { size: 78, label: 'PULSA', shape: 'star' },
};

interface Particle { x: number; y: number; vx: number; vy: number; life: number; size: number; hue: number; }

export default function Cursor() {
  const touch = useIsTouch();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>('default');
  const [down, setDown] = useState(false);
  const target = useRef({ x: -100, y: -100 });
  const painted = useRef({ x: -100, y: -100 });
  const parts = useRef<Particle[]>([]);
  const lastEmit = useRef(0);
  // The painter runs from the pointer event itself, so it needs the current
  // mode and press state without waiting for a React render.
  const modeRef = useRef<Mode>('default');
  const downRef = useRef(false);

  useEffect(() => {
    if (touch) return;
    document.body.classList.add('has-toy-cursor');
    return () => { document.body.classList.remove('has-toy-cursor'); };
  }, [touch]);

  useEffect(() => {
    if (touch) return;
    const move = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      // Paint from the event, not from the next frame: the drawn cursor sits
      // exactly where the system pointer is, with no easing and no lag.
      paint(performance.now());
      const el = (e.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null;
      const next = (el?.dataset.cursor as Mode) || 'default';
      modeRef.current = next;
      setMode((m) => (m === next ? m : next));
    };
    const dn = (e: PointerEvent) => { downRef.current = true; setDown(true); burst(e.clientX, e.clientY); };
    const up = () => { downRef.current = false; setDown(false); };
    const leave = () => { target.current.x = -200; target.current.y = -200; };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', dn, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', dn);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('pointerleave', leave);
    };
  }, [touch]);

  function burst(x: number, y: number) {
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.4;
      const sp = 90 + Math.random() * 190;
      parts.current.push({
        x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 1, size: 3 + Math.random() * 6,
        hue: Math.floor(Math.random() * 360),
      });
    }
  }

  /* Dot and ring are pinned 1:1 to the system pointer — no smoothing, no
     trailing. Only the idle wobble and the press squash are animated. */
  const paint = (t: number) => {
    const { x, y } = target.current;
    if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%,-50%)`;
    if (ring.current) {
      const m = modeRef.current;
      const s = SHAPES[m].size;
      const wob = m === 'default' ? 0 : Math.sin(t / 220) * 3;
      ring.current.style.transform =
        `translate3d(${x}px, ${y}px, 0) translate(-50%,-50%) scale(${(downRef.current ? 0.82 : 1) * (1 + wob / 100)})`;
      ring.current.style.width = `${s}px`;
      ring.current.style.height = `${s}px`;
    }
  };

  useRaf((dt, t) => {
    if (touch) return;
    paint(t);

    // Trail particles — only while actually moving, and only over hot zones.
    const speed = Math.hypot(target.current.x - painted.current.x, target.current.y - painted.current.y);
    painted.current.x = target.current.x;
    painted.current.y = target.current.y;
    if (mode !== 'default' && speed > 6 && t - lastEmit.current > 34) {
      lastEmit.current = t;
      parts.current.push({
        x: target.current.x + (Math.random() - 0.5) * 16,
        y: target.current.y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 40, vy: 40 + Math.random() * 60,
        life: 1, size: 4 + Math.random() * 5,
        hue: Math.floor(Math.random() * 360),
      });
    }

    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (c.width !== window.innerWidth * dpr) {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const alive: Particle[] = [];
    for (const p of parts.current) {
      p.life -= dt * 1.5;
      if (p.life <= 0) continue;
      p.vy += 900 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = `hsl(${p.hue} 95% 60%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      alive.push(p);
    }
    ctx.globalAlpha = 1;
    parts.current = alive.slice(-220);
  }, !touch);

  if (touch) return null;

  const cfg = SHAPES[mode];
  return (
    <>
      <canvas ref={canvas} className="cursor-canvas" aria-hidden />
      <div ref={ring} className={`cursor-ring shape-${cfg.shape} ${mode !== 'default' ? 'is-hot' : ''}`} aria-hidden>
        {cfg.shape === 'star' && <Star />}
        {cfg.shape === 'puzzle' && <Puzzle />}
        {cfg.shape === 'hand' && <Hand />}
        {cfg.shape === 'ball' && <Ball />}
        {cfg.label && <span className="cursor-label">{cfg.label}</span>}
      </div>
      <div ref={dot} className={`cursor-dot ${mode !== 'default' ? 'is-hidden' : ''}`} aria-hidden />
    </>
  );
}

const Star = () => (
  <svg viewBox="0 0 100 100" className="cursor-svg">
    <path d="M50 4 61 36h34L67 56l11 34-28-21-28 21 11-34L5 36h34z" fill="var(--c)" stroke="var(--fg)" strokeWidth="5" strokeLinejoin="round" />
  </svg>
);
const Puzzle = () => (
  <svg viewBox="0 0 100 100" className="cursor-svg">
    <path d="M22 22h20a8 8 0 1 1 16 0h20v20a8 8 0 1 0 0 16v20H58a8 8 0 1 0-16 0H22V58a8 8 0 1 1 0-16z" fill="var(--d)" stroke="var(--fg)" strokeWidth="5" strokeLinejoin="round" />
  </svg>
);
const Hand = () => (
  <svg viewBox="0 0 100 100" className="cursor-svg">
    <path d="M34 54V26a7 7 0 0 1 14 0v22V18a7 7 0 0 1 14 0v30V26a7 7 0 0 1 14 0v40c0 16-11 28-27 28S22 82 22 66l-6-14a7 7 0 0 1 12-7z" fill="var(--c)" stroke="var(--fg)" strokeWidth="5" strokeLinejoin="round" />
  </svg>
);
const Ball = () => (
  <svg viewBox="0 0 100 100" className="cursor-svg">
    <circle cx="50" cy="50" r="42" fill="var(--a)" stroke="var(--fg)" strokeWidth="5" />
    <path d="M14 42q36 14 72 0M14 62q36 14 72 0" stroke="var(--fg)" strokeWidth="4" fill="none" opacity=".55" />
  </svg>
);
