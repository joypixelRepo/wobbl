'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SplitHeading, Sticker, ToyButton } from '@/components/ui';
import Toy from '@/components/Toy';
import { HowTo, FirstHint } from '@/components/HowTo';
import { play, fanfare } from '@/lib/sound';
import { clamp } from '@/lib/hooks';

/**
 * A construction yard. Pieces are draggable; each one has a home slot.
 * Come within the snap radius and it clicks into place by itself.
 * Finishing the build is entirely optional — the page never waits for it.
 */

interface Piece {
  id: string;
  label: string;
  color: string;
  /** home slot, in % of the board */
  hx: number; hy: number;
  /** scattered start, in % of the board */
  sx: number; sy: number;
  w: number;         // width in % of board
  shape: 'brick' | 'arch' | 'wheel' | 'cone' | 'window' | 'flag';
  rot: number;
}

const PIECES: Piece[] = [
  { id: 'base',   label: 'BASE',   color: '#2B2BFF', hx: 50, hy: 74, sx: 14, sy: 26, w: 30, shape: 'brick',  rot: -12 },
  { id: 'mid',    label: 'CHASIS',   color: '#FF4433', hx: 50, hy: 55, sx: 84, sy: 20, w: 24, shape: 'window', rot: 14 },
  { id: 'arch',   label: 'ARCO',   color: '#FFCE00', hx: 50, hy: 38, sx: 10, sy: 74, w: 21, shape: 'arch',   rot: -22 },
  { id: 'cone',   label: 'PUNTA',    color: '#FF7FC4', hx: 50, hy: 22, sx: 88, sy: 66, w: 16, shape: 'cone',   rot: 26 },
  { id: 'wheelL', label: 'RUEDA',  color: '#58E3B4', hx: 32, hy: 82, sx: 30, sy: 88, w: 13, shape: 'wheel',  rot: 40 },
  { id: 'wheelR', label: 'RUEDA',  color: '#58E3B4', hx: 68, hy: 82, sx: 68, sy: 90, w: 13, shape: 'wheel',  rot: -34 },
  { id: 'flag',   label: 'BANDERA',   color: '#B7F04A', hx: 50, hy: 9,  sx: 52, sy: 14, w: 14, shape: 'flag',   rot: 18 },
];

const SNAP_RADIUS = 7; // in % of board width

function Shape({ shape, color, label }: { shape: Piece['shape']; color: string; label: string }) {
  const common = { fill: color } as const;
  switch (shape) {
    case 'brick':
      return (
        <svg viewBox="0 0 120 60">
          <rect x="2" y="10" width="116" height="48" rx="12" {...common} />
          <rect x="2" y="10" width="116" height="48" rx="12" fill="url(#bp-sheen)" />
          <ellipse cx="30" cy="10" rx="14" ry="7" fill={color} />
          <ellipse cx="60" cy="10" rx="14" ry="7" fill={color} />
          <ellipse cx="90" cy="10" rx="14" ry="7" fill={color} />
          <ellipse cx="30" cy="8" rx="14" ry="7" fill="rgba(255,255,255,.3)" />
          <ellipse cx="60" cy="8" rx="14" ry="7" fill="rgba(255,255,255,.3)" />
          <ellipse cx="90" cy="8" rx="14" ry="7" fill="rgba(255,255,255,.3)" />
          <text x="60" y="42" textAnchor="middle" className="bp-txt">{label}</text>
        </svg>
      );
    case 'window':
      return (
        <svg viewBox="0 0 100 70">
          <rect x="2" y="4" width="96" height="62" rx="14" {...common} />
          <rect x="2" y="4" width="96" height="62" rx="14" fill="url(#bp-sheen)" />
          <circle cx="50" cy="34" r="19" fill="rgba(255,255,255,.85)" />
          <circle cx="50" cy="34" r="19" fill="none" stroke="rgba(0,0,0,.2)" strokeWidth="3" />
          <circle cx="44" cy="28" r="6" fill="rgba(255,255,255,.9)" />
        </svg>
      );
    case 'arch':
      return (
        <svg viewBox="0 0 100 70">
          <path d="M4 66V38a46 46 0 0 1 92 0v28H70V38a20 20 0 0 0-40 0v28z" {...common} />
          <path d="M4 66V38a46 46 0 0 1 92 0v28H70V38a20 20 0 0 0-40 0v28z" fill="url(#bp-sheen)" />
        </svg>
      );
    case 'cone':
      return (
        <svg viewBox="0 0 80 80">
          <path d="M40 2 76 74H4z" {...common} />
          <path d="M40 2 76 74H4z" fill="url(#bp-sheen)" />
          <circle cx="40" cy="56" r="9" fill="rgba(255,255,255,.6)" />
        </svg>
      );
    case 'wheel':
      return (
        <svg viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="37" fill="#100C14" />
          <circle cx="40" cy="40" r="22" {...common} />
          <circle cx="40" cy="40" r="22" fill="url(#bp-sheen)" />
          {[0, 60, 120].map((a) => (
            <rect key={a} x="37" y="14" width="6" height="52" rx="3" fill="rgba(0,0,0,.35)" transform={`rotate(${a} 40 40)`} />
          ))}
        </svg>
      );
    default: // flag
      return (
        <svg viewBox="0 0 80 90">
          <rect x="36" y="6" width="7" height="80" rx="3.5" fill="#100C14" />
          <path d="M43 10h32l-9 15 9 15H43z" {...common} />
          <circle cx="39.5" cy="6" r="8" fill={color} />
        </svg>
      );
  }
}

