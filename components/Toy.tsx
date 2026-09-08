'use client';

import { useId } from 'react';
import type { ToyKind } from '@/data/catalog';

export interface ToyProps {
  kind: ToyKind;
  body: string;
  accent: string;
  extra: string;
  /** -1..1, tilts the toy and steers the eyes toward the pointer */
  look?: { x: number; y: number };
  /** continuous rotation for wheels / spinners, in degrees */
  spin?: number;
  className?: string;
  style?: React.CSSProperties;
  /** part id -> click handler, for the interactive hero toy */
  onPart?: (part: string) => void;
  /** parts currently "reacting" (lit, ejected, spinning) */
  active?: Record<string, number>;
  shadow?: boolean;
}

/* ------------------------------------------------------------------ *
 * Shared material defs. Every toy gets the same lighting model so the
 * whole catalogue reads as one product family: soft top-left key light,
 * warm bounce underneath, a tight specular dot on curved surfaces.
 * ------------------------------------------------------------------ */
function Materials({ uid, body, accent, extra }: { uid: string; body: string; accent: string; extra: string }) {
  return (
    <defs>
      <radialGradient id={`${uid}-body`} cx="32%" cy="24%" r="86%">
        <stop offset="0%" stopColor="#fff" stopOpacity=".55" />
        <stop offset="42%" stopColor={body} stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity=".26" />
      </radialGradient>
      <radialGradient id={`${uid}-accent`} cx="34%" cy="26%" r="82%">
        <stop offset="0%" stopColor="#fff" stopOpacity=".5" />
        <stop offset="45%" stopColor={accent} stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity=".24" />
      </radialGradient>
      <radialGradient id={`${uid}-extra`} cx="34%" cy="26%" r="82%">
        <stop offset="0%" stopColor="#fff" stopOpacity=".45" />
        <stop offset="48%" stopColor={extra} stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity=".22" />
      </radialGradient>
      <linearGradient id={`${uid}-rim`} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#fff" stopOpacity=".42" />
        <stop offset="55%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${uid}-ground`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#000" stopOpacity=".34" />
        <stop offset="70%" stopColor="#000" stopOpacity=".08" />
        <stop offset="100%" stopColor="#000" stopOpacity="0" />
      </radialGradient>
      <filter id={`${uid}-soft`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
  );
}

const Gloss = ({ uid, d, on = 'body' }: { uid: string; d: string; on?: string }) => (
  <path d={d} fill={`url(#${uid}-${on})`} style={{ pointerEvents: 'none' }} />
);

/** Eyes that track the pointer — used by every character-shaped toy. */
function Eyes({
  cx, cy, gap, r, look, ink = '#100C14', blink = true,
}: { cx: number; cy: number; gap: number; r: number; look: { x: number; y: number }; ink?: string; blink?: boolean }) {
  const dx = look.x * r * 0.42;
  const dy = look.y * r * 0.42;
  return (
    <g className={blink ? 'toy-blink' : undefined} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={cx + s * gap} cy={cy} rx={r} ry={r * 1.08} fill="#fff" />
          <ellipse cx={cx + s * gap} cy={cy} rx={r} ry={r * 1.08} fill="none" stroke="rgba(0,0,0,.12)" strokeWidth="1" />
          <circle cx={cx + s * gap + dx} cy={cy + dy} r={r * 0.5} fill={ink} />
          <circle cx={cx + s * gap + dx - r * 0.16} cy={cy + dy - r * 0.18} r={r * 0.15} fill="#fff" opacity=".9" />
        </g>
      ))}
    </g>
  );
}

/* ================================================================== */

