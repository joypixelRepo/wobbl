'use client';

import { Eyes, type SubProps } from './kit';

/* ============================ DINOSAURIO ========================== */
export function Dino({ uid, body, accent, extra, look, part, A }: SubProps) {
  const roar = A('roar');
  const bodyPath = 'M56 108c0-26 20-44 48-44h10c26 0 44 18 44 42 0 20-10 34-26 40l2 20c0 5-4 9-9 9h-12c-5 0-9-4-9-9v-14H92v14c0 5-4 9-9 9H71c-5 0-9-4-9-9l2-22c-5-9-8-22-8-36z';
  return (
    <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 3}px)` }}>
      {/* tail */}
      <path d="M62 130q-30 4-46-16 22 2 34-10z" fill={body} />
      <path d="M62 130q-30 4-46-16 22 2 34-10z" fill={`url(#${uid}-body)`} />

      {/* back plates */}
      {[[92, 62], [112, 54], [132, 58], [150, 72]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y + 16} L${x + 9} ${y} L${x + 18} ${y + 16} Z`} fill={accent} />
      ))}

      {/* body */}
      <g {...part('roar')}>
        <path d={bodyPath} fill={body} />
        <path d={bodyPath} fill={`url(#${uid}-body)`} />
        <path d={bodyPath} fill={`url(#${uid}-rim)`} />
        {/* belly */}
        <path d="M78 118c0-14 10-24 26-24s26 10 26 24-10 26-26 26-26-12-26-26z" fill={extra} opacity=".55" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x="84" y={110 + i * 12} width="40" height="4" rx="2" fill="rgba(0,0,0,.12)" />
        ))}
      </g>

      {/* tiny arms */}
      <path d="M136 116q14 2 16 14" stroke={body} strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d="M136 116q14 2 16 14" stroke={`url(#${uid}-rim)`} strokeWidth="11" fill="none" strokeLinecap="round" />

      {/* head */}
      <g
        {...part('head')}
        style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px) rotate(${-roar * 8}deg)`, transformOrigin: '132px 62px', transition: 'transform .5s cubic-bezier(.34,1.8,.44,1)' }}
      >
        <path d="M104 40c0-16 14-28 34-28 22 0 38 12 38 30 0 8-3 14-8 19l4 13c1 4-2 7-6 7h-52c-6 0-10-4-10-10z" fill={body} />
        <path d="M104 40c0-16 14-28 34-28 22 0 38 12 38 30 0 8-3 14-8 19l4 13c1 4-2 7-6 7h-52c-6 0-10-4-10-10z" fill={`url(#${uid}-body)`} />
        <path d="M104 40c0-16 14-28 34-28 22 0 38 12 38 30 0 8-3 14-8 19l4 13c1 4-2 7-6 7h-52c-6 0-10-4-10-10z" fill={`url(#${uid}-rim)`} />
        {/* snout + mouth */}
        <path d="M116 62h56c4 0 6 3 6 7 0 5-4 9-10 9h-46c-6 0-10-4-10-9 0-4 2-7 4-7z" fill={accent} />
        {/* teeth */}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${128 + i * 13} 71 l6 0 -3 7z`} fill="#fff" />
        ))}
        <Eyes cx={140} cy={38} gap={16} r={9} look={look} />
        {/* nostril */}
        <circle cx="170" cy="52" r="3.5" fill="rgba(0,0,0,.35)" />
        {roar > 0 && [1, 2].map((i) => (
          <path key={i} d={`M${182 + i * 9} ${48 - i * 3} q7 ${9 + i * 3} 0 ${18 + i * 5}`} stroke={accent} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity={0.8 - i * 0.25} className="toy-ping" />
        ))}
      </g>

      {/* feet */}
      <path d="M62 160h34c4 0 6 3 6 7s-3 7-7 7H62c-5 0-8-3-8-7s3-7 8-7z" fill={accent} />
      <path d="M106 160h34c5 0 8 3 8 7s-3 7-8 7h-34c-4 0-7-3-7-7s3-7 7-7z" fill={accent} />
    </g>
  );
}

/* ============================= UNICORNIO ========================== */
export function Unicorn({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const sparkle = A('sparkle');
  const barrel = 'M48 116c0-22 18-38 44-38h30c24 0 40 16 40 36 0 18-10 30-26 35l-2 13c-1 5-5 8-10 8h-8c-5 0-9-4-9-9v-10H80v10c0 5-4 9-9 9h-9c-5 0-9-4-10-9l-2-13c-1-6-2-14-2-22z';
  return (
    <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 3}px)` }}>
      {/* tail — three ribbons of mane colour */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M50 108q-${22 + i * 6} ${6 + i * 8} -${18 + i * 4} ${34 + i * 6}`}
          stroke={[accent, extra, accent][i]}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          opacity={1 - i * 0.18}
        />
      ))}

      {/* barrel */}
      <g {...part('body')}>
        <path d={barrel} fill={body} />
        <path d={barrel} fill={`url(#${uid}-body)`} />
        <path d={barrel} fill={`url(#${uid}-rim)`} />
      </g>
      {/* hooves */}
      {[68, 100, 126].map((x) => (
        <rect key={x} x={x} y="156" width="22" height="14" rx="6" fill={extra} />
      ))}

      {/* neck + head */}
      <g {...part('sparkle')} style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px) rotate(${look.x * 5}deg)`, transformOrigin: '134px 90px', transition: 'transform .4s ease-out' }}>
        <path d="M118 96c0-20 10-34 28-38l18-4c14-3 24 6 24 18 0 10-6 17-16 20l-14 4c-8 2-14 8-14 16z" fill={body} />
        <path d="M118 96c0-20 10-34 28-38l18-4c14-3 24 6 24 18 0 10-6 17-16 20l-14 4c-8 2-14 8-14 16z" fill={`url(#${uid}-rim)`} />
        {/* muzzle */}
        <ellipse cx="176" cy="70" rx="17" ry="14" fill={body} />
        <ellipse cx="176" cy="70" rx="17" ry="14" fill={`url(#${uid}-body)`} />
        <circle cx="182" cy="68" r="3.5" fill="rgba(0,0,0,.3)" />
        {/* ear */}
        <path d="M146 44 L152 24 L162 42 Z" fill={body} />
        <path d="M149 42 L153 30 L158 41 Z" fill={extra} opacity=".7" />
        {/* horn */}
        <g style={{ transformOrigin: '166px 30px' }}>
          <path d="M166 8 L176 40 L156 40 Z" fill={accent} />
          <path d="M166 8 L176 40 L156 40 Z" fill={`url(#${uid}-accent)`} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${159 + i * 1.5} ${34 - i * 9} h${16 - i * 4}`} stroke="rgba(255,255,255,.55)" strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </g>
        <Eyes cx={150} cy={70} gap={0} r={8} look={look} />
        {/* mane */}
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${128 + i * 8} ${96 - i * 18}q-14 ${8 + i * 2} -6 ${20 + i * 2}`}
            stroke={[accent, extra, accent, extra][i]}
            strokeWidth="13"
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* sparkles that turn with the toy */}
      {[[40, 60], [172, 128], [66, 40]].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 8} l3 6 6 2 -6 2 -3 7 -3-7 -6-2 6-2z`}
          fill={accent}
          opacity={sparkle ? 1 : 0.55 + 0.45 * Math.abs(Math.sin((spin + i * 90) * Math.PI / 180))}
        />
      ))}
    </g>
  );
}

/* ============================== DRAGÓN ============================ *
 * Las alas se dibujan las primeras y salen por fuera de la silueta a
 * ambos lados: si quedan detrás del cuerpo, el dragón se lee como un
 * pájaro gordo.
 * ------------------------------------------------------------------ */
export function Dragon({ uid, body, accent, extra, look, part, A }: SubProps) {
  const fire = A('fire');
  const torso = 'M62 130c0-28 20-48 46-48h8c26 0 44 18 44 42 0 20-12 34-30 40l1 8c0 5-4 8-9 8h-9c-5 0-9-3-9-8v-6H96v6c0 5-4 8-9 8h-9c-5 0-9-3-9-8l1-10c-5-9-8-19-8-32z';
  const wing = 'M0 0 L-46 -34 L-26 -30 L-34 -50 L-8 -32 L-2 -54 L10 -28 L26 -40 L18 -16 Z';
  return (
    <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 3}px)` }}>
      {/* wings, well clear of the body on both sides */}
      <g className="toy-bob" style={{ transformOrigin: '100px 90px' }}>
        <g transform="translate(72 96)">
          <path d={wing} fill={accent} />
          <path d={wing} fill={`url(#${uid}-accent)`} />
          <path d={wing} fill="none" stroke="rgba(0,0,0,.16)" strokeWidth="3" strokeLinejoin="round" />
        </g>
        <g transform="translate(128 96) scale(-1 1)">
          <path d={wing} fill={accent} opacity=".92" />
          <path d={wing} fill={`url(#${uid}-accent)`} />
          <path d={wing} fill="none" stroke="rgba(0,0,0,.16)" strokeWidth="3" strokeLinejoin="round" />
        </g>
      </g>

      {/* tail with an arrow tip */}
      <path d="M66 140q-34 2-46-20 22 6 36-8z" fill={body} />
      <path d="M66 140q-34 2-46-20 22 6 36-8z" fill={`url(#${uid}-body)`} />
      <path d="M24 118 L6 104 L14 132 Z" fill={accent} />

      {/* torso */}
      <g {...part('body')}>
        <path d={torso} fill={body} />
        <path d={torso} fill={`url(#${uid}-body)`} />
        <path d={torso} fill={`url(#${uid}-rim)`} />
        {/* belly plates */}
        <path d="M84 136c0-14 11-24 24-24s24 10 24 24-11 24-24 24-24-10-24-24z" fill={extra} opacity=".5" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x="90" y={124 + i * 13} width="36" height="4" rx="2" fill="rgba(0,0,0,.12)" />
        ))}
      </g>

      {/* spine spikes */}
      {[[78, 86], [94, 76], [112, 74], [130, 84]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y + 14} L${x + 8} ${y} L${x + 16} ${y + 14} Z`} fill={accent} opacity=".9" />
      ))}

      {/* head */}
      <g {...part('fire')} style={{ transform: `rotate(${fire * -6}deg)`, transformOrigin: '116px 56px', transition: 'transform .4s cubic-bezier(.34,1.8,.44,1)' }}>
        <path d="M84 48c0-18 16-32 38-32 20 0 36 12 36 28 0 9-4 16-10 20l3 10c1 4-2 7-6 7H96c-7 0-12-5-12-11z" fill={body} />
        <path d="M84 48c0-18 16-32 38-32 20 0 36 12 36 28 0 9-4 16-10 20l3 10c1 4-2 7-6 7H96c-7 0-12-5-12-11z" fill={`url(#${uid}-body)`} />
        <path d="M84 48c0-18 16-32 38-32 20 0 36 12 36 28 0 9-4 16-10 20l3 10c1 4-2 7-6 7H96c-7 0-12-5-12-11z" fill={`url(#${uid}-rim)`} />
        {/* horns */}
        <path d="M100 20 L90 2 L112 14 Z" fill={accent} />
        <path d="M142 18 L152 2 L154 22 Z" fill={accent} />
        {/* snout */}
        <path d="M104 60h52c4 0 7 3 7 7 0 5-4 9-10 9h-44c-6 0-10-4-10-8s2-8 5-8z" fill={accent} />
        <path d="M104 60h52c4 0 7 3 7 7 0 5-4 9-10 9h-44c-6 0-10-4-10-8s2-8 5-8z" fill={`url(#${uid}-accent)`} />
        {/* nostril + teeth */}
        <circle cx="152" cy="50" r="4" fill="rgba(0,0,0,.32)" />
        {[0, 1, 2].map((i) => <path key={i} d={`M${118 + i * 14} 74 l6 0 -3 7z`} fill="#fff" />)}
        <Eyes cx={120} cy={40} gap={17} r={9} look={look} />
        {/* flame */}
        <g opacity={0.4 + fire * 0.6}>
          <path d="M164 68q26 2 34 16-18 2-28 12 3-16-6-28z" fill={accent} className="toy-bob" />
          <path d="M169 73q14 2 19 9-11 1-15 7z" fill={extra} />
        </g>
      </g>

      {/* feet */}
      <path d="M64 160h38c5 0 8 3 8 7s-3 7-8 7H64c-5 0-8-3-8-7s3-7 8-7z" fill={accent} />
      <path d="M110 160h36c5 0 8 3 8 7s-3 7-8 7h-36c-5 0-8-3-8-7s3-7 8-7z" fill={accent} />
    </g>
  );
}