export default function BuildSection() {
  const board = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Record<string, { x: number; y: number; rot: number }>>(
    () => Object.fromEntries(PIECES.map((p) => [p.id, { x: p.sx, y: p.sy, rot: p.rot }])),
  );
  const [locked, setLocked] = useState<Record<string, boolean>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const [near, setNear] = useState(false);
  const [done, setDone] = useState(false);
  const grab = useRef({ dx: 0, dy: 0 });
  const lockedCount = Object.values(locked).filter(Boolean).length;

  const toPct = useCallback((clientX: number, clientY: number) => {
    const r = board.current!.getBoundingClientRect();
    return { x: ((clientX - r.left) / r.width) * 100, y: ((clientY - r.top) / r.height) * 100 };
  }, []);

  const onDown = (e: React.PointerEvent, p: Piece) => {
    if (locked[p.id]) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const c = toPct(e.clientX, e.clientY);
    grab.current = { dx: pos[p.id].x - c.x, dy: pos[p.id].y - c.y };
    setDragId(p.id);
    play('clack');
  };

  /** Distance from a piece to its own slot, in board units. */
  const distanceHome = (p: Piece, x: number, y: number) => Math.hypot(x - p.hx, (y - p.hy) * .6);

  const onMove = (e: React.PointerEvent, p: Piece) => {
    if (dragId !== p.id) return;
    const c = toPct(e.clientX, e.clientY);
    const nx = clamp(c.x + grab.current.dx, 3, 97);
    const ny = clamp(c.y + grab.current.dy, 3, 97);
    setPos((s) => ({ ...s, [p.id]: { x: nx, y: ny, rot: s[p.id].rot * .82 } }));
    setNear(distanceHome(p, nx, ny) < SNAP_RADIUS);
  };

  const onUp = (p: Piece) => {
    if (dragId !== p.id) return;
    setDragId(null);
    setNear(false);
    const cur = pos[p.id];
    const dist = distanceHome(p, cur.x, cur.y);
    if (dist < SNAP_RADIUS) {
      setPos((s) => ({ ...s, [p.id]: { x: p.hx, y: p.hy, rot: 0 } }));
      setLocked((l) => ({ ...l, [p.id]: true }));
      play('snap');
    } else {
      // Dropped in the wrong place — it bounces back home to the pile.
      play('boing');
      setPos((s) => ({ ...s, [p.id]: { x: p.sx, y: p.sy, rot: p.rot } }));
    }
  };

  useEffect(() => {
    if (lockedCount === PIECES.length && !done) {
      setDone(true);
      window.setTimeout(fanfare, 120);
    }
  }, [lockedCount, done]);

  function reset() {
    setDone(false);
    setLocked({});
    setPos(Object.fromEntries(PIECES.map((p) => [p.id, { x: p.sx, y: p.sy, rot: p.rot }])));
    play('whoosh');
  }

  function autoBuild() {
    PIECES.forEach((p, i) => {
      window.setTimeout(() => {
        setPos((s) => ({ ...s, [p.id]: { x: p.hx, y: p.hy, rot: 0 } }));
        setLocked((l) => ({ ...l, [p.id]: true }));
        play('snap');
      }, i * 130);
    });
  }

  return (
    <section id="build" className="scene build" data-palette="lemon">
      <svg width="0" height="0" aria-hidden style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="bp-sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity=".42" />
            <stop offset="52%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity=".2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="build-head">
        <Sticker rotate={-3} tone="a">SECCIÓN 01 — ZONA DE OBRAS</Sticker>
        <SplitHeading text="CONSTRUYE" className="t-huge" />
        <SplitHeading text="TU MUNDO." className="t-huge build-h2" sticker />
        <p className="body-copy build-copy">
          Siete piezas sueltas y siete huecos de línea discontinua. Arrastra una pieza
          encima de su hueco y encajará sola. Si la sueltas donde no toca, vuelve rebotando
          al montón: sabe dónde vive.
        </p>
        <HowTo
          steps={['Coge una pieza', 'Llévala a su hueco', 'Suéltala y encaja']}
          active={lockedCount === PIECES.length ? -1 : dragId ? (near ? 2 : 1) : 0}
          done={lockedCount === PIECES.length ? [0, 1, 2] : []}
        />
        <div className="build-actions">
          <ToyButton size="sm" tone="fg" onClick={autoBuild} cursor="build">MÓNTALO TÚ</ToyButton>
          <ToyButton size="sm" tone="surface" onClick={reset} cursor="press">DESMONTAR</ToyButton>
          <span className="build-progress">
            <b>{lockedCount}</b> / {PIECES.length} ENCAJADAS
          </span>
        </div>
      </div>

      <div className={`build-board ${done ? 'is-done' : ''}`} ref={board} data-cursor="build">
        {/* ghost silhouette showing where things go */}
        {PIECES.map((p) => (
          <span
            key={`ghost-${p.id}`}
            className={`build-ghost ${locked[p.id] ? 'filled' : ''} ${dragId === p.id ? 'target' : ''} ${dragId === p.id && near ? 'ready' : ''}`}
            style={{ left: `${p.hx}%`, top: `${p.hy}%`, width: `${p.w}%` }}
            aria-hidden
          >
            {dragId === p.id && <b>{near ? '¡AQUÍ!' : p.label}</b>}
          </span>
        ))}

        <FirstHint show={lockedCount === 0 && !dragId} label="Arrastra una pieza" className="fh-build" />

        {PIECES.map((p) => {
          const s = pos[p.id];
          const isLocked = locked[p.id];
          return (
            <div
              key={p.id}
              className={`build-piece ${isLocked ? 'locked' : ''} ${dragId === p.id ? 'dragging' : ''}`}
              style={{
                left: `${s.x}%`, top: `${s.y}%`, width: `${p.w}%`,
                transform: `translate(-50%,-50%) rotate(${s.rot}deg)`,
                zIndex: dragId === p.id ? 40 : isLocked ? 10 : 20,
              }}
              data-cursor={isLocked ? 'play' : 'grab'}
              onPointerDown={(e) => onDown(e, p)}
              onPointerMove={(e) => onMove(e, p)}
              onPointerUp={() => onUp(p)}
              onPointerCancel={() => onUp(p)}
            >
              <Shape shape={p.shape} color={p.color} label={p.label} />
              {isLocked && <span className="build-snap-fx" aria-hidden />}
            </div>
          );
        })}

        {done && (
          <div className="build-win">
            <span className="build-win-word">¡LO HAS MONTADO!</span>
            <div className="build-win-toy">
              <Toy kind="racer" body="#FF4433" accent="#FFF4E4" extra="#FFCE00" look={{ x: 0, y: 0 }} spin={240} />
            </div>
            <span className="build-win-name">ZIP VELOZ · 64 €</span>
            <ToyButton size="sm" tone="c" onClick={reset}>MONTAR OTRO</ToyButton>
          </div>
        )}
      </div>
    </section>
  );
}