export default function Toy({
  kind, body, accent, extra,
  look = { x: 0, y: 0 },
  spin = 0,
  className, style, onPart, active = {}, shadow = true,
}: ToyProps) {
  const uid = useId().replace(/[:]/g, '');
  const part = (id: string) =>
    onPart
      ? { onPointerDown: (e: React.PointerEvent) => { e.stopPropagation(); onPart(id); }, style: { cursor: 'none' as const } }
      : {};
  const A = (id: string) => active[id] ?? 0;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ overflow: 'visible', display: 'block', ...style }}
      aria-hidden="true"
    >
      <Materials uid={uid} body={body} accent={accent} extra={extra} />
      {shadow && (
        <ellipse cx="100" cy="184" rx={54 - look.y * 4} ry="11" fill={`url(#${uid}-ground)`} />
      )}
      {kind === 'bot' && <Bot {...{ uid, body, accent, extra, look, part, A }} />}
      {kind === 'spring' && <Spring {...{ uid, body, accent, extra, look, part, A }} />}
      {kind === 'stack' && <Stack {...{ uid, body, accent, extra, look, part, A }} />}
      {kind === 'blob' && <Blob {...{ uid, body, accent, extra, look, part, A }} />}
      {kind === 'racer' && <Racer {...{ uid, body, accent, extra, look, part, A, spin }} />}
      {kind === 'roller' && <Roller {...{ uid, body, accent, extra, look, part, A, spin }} />}
      {kind === 'planet' && <Planet {...{ uid, body, accent, extra, look, part, A, spin }} />}
      {kind === 'noise' && <Noise {...{ uid, body, accent, extra, look, part, A }} />}
    </svg>
  );
}

type SubProps = {
  uid: string; body: string; accent: string; extra: string;
  look: { x: number; y: number };
  part: (id: string) => Record<string, unknown>;
  A: (id: string) => number;
  spin?: number;
};

/* ---------------------------- WOBBL BOT --------------------------- */
function Bot({ uid, body, accent, extra, look, part, A }: SubProps) {
  const armL = A('arm-l');
  const armR = A('arm-r');
  const head = A('head');
  return (
    <g>
      {/* legs */}
      <g {...part('legs')}>
        <rect x="72" y="146" width="22" height="26" rx="10" fill={extra} />
        <rect x="106" y="146" width="22" height="26" rx="10" fill={extra} />
        <rect x="66" y="164" width="34" height="14" rx="7" fill={accent} />
        <rect x="100" y="164" width="34" height="14" rx="7" fill={accent} />
        <Gloss uid={uid} d="M66 164h34v14H66z" on="accent" />
      </g>

      {/* left arm — swings out when clicked */}
      <g {...part('arm-l')} style={{ transform: `rotate(${-14 - armL * 46}deg)`, transformOrigin: '62px 104px', transition: 'transform .5s cubic-bezier(.34,1.8,.44,1)' }}>
        <rect x="28" y="96" width="44" height="17" rx="8.5" fill={body} />
        <rect x="28" y="96" width="44" height="7" rx="3.5" fill="rgba(255,255,255,.3)" />
        <circle cx="30" cy="104" r="13" fill={accent} />
        <circle cx="30" cy="104" r="13" fill={`url(#${uid}-accent)`} />
      </g>
      {/* right arm */}
      <g {...part('arm-r')} style={{ transform: `rotate(${14 + armR * 46}deg)`, transformOrigin: '138px 104px', transition: 'transform .5s cubic-bezier(.34,1.8,.44,1)' }}>
        <rect x="128" y="96" width="44" height="17" rx="8.5" fill={body} />
        <rect x="128" y="96" width="44" height="7" rx="3.5" fill="rgba(255,255,255,.3)" />
        <circle cx="170" cy="104" r="13" fill={accent} />
        <circle cx="170" cy="104" r="13" fill={`url(#${uid}-accent)`} />
      </g>

      {/* torso */}
      <g {...part('torso')}>
        <rect x="58" y="84" width="84" height="72" rx="24" fill={body} />
        <rect x="58" y="84" width="84" height="72" rx="24" fill={`url(#${uid}-body)`} />
        <rect x="58" y="84" width="84" height="72" rx="24" fill={`url(#${uid}-rim)`} />
        {/* chest button — lights up */}
        <circle cx="100" cy="118" r="15" fill={extra} />
        <circle
          cx="100" cy="118" r={10 + A('chest') * 3}
          fill={A('chest') ? accent : 'rgba(255,255,255,.55)'}
          style={{ transition: 'all .3s ease' }}
        />
        {A('chest') > 0 && <circle cx="100" cy="118" r="24" fill="none" stroke={accent} strokeWidth="3" opacity=".5" className="toy-ping" />}
        <rect x="76" y="140" width="48" height="7" rx="3.5" fill="rgba(0,0,0,.16)" />
      </g>

      {/* neck */}
      <rect x="92" y="72" width="16" height="16" rx="6" fill={extra} />

      {/* head — pops up when clicked */}
      <g
        {...part('head')}
        style={{
          transform: `translate(${look.x * 4}px, ${look.y * 3 - head * 12}px) rotate(${look.x * 4}deg)`,
          transformOrigin: '100px 50px',
          transition: 'transform .55s cubic-bezier(.34,1.8,.44,1)',
        }}
      >
        <rect x="56" y="20" width="88" height="60" rx="26" fill={accent} />
        <rect x="56" y="20" width="88" height="60" rx="26" fill={`url(#${uid}-accent)`} />
        {/* antenna */}
        <rect x="97" y="4" width="6" height="18" rx="3" fill={extra} />
        <circle cx="100" cy="6" r="8" fill={body} className="toy-bob" />
        {/* screen face */}
        <rect x="68" y="34" width="64" height="34" rx="14" fill="rgba(16,12,20,.86)" />
        <Eyes cx={100} cy={51} gap={14} r={7} look={look} ink="#FFF4E4" />
        {/* side vents */}
        <rect x="52" y="42" width="8" height="18" rx="4" fill={extra} />
        <rect x="140" y="42" width="8" height="18" rx="4" fill={extra} />
      </g>
    </g>
  );
}