/* =========================== OSO DE PELUCHE ======================= */
export function Bear({ uid, body, accent, extra, look, part, A }: SubProps) {
  const hug = A('hug');
  return (
    <g
      {...part('hug')}
      className="toy-wobble"
      style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px) scale(${1 + hug * 0.06}, ${1 - hug * 0.08})`, transformOrigin: '100px 172px', transition: 'transform .5s cubic-bezier(.34,1.8,.44,1)' }}
    >
      {/* legs */}
      <ellipse cx="70" cy="158" rx="24" ry="19" fill={body} />
      <ellipse cx="130" cy="158" rx="24" ry="19" fill={body} />
      <ellipse cx="70" cy="160" rx="13" ry="10" fill={extra} />
      <ellipse cx="130" cy="160" rx="13" ry="10" fill={extra} />

      {/* arms */}
      <ellipse cx="44" cy="112" rx="17" ry="22" fill={body} transform={`rotate(${-18 - hug * 18} 44 112)`} />
      <ellipse cx="156" cy="112" rx="17" ry="22" fill={body} transform={`rotate(${18 + hug * 18} 156 112)`} />

      {/* belly */}
      <ellipse cx="100" cy="126" rx="44" ry="40" fill={body} />
      <ellipse cx="100" cy="126" rx="44" ry="40" fill={`url(#${uid}-body)`} />
      <ellipse cx="100" cy="130" rx="27" ry="24" fill={extra} opacity=".6" />

      {/* ears */}
      <circle cx="64" cy="50" r="20" fill={body} />
      <circle cx="136" cy="50" r="20" fill={body} />
      <circle cx="64" cy="50" r="10" fill={extra} opacity=".75" />
      <circle cx="136" cy="50" r="10" fill={extra} opacity=".75" />

      {/* head */}
      <ellipse cx="100" cy="70" rx="48" ry="42" fill={body} />
      <ellipse cx="100" cy="70" rx="48" ry="42" fill={`url(#${uid}-body)`} />
      <ellipse cx="100" cy="70" rx="48" ry="42" fill={`url(#${uid}-rim)`} />

      {/* muzzle */}
      <ellipse cx="100" cy="86" rx="24" ry="18" fill={extra} />
      <ellipse cx="100" cy="86" rx="24" ry="18" fill={`url(#${uid}-extra)`} />
      <path d="M92 80h16c3 0 5 2 5 5s-3 6-8 6h-10c-5 0-8-3-8-6s2-5 5-5z" fill={accent} />
      <path d="M100 91v7" stroke="#100C14" strokeWidth="3" strokeLinecap="round" opacity=".55" />
      <path d="M100 98q-7 6-12 0M100 98q7 6 12 0" stroke="#100C14" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".55" />

      <Eyes cx={100} cy={64} gap={22} r={9} look={look} />

      {/* stitching + bow, the giveaway that it is sewn, not moulded */}
      <path d="M62 118q8 -6 16 0" stroke="rgba(0,0,0,.18)" strokeWidth="2.5" fill="none" strokeDasharray="5 5" />
      <path d="M122 118q8 -6 16 0" stroke="rgba(0,0,0,.18)" strokeWidth="2.5" fill="none" strokeDasharray="5 5" />
      <g transform="translate(100 104)">
        <path d="M0 0 L-18 -9 L-18 9 Z" fill={accent} />
        <path d="M0 0 L18 -9 L18 9 Z" fill={accent} />
        <circle cx="0" cy="0" r="6" fill={accent} />
        <circle cx="0" cy="0" r="6" fill={`url(#${uid}-accent)`} />
      </g>
    </g>
  );
}
