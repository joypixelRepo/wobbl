'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SplitHeading, Sticker, ToyButton } from '@/components/ui';
import { createWorld, makeBody, step, bodyAt, wake, type World, type Body } from '@/lib/physics';
import { useRaf, useIsTouch, rand, pick } from '@/lib/hooks';
import { HowTo } from '@/components/HowTo';
import { play } from '@/lib/sound';

const COLORS = ['#FF4433', '#FFCE00', '#2B2BFF', '#FF7FC4', '#B7F04A', '#58E3B4', '#7B3FE4', '#FF7A1A', '#6FD0FF'];
const KINDS = ['ball', 'block', 'star', 'ring', 'pill', 'die'] as const;

export default function PlaygroundSection() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const world = useRef<World | null>(null);
  const held = useRef<{ body: Body | null; px: number; py: number; lx: number; ly: number }>({ body: null, px: 0, py: 0, lx: 0, ly: 0 });
  const [live, setLive] = useState(false);
  const [count, setCount] = useState(0);
  const [played, setPlayed] = useState(false);
  const touch = useIsTouch();

  const spawn = useCallback((n: number, atX?: number, atY?: number) => {
    const w = world.current;
    if (!w) return;
    // Objects are sized against the box, so a phone gets a handful of chunky
    // toys instead of a jammed pile that can never settle.
    const small = w.w < 620;
    for (let i = 0; i < n; i++) {
      const r = small ? rand(16, 32) : rand(18, 44);
      w.bodies.push(makeBody({
        x: atX ?? rand(r, w.w - r),
        y: atY ?? rand(-260, -40),
        r,
        vx: rand(-160, 160),
        vy: rand(0, 120),
        spin: rand(-2.5, 2.5),
        restitution: rand(.5, .8),
        kind: pick(KINDS),
        color: pick(COLORS),
        accent: pick(COLORS),
      }));
    }
    // Keep the box from packing so tight that the pile can never come to rest.
    const cap = Math.max(14, Math.min(40, Math.round((w.w * w.h) / 6000)));
    if (w.bodies.length > cap) w.bodies.splice(0, w.bodies.length - cap);
    setCount(w.bodies.length);
    play('pop');
  }, []);

  // Build the world once the element has a size, and only when it is on screen.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const size = () => {
      // clientWidth/Height excludes the 5px border, which is exactly the area
      // the canvas covers — measuring the border box buried bodies off-screen.
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!world.current) {
        world.current = createWorld(w, h);
        spawn(Math.max(9, Math.min(20, Math.round((w * h) / 9000))));
      } else {
        world.current.w = w;
        world.current.h = h;
      }
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, [spawn, touch]);

  useRaf((dt) => {
    const w = world.current;
    const c = canvas.current;
    if (!w || !c) return;
    step(w, dt);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (c.width !== Math.floor(w.w * dpr) || c.height !== Math.floor(w.h * dpr)) {
      c.width = Math.floor(w.w * dpr);
      c.height = Math.floor(w.h * dpr);
      c.style.width = `${w.w}px`;
      c.style.height = `${w.h}px`;
    }
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w.w, w.h);
    for (const b of w.bodies) drawBody(ctx, b);
  }, live);

  /* ---- pointer: pick a toy up, sling it, let go ---- */
  const down = (e: React.PointerEvent) => {
    const w = world.current;
    if (!w) return;
    setPlayed(true);
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const b = bodyAt(w, x, y);
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch { /* no capture available */ }
    if (b) {
      b.held = true;
      b.asleep = false;
      held.current = { body: b, px: x, py: y, lx: x, ly: y };
      play('clack');
    } else {
      spawn(1, x, y);
    }
  };

  const move = (e: React.PointerEvent) => {
    const h = held.current;
    if (!h.body) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    h.lx = h.px; h.ly = h.py;
    h.px = x; h.py = y;
    h.body.x = x;
    h.body.y = y;
    h.body.spin = (x - h.lx) * 0.06;
  };

  const up = () => {
    const h = held.current;
    if (!h.body) return;
    // Throw velocity comes from the last pointer delta — a real sling.
    h.body.held = false;
    h.body.vx = (h.px - h.lx) * 44;
    h.body.vy = (h.py - h.ly) * 44;
    h.body.asleep = false;
    if (Math.hypot(h.body.vx, h.body.vy) > 260) play('whoosh');
    h.body = null;
  };

  return (
    <section id="playground" className="scene playground" data-palette="mint">
      <div className="pg-head">
        <div>
          <Sticker rotate={-4} tone="b">SECCIÓN 05 — SIN SUPERVISIÓN</Sticker>
          <SplitHeading text="ARMA" className="t-huge" />
          <SplitHeading text="JALEO." className="t-huge pg-h2" sticker />
        </div>
        <div className="pg-tools">
          <p className="body-copy pg-copy">
            Coge cualquier cosa y lánzala: pesa, rebota y choca con las demás.
            Toca un hueco vacío y cae algo nuevo.
          </p>
          <HowTo
            steps={['Arrastra un objeto', 'Suéltalo con impulso', 'Toca un hueco vacío']}
            active={played ? -1 : 0}
            done={played ? [0, 1, 2] : []}
            className="pg-howto"
          />
          <div className="pg-btns">
            <ToyButton size="sm" tone="a" onClick={() => spawn(6)} cursor="play">SOLTAR MÁS</ToyButton>
            <ToyButton size="sm" tone="c" onClick={() => { if (world.current) { wake(world.current, 1500); play('boing'); } }} cursor="press">AGITAR LA CAJA</ToyButton>
            <ToyButton size="sm" tone="surface" onClick={() => { if (world.current) { world.current.bodies = []; setCount(0); play('whoosh'); } }} cursor="press">RECOGER</ToyButton>
            <span className="pg-count">{count} OBJETOS</span>
          </div>
        </div>
      </div>

      <div
        className="pg-box"
        ref={host}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        data-cursor="drag"
      >
        <canvas ref={canvas} className="pg-canvas" />
        <span className="pg-floor-label">ARRASTRA · LANZA · REPITE</span>

        <div className={`pg-intro ${played ? 'gone' : ''}`}>
          <div className="pg-intro-card">
            <svg viewBox="0 0 100 100" className="pg-intro-hand" aria-hidden>
              <path d="M34 54V26a7 7 0 0 1 14 0v22V18a7 7 0 0 1 14 0v30V26a7 7 0 0 1 14 0v40c0 16-11 28-27 28S22 82 22 66l-6-14a7 7 0 0 1 12-7z"
                fill="var(--c)" stroke="var(--fg)" strokeWidth="5" strokeLinejoin="round" />
            </svg>
            <span className="pg-intro-title">Coge algo y lánzalo</span>
            <span className="pg-intro-sub">
              Arrastra cualquier objeto y suéltalo en movimiento: sale disparado, rebota y
              choca con los demás. Toca un hueco vacío y cae uno nuevo.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Canvas rendering. Each body is drawn as a moulded object: a flat fill,
 * a highlight at the top-left and a contact shadow at the bottom — the
 * shading is clipped to the shape so bodies never wash over each other.
 * ------------------------------------------------------------------ */
function shapePath(b: Body): Path2D {
  const p = new Path2D();
  const r = b.r;
  switch (b.kind) {
    case 'block': {
      const s = r * 1.5;
      roundRect(p, -s / 2, -s / 2, s, s, r * 0.34);
      break;
    }
    case 'die': {
      const s = r * 1.45;
      roundRect(p, -s / 2, -s / 2, s, s, r * 0.3);
      break;
    }
    case 'star': {
      for (let i = 0; i < 10; i++) {
        const rad = i % 2 ? r * 0.48 : r;
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (i) p.lineTo(x, y); else p.moveTo(x, y);
      }
      p.closePath();
      break;
    }
    case 'ring': {
      p.arc(0, 0, r, 0, Math.PI * 2);
      p.moveTo(r * 0.52, 0);
      p.arc(0, 0, r * 0.52, 0, Math.PI * 2, true);
      break;
    }
    case 'pill': {
      const w = r * 2.1;
      const h = r * 1.05;
      roundRect(p, -w / 2, -h / 2, w, h, h / 2);
      break;
    }
    default:
      p.arc(0, 0, r, 0, Math.PI * 2);
  }
  return p;
}

function drawBody(ctx: CanvasRenderingContext2D, b: Body) {
  const r = b.r;
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.angle);

  const path = shapePath(b);

  // Body + drop shadow
  ctx.shadowColor = 'rgba(0,0,0,.3)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = b.color;
  ctx.fill(path, 'evenodd');
  ctx.shadowColor = 'transparent';

  // Everything below is clipped to this body only.
  ctx.save();
  ctx.clip(path, 'evenodd');

  const g = ctx.createLinearGradient(0, -r, 0, r);
  g.addColorStop(0, 'rgba(255,255,255,.4)');
  g.addColorStop(0.5, 'rgba(255,255,255,0)');
  g.addColorStop(1, 'rgba(0,0,0,.3)');
  ctx.fillStyle = g;
  ctx.fillRect(-r * 2, -r * 2, r * 4, r * 4);

  switch (b.kind) {
    case 'ball':
      ctx.fillStyle = b.accent;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.1, r * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'pill':
      ctx.fillStyle = b.accent;
      ctx.fillRect(-r * 1.05, -r, r * 1.05, r * 2);
      break;
    case 'block':
      ctx.fillStyle = 'rgba(255,255,255,.4)';
      roundRectFill(ctx, -r * 0.55, -r * 0.55, r * 1.1, r * 0.24, r * 0.12);
      break;
    case 'die': {
      ctx.fillStyle = 'rgba(255,255,255,.9)';
      const d = r * 0.36;
      [[-d, -d], [d, d], [0, 0], [d, -d], [-d, d]].forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.arc(dx, dy, r * 0.13, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }
    case 'star':
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      ctx.beginPath();
      ctx.arc(-r * 0.2, -r * 0.28, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  // Specular dot, top-left, on every material.
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.beginPath();
  ctx.arc(-r * 0.36, -r * 0.4, r * 0.16, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}

function roundRect(p: Path2D, x: number, y: number, w: number, h: number, r: number) {
  p.moveTo(x + r, y);
  p.arcTo(x + w, y, x + w, y + h, r);
  p.arcTo(x + w, y + h, x, y + h, r);
  p.arcTo(x, y + h, x, y, r);
  p.arcTo(x, y, x + w, y, r);
  p.closePath();
}

function roundRectFill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const p = new Path2D();
  roundRect(p, x, y, w, h, r);
  ctx.fill(p);
}