/* ------------------------------ BOING ----------------------------- */
function Spring({ uid, body, accent, extra, look, part, A }: SubProps) {
  const squash = A('squash');
  const coils = [0, 1, 2, 3, 4];
  return (
    <g style={{ transform: `translateY(${squash * 10}px) scaleY(${1 - squash * 0.16})`, transformOrigin: '100px 178px', transition: 'transform .45s cubic-bezier(.34,1.8,.44,1)' }}>
      {/* base */}
      <ellipse cx="100" cy="172" rx="42" ry="12" fill={extra} />
      <ellipse cx="100" cy="169" rx="42" ry="12" fill={accent} />
      {/* coil */}
      <g {...part('squash')}>
        {coils.map((i) => {
          const y = 158 - i * (20 - squash * 4);
          const rx = 36 - i * 2.4;
          return (
            <g key={i}>
              <ellipse cx="100" cy={y} rx={rx} ry={rx * 0.3} fill="none" stroke={body} strokeWidth="13" strokeLinecap="round" />
              <ellipse cx="100" cy={y - 2} rx={rx} ry={rx * 0.3} fill="none" stroke="rgba(255,255,255,.32)" strokeWidth="4" strokeLinecap="round" />
            </g>
          );
        })}
      </g>
      {/* head */}
      <g {...part('head')} style={{ transform: `translate(${look.x * 7}px, ${look.y * 5}px) rotate(${look.x * 8}deg)`, transformOrigin: '100px 60px', transition: 'transform .3s ease-out' }}>
        <ellipse cx="100" cy="58" rx="44" ry="40" fill={body} />
        <ellipse cx="100" cy="58" rx="44" ry="40" fill={`url(#${uid}-body)`} />
        <ellipse cx="100" cy="58" rx="44" ry="40" fill={`url(#${uid}-rim)`} />
        <Eyes cx={100} cy={52} gap={15} r={9} look={look} />
        <path d="M86 74 Q100 86 114 74" stroke="#100C14" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        {/* ears */}
        <ellipse cx="62" cy="34" rx="12" ry="16" fill={accent} transform="rotate(-24 62 34)" />
        <ellipse cx="138" cy="34" rx="12" ry="16" fill={accent} transform="rotate(24 138 34)" />
      </g>
    </g>
  );
}

