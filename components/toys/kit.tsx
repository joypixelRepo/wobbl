'use client';

/* ------------------------------------------------------------------ *
 * The shared material kit. Every toy in the catalogue is drawn with
 * these same three gradients, the same rim light and the same ground
 * shadow, so twenty-six different objects still read as one product
 * family: soft key light from the top left, warm bounce underneath,
 * a tight specular dot on anything curved.
 * ------------------------------------------------------------------ */

export type SubProps = {
  uid: string; body: string; accent: string; extra: string;
  look: { x: number; y: number };
  part: (id: string) => Record<string, unknown>;
  A: (id: string) => number;
  spin?: number;
};

export function Materials({ uid, body, accent, extra }: { uid: string; body: string; accent: string; extra: string }) {
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

export const Gloss = ({ uid, d, on = 'body' }: { uid: string; d: string; on?: string }) => (
  <path d={d} fill={`url(#${uid}-${on})`} style={{ pointerEvents: 'none' }} />
);

/** Eyes that track the pointer — used by every character-shaped toy. */
export function Eyes({
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

/** A moulded wheel. Every vehicle in the catalogue rolls on these. */
export function Wheel({
  uid, cx, cy, r, hub, roll = 0, smooth = false,
}: { uid: string; cx: number; cy: number; r: number; hub: string; roll?: number; smooth?: boolean }) {
  return (
    <g style={{ transform: `rotate(${roll}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: smooth ? 'transform 1.4s cubic-bezier(.2,.8,.2,1)' : 'none' }}>
      <circle cx={cx} cy={cy} r={r} fill="#100C14" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill={hub} />
      <circle cx={cx} cy={cy} r={r * 0.55} fill={`url(#${uid}-accent)`} />
      {[0, 60, 120].map((a) => (
        <rect key={a} x={cx - r * 0.075} y={cy - r * 0.58} width={r * 0.15} height={r * 1.16} rx={r * 0.075} fill="rgba(0,0,0,.35)" transform={`rotate(${a} ${cx} ${cy})`} />
      ))}
      <circle cx={cx - r * 0.3} cy={cy - r * 0.34} r={r * 0.12} fill="#fff" opacity=".35" />
    </g>
  );
}

/** A repeated stud strip — the giveaway that something is moulded plastic. */
export function Studs({ x, y, n, gap, rx = 9, ry = 4 }: { x: number; y: number; n: number; gap: number; rx?: number; ry?: number }) {
  return (
    <g opacity=".16">
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={i} cx={x + i * gap} cy={y} rx={rx} ry={ry} fill="#000" />
      ))}
    </g>
  );
}