/* --------------------------- STACK TOWER -------------------------- */
function Stack({ uid, body, accent, extra, look, part, A }: SubProps) {
  const blocks = [
    { y: 150, w: 96, fill: extra, id: 'b0' },
    { y: 120, w: 82, fill: body, id: 'b1' },
    { y: 92, w: 68, fill: accent, id: 'b2' },
    { y: 66, w: 54, fill: extra, id: 'b3' },
  ];
  return (
    <g>
      {blocks.map((b, i) => (
        <g
          key={b.id}
          {...part(b.id)}
          style={{
            transform: `translate(${look.x * (i + 1) * 1.6 + A(b.id) * 26}px, ${-A(b.id) * 14}px) rotate(${look.x * (i + 1) * 0.9 + A(b.id) * 16}deg)`,
            transformOrigin: `100px ${b.y + 13}px`,
            transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)',
          }}
        >
          <rect x={100 - b.w / 2} y={b.y} width={b.w} height="26" rx="9" fill={b.fill} />
          <rect x={100 - b.w / 2} y={b.y} width={b.w} height="26" rx="9" fill={`url(#${uid}-rim)`} />
          <rect x={100 - b.w / 2 + 6} y={b.y + 5} width={b.w - 12} height="6" rx="3" fill="rgba(255,255,255,.35)" />
          {/* stud */}
          <ellipse cx="100" cy={b.y + 1} rx="11" ry="4.5" fill="rgba(0,0,0,.14)" />
        </g>
      ))}
      {/* topper ball */}
      <g {...part('top')} style={{ transform: `translateY(${-A('top') * 30}px)`, transition: 'transform .5s cubic-bezier(.34,1.8,.44,1)' }}>
        <circle cx="100" cy="46" r="19" fill={body} />
        <circle cx="100" cy="46" r="19" fill={`url(#${uid}-body)`} />
        <circle cx="93" cy="39" r="6" fill="rgba(255,255,255,.6)" />
      </g>
    </g>
  );
}

/* --------------------------- BLOB BUDDY --------------------------- */
function Blob({ uid, body, accent, look, part, A }: SubProps) {
  const s = A('squish');
  return (
    <g
      {...part('squish')}
      className="toy-wobble"
      style={{
        transform: `translate(${look.x * 5}px,0) scale(${1 + s * 0.1}, ${1 - s * 0.16})`,
        transformOrigin: '100px 170px',
        transition: 'transform .5s cubic-bezier(.34,1.8,.44,1)',
      }}
    >
      <path
        d="M100 32c34 0 60 24 62 56 2 30-12 52-32 62-12 6-18 20-30 20s-18-14-30-20C50 140 36 118 38 88c2-32 28-56 62-56z"
        fill={body}
      />
      <path
        d="M100 32c34 0 60 24 62 56 2 30-12 52-32 62-12 6-18 20-30 20s-18-14-30-20C50 140 36 118 38 88c2-32 28-56 62-56z"
        fill={`url(#${uid}-body)`}
      />
      {/* wet highlight */}
      <ellipse cx="76" cy="66" rx="17" ry="12" fill="#fff" opacity=".5" transform="rotate(-24 76 66)" />
      <ellipse cx="128" cy="58" rx="6" ry="4" fill="#fff" opacity=".65" transform="rotate(-24 128 58)" />
      <Eyes cx={100} cy={92} gap={20} r={12} look={look} ink={accent} />
      <path d="M84 122 Q100 138 116 122" stroke={accent} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* blush */}
      <ellipse cx="66" cy="112" rx="9" ry="6" fill="#fff" opacity=".28" />
      <ellipse cx="134" cy="112" rx="9" ry="6" fill="#fff" opacity=".28" />
    </g>
  );
}

/* ---------------------------- ZIP RACER --------------------------- */
function Racer({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const roll = spin + A('wheel') * 720;
  return (
    <g style={{ transform: `translate(${look.x * 6}px, ${look.y * 3}px)` }}>
      {/* body */}
      <g {...part('shell')}>
        <path d="M34 128c0-16 10-26 26-30l16-22c5-7 12-10 20-10h20c10 0 18 6 22 15l9 20c12 4 20 14 20 27 0 10-8 18-18 18H50c-9 0-16-8-16-18z" fill={body} />
        <path d="M34 128c0-16 10-26 26-30l16-22c5-7 12-10 20-10h20c10 0 18 6 22 15l9 20c12 4 20 14 20 27 0 10-8 18-18 18H50c-9 0-16-8-16-18z" fill={`url(#${uid}-body)`} />
        {/* windscreen */}
        <path d="M82 74c3-5 8-8 14-8h16c7 0 12 4 15 11l6 15H72z" fill={extra} opacity=".9" />
        <path d="M82 74c3-5 8-8 14-8h16c7 0 12 4 15 11l6 15H72z" fill={`url(#${uid}-rim)`} />
        {/* racing stripe */}
        <rect x="94" y="98" width="14" height="48" rx="4" fill={accent} />
        {/* spoiler */}
        <rect x="140" y="86" width="30" height="9" rx="4" fill={accent} />
        <rect x="152" y="92" width="7" height="16" rx="3" fill={accent} />
        {/* headlight */}
        <ellipse cx="42" cy="112" rx="9" ry="7" fill={accent} />
      </g>
      {/* wheels */}
      {[66, 138].map((cx) => (
        <g key={cx} {...part('wheel')} style={{ transform: `rotate(${roll}deg)`, transformOrigin: `${cx}px 150px`, transition: A('wheel') ? 'transform 1.4s cubic-bezier(.2,.8,.2,1)' : 'none' }}>
          <circle cx={cx} cy="150" r="24" fill="#100C14" />
          <circle cx={cx} cy="150" r="13" fill={accent} />
          <circle cx={cx} cy="150" r="13" fill={`url(#${uid}-accent)`} />
          {[0, 60, 120].map((a) => (
            <rect key={a} x={cx - 1.8} y="136" width="3.6" height="28" rx="1.8" fill="rgba(0,0,0,.35)" transform={`rotate(${a} ${cx} 150)`} />
          ))}
        </g>
      ))}
    </g>
  );
}

/* --------------------------- MOON ROLLER -------------------------- */
function Roller({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const r = spin + A('spin') * 1080;
  return (
    <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 4}px)` }}>
      <g {...part('spin')} style={{ transform: `rotate(${r}deg)`, transformOrigin: '100px 104px', transition: A('spin') ? 'transform 2s cubic-bezier(.16,1,.3,1)' : 'none' }}>
        <circle cx="100" cy="104" r="66" fill={body} />
        <circle cx="100" cy="104" r="66" fill={`url(#${uid}-body)`} />
        {/* spokes */}
        {[0, 45, 90, 135].map((a) => (
          <rect key={a} x="96" y="46" width="8" height="116" rx="4" fill={accent} opacity=".9" transform={`rotate(${a} 100 104)`} />
        ))}
        <circle cx="100" cy="104" r="44" fill={extra} />
        <circle cx="100" cy="104" r="44" fill={`url(#${uid}-extra)`} />
        {/* orbit dots */}
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx="100" cy="70" r="6" fill={accent} transform={`rotate(${a} 100 104)`} />
        ))}
      </g>
      {/* fixed hub with eyes so the spin reads */}
      <circle cx="100" cy="104" r="26" fill={accent} />
      <circle cx="100" cy="104" r="26" fill={`url(#${uid}-accent)`} />
      <Eyes cx={100} cy={102} gap={9} r={6} look={look} />
    </g>
  );
}

/* -------------------------- PUZZLE PLANET ------------------------- */
function Planet({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const open = A('open');
  return (
    <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 4}px)` }}>
      {/* ring */}
      <g style={{ transform: `rotate(${-18 + spin * 0.15}deg)`, transformOrigin: '100px 100px' }}>
        <ellipse cx="100" cy="100" rx="88" ry="26" fill="none" stroke={accent} strokeWidth="9" opacity=".92" />
        <ellipse cx="100" cy="100" rx="88" ry="26" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="3" />
      </g>
      <g {...part('open')}>
        {/* left half — separates on click */}
        <g style={{ transform: `translateX(${-open * 26}px) rotate(${-open * 10}deg)`, transformOrigin: '100px 100px', transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)' }}>
          <path d="M100 32a68 68 0 0 0 0 136z" fill={body} />
          <path d="M100 32a68 68 0 0 0 0 136z" fill={`url(#${uid}-body)`} />
          <path d="M78 52 Q60 78 66 108" stroke={extra} strokeWidth="7" fill="none" strokeLinecap="round" opacity=".85" />
          <circle cx="62" cy="128" r="10" fill={extra} opacity=".85" />
        </g>
        {/* right half */}
        <g style={{ transform: `translateX(${open * 26}px) rotate(${open * 10}deg)`, transformOrigin: '100px 100px', transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)' }}>
          <path d="M100 32a68 68 0 0 1 0 136z" fill={body} />
          <path d="M100 32a68 68 0 0 1 0 136z" fill={`url(#${uid}-body)`} />
          <circle cx="128" cy="72" r="14" fill={accent} />
          <path d="M120 132 Q140 120 146 96" stroke={extra} strokeWidth="7" fill="none" strokeLinecap="round" opacity=".85" />
        </g>
        {/* seam */}
        <rect x="97.5" y="32" width="5" height="136" rx="2.5" fill="rgba(0,0,0,.2)" opacity={1 - open} />
      </g>
      {/* core revealed when open */}
      <circle cx="100" cy="100" r={open * 18} fill={accent} opacity={open} />
      <ellipse cx="100" cy="100" rx="88" ry="26" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="2" transform="rotate(-18 100 100)" />
    </g>
  );
}

/* --------------------------- NOISE MAKER -------------------------- */
function Noise({ uid, body, accent, extra, look, part, A }: SubProps) {
  const keys = [
    { x: 44, id: 'k0', fill: accent },
    { x: 76, id: 'k1', fill: extra },
    { x: 108, id: 'k2', fill: accent },
    { x: 140, id: 'k3', fill: extra },
  ];
  return (
    <g style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px)` }}>
      {/* horn */}
      <g {...part('horn')} style={{ transform: `scale(${1 + A('horn') * 0.12})`, transformOrigin: '150px 56px', transition: 'transform .35s cubic-bezier(.34,1.8,.44,1)' }}>
        <path d="M128 66 L166 40 L172 88 Z" fill={accent} />
        <path d="M128 66 L166 40 L172 88 Z" fill={`url(#${uid}-accent)`} />
        {A('horn') > 0 && [1, 2, 3].map((i) => (
          <path key={i} d={`M${176 + i * 8} ${58 - i * 4} q6 ${8 + i * 3} 0 ${16 + i * 6}`} stroke={accent} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity={0.9 - i * 0.22} className="toy-ping" />
        ))}
      </g>
      {/* box */}
      <g {...part('box')}>
        <rect x="30" y="62" width="112" height="86" rx="20" fill={body} />
        <rect x="30" y="62" width="112" height="86" rx="20" fill={`url(#${uid}-body)`} />
        <rect x="30" y="62" width="112" height="86" rx="20" fill={`url(#${uid}-rim)`} />
        {/* speaker grille */}
        <g opacity=".28">
          {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (
            <circle key={`${r}-${c}`} cx={48 + c * 12} cy={78 + r * 11} r="3" fill="#000" />
          )))}
        </g>
      </g>
      {/* keys */}
      {keys.map((k, i) => (
        <g key={k.id} {...part(k.id)} style={{ transform: `translateY(${A(k.id) * 6}px)`, transition: 'transform .18s ease-out' }}>
          <rect x={k.x} y={126 + i % 2 * 0} width="26" height="26" rx="9" fill="rgba(0,0,0,.22)" />
          <rect x={k.x} y={122 - A(k.id) * 0} width="26" height="26" rx="9" fill={k.fill} />
          <rect x={k.x + 4} y={126} width="18" height="6" rx="3" fill="rgba(255,255,255,.42)" />
        </g>
      ))}
      {/* handle */}
      <path d="M56 62 q30 -34 60 0" stroke={extra} strokeWidth="10" fill="none" strokeLinecap="round" />
    </g>
  );
}
