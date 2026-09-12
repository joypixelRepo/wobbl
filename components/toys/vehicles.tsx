'use client';

import { Eyes, Wheel, Studs, type SubProps } from './kit';

/* ============================ AVIONETA ============================ *
 * Fuselaje de una sola pieza, morro a la izquierda y cola pegada al
 * cuerpo: cada añadido tiene que solaparse con la silueta o se lee
 * como una pieza suelta flotando.
 * ------------------------------------------------------------------ */
export function Plane({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const prop = spin * 6 + A('prop') * 1440;
  return (
    <g style={{ transform: `translate(${look.x * 6}px, ${look.y * 4}px) rotate(${look.x * 3}deg)`, transformOrigin: '100px 110px' }}>
      {/* tail fin, rooted in the fuselage */}
      <path d="M138 104 L160 44 L178 46 L176 110 Z" fill={accent} />
      <path d="M138 104 L160 44 L178 46 L176 110 Z" fill={`url(#${uid}-accent)`} />
      <path d="M160 96 L196 90 L196 104 L162 106 Z" fill={accent} opacity=".75" />

      {/* fuselage */}
      <g {...part('shell')}>
        <path d="M46 108c0-16 14-26 34-26h74c16 0 26 10 26 24 0 16-10 26-28 26H74c-16 0-28-10-28-24z" fill={body} />
        <path d="M46 108c0-16 14-26 34-26h74c16 0 26 10 26 24 0 16-10 26-28 26H74c-16 0-28-10-28-24z" fill={`url(#${uid}-body)`} />
        <path d="M46 108c0-16 14-26 34-26h74c16 0 26 10 26 24 0 16-10 26-28 26H74c-16 0-28-10-28-24z" fill={`url(#${uid}-rim)`} />
      </g>
      {/* nose cone */}
      <path d="M46 108c0-14 10-24 24-26v52c-14-2-24-12-24-26z" fill={accent} />
      <path d="M46 108c0-14 10-24 24-26v52c-14-2-24-12-24-26z" fill={`url(#${uid}-accent)`} />

      {/* canopy, overlapping the fuselage */}
      <path d="M82 84c5-16 17-25 31-25s23 9 26 25z" fill={extra} />
      <path d="M82 84c5-16 17-25 31-25s23 9 26 25z" fill={`url(#${uid}-rim)`} />
      <path d="M82 84c5-16 17-25 31-25s23 9 26 25z" fill="none" stroke="rgba(0,0,0,.24)" strokeWidth="3" />
      <Eyes cx={111} cy={72} gap={12} r={7} look={look} />

      {/* wing, swept and sticking out past the body on both sides */}
      <path d="M22 128h158c8 0 12 5 12 11s-4 11-12 11H22c-9 0-15-5-15-11s6-11 15-11z" fill={accent} />
      <path d="M22 132h158v5H22z" fill="rgba(255,255,255,.45)" />
      <Studs x={46} y={130} n={7} gap={20} rx={7} ry={3} />

      {/* propeller, right on the nose */}
      <g style={{ transform: `rotate(${prop}deg)`, transformOrigin: '40px 108px', transition: A('prop') ? 'transform 1.6s cubic-bezier(.15,.9,.2,1)' : 'none' }} {...part('prop')}>
        <rect x="33" y="66" width="14" height="84" rx="7" fill="#100C14" opacity=".78" />
        <rect x="36" y="70" width="5" height="76" rx="2.5" fill="rgba(255,255,255,.32)" />
      </g>
      <circle cx="40" cy="108" r="11" fill={body} />
      <circle cx="40" cy="108" r="11" fill={`url(#${uid}-body)`} />
      <circle cx="37" cy="104" r="3.5" fill="#fff" opacity=".6" />

      {/* landing gear */}
      <rect x="72" y="148" width="8" height="12" rx="4" fill="#100C14" />
      <rect x="128" y="148" width="8" height="12" rx="4" fill="#100C14" />
      <Wheel uid={uid} cx={76} cy={166} r={13} hub={body} roll={spin * 2} />
      <Wheel uid={uid} cx={132} cy={166} r={13} hub={body} roll={spin * 2} />
    </g>
  );
}

/* ============================= COHETE ============================= */
export function Rocket({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const lift = A('launch');
  return (
    <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 4 - lift * 26}px) rotate(${look.x * 4}deg)`, transformOrigin: '100px 150px', transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)' }}>
      {/* exhaust */}
      <g style={{ transformOrigin: '100px 158px' }}>
        <path d="M86 158q14 34 14 34t14-34z" fill={accent} opacity={0.5 + lift * 0.5} className="toy-bob" />
        <path d="M93 158q7 24 7 24t7-24z" fill={extra} opacity=".9" />
      </g>

      {/* fins */}
      <path d="M66 112 L40 162 L70 156 Z" fill={accent} />
      <path d="M134 112 L160 162 L130 156 Z" fill={accent} />
      <path d="M66 112 L40 162 L70 156 Z" fill={`url(#${uid}-accent)`} />

      {/* hull */}
      <g {...part('launch')}>
        <path d="M100 10c20 22 30 52 30 84v46a10 10 0 0 1-10 10H80a10 10 0 0 1-10-10v-46c0-32 10-62 30-84z" fill={body} />
        <path d="M100 10c20 22 30 52 30 84v46a10 10 0 0 1-10 10H80a10 10 0 0 1-10-10v-46c0-32 10-62 30-84z" fill={`url(#${uid}-body)`} />
        <path d="M100 10c20 22 30 52 30 84v46a10 10 0 0 1-10 10H80a10 10 0 0 1-10-10v-46c0-32 10-62 30-84z" fill={`url(#${uid}-rim)`} />
      </g>

      {/* nose cap */}
      <path d="M100 10c11 12 19 27 24 44H76c5-17 13-32 24-44z" fill={accent} />
      <path d="M100 10c11 12 19 27 24 44H76c5-17 13-32 24-44z" fill={`url(#${uid}-accent)`} />

      {/* porthole, with a friendly pilot inside */}
      <circle cx="100" cy="86" r="24" fill={extra} />
      <circle cx="100" cy="86" r="24" fill={`url(#${uid}-extra)`} />
      <circle cx="100" cy="86" r="24" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="3" />
      <Eyes cx={100} cy={84} gap={9} r={7} look={look} />
      <path d="M84 70 q10 -8 20 -4" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".45" />

      {/* rivet band */}
      <rect x="72" y="128" width="56" height="9" rx="4.5" fill={accent} />
      <Studs x={80} y={132} n={5} gap={10} rx={3} ry={3} />

      {/* a star that turns with the toy */}
      <path d="M100 148 l4 9 10 1 -7 7 2 10 -9-5 -9 5 2-10 -7-7 10-1z" fill={accent} opacity=".9" transform={`rotate(${spin * 0.4} 100 155)`} />
    </g>
  );
}

/* =========================== EXCAVADORA =========================== *
 * El brazo es un solo polígono continuo desde el pivote hasta la
 * cuchara: en dos rectángulos girados se leía como palos sueltos.
 * ------------------------------------------------------------------ */
export function Digger({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const dig = A('dig');
  return (
    <g style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px)` }}>
      {/* boom + bucket — swings down when poked */}
      <g {...part('dig')} style={{ transform: `rotate(${-4 + dig * 20}deg)`, transformOrigin: '100px 98px', transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)' }}>
        {/* one continuous arm: pivot -> elbow -> wrist */}
        <path
          d="M96 106 L122 48 a11 11 0 0 1 20 8 L124 98 L152 92 a10 10 0 0 1 6 19 L114 124 a11 11 0 0 1-18-18z"
          fill={body}
        />
        <path
          d="M96 106 L122 48 a11 11 0 0 1 20 8 L124 98 L152 92 a10 10 0 0 1 6 19 L114 124 a11 11 0 0 1-18-18z"
          fill={`url(#${uid}-rim)`}
        />
        <path
          d="M96 106 L122 48 a11 11 0 0 1 20 8 L124 98 L152 92 a10 10 0 0 1 6 19 L114 124 a11 11 0 0 1-18-18z"
          fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="3" strokeLinejoin="round"
        />
        {/* bucket, hanging off the wrist */}
        <path d="M144 100h34c5 0 8 4 6 9l-7 22c-2 5-6 8-11 8h-16c-6 0-11-4-11-10z" fill={accent} />
        <path d="M144 100h34c5 0 8 4 6 9l-7 22c-2 5-6 8-11 8h-16c-6 0-11-4-11-10z" fill={`url(#${uid}-accent)`} />
        <path d="M144 100h34c5 0 8 4 6 9l-7 22c-2 5-6 8-11 8h-16c-6 0-11-4-11-10z" fill="none" stroke="rgba(0,0,0,.26)" strokeWidth="3" strokeLinejoin="round" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${150 + i * 11} 138 l7 0 -3 9z`} fill="#100C14" opacity=".55" />
        ))}
        {/* pivots, in body colour so they never vanish into a dark accent */}
        <circle cx="100" cy="104" r="9" fill={body} />
        <circle cx="100" cy="104" r="4" fill="rgba(0,0,0,.3)" />
        <circle cx="132" cy="56" r="7" fill={body} />
      </g>

      {/* cab */}
      <g {...part('cab')}>
        <rect x="22" y="58" width="72" height="64" rx="18" fill={body} />
        <rect x="22" y="58" width="72" height="64" rx="18" fill={`url(#${uid}-body)`} />
        <rect x="22" y="58" width="72" height="64" rx="18" fill={`url(#${uid}-rim)`} />
        <rect x="32" y="68" width="52" height="38" rx="14" fill={extra} />
        <rect x="32" y="68" width="52" height="38" rx="14" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="3" />
        <Eyes cx={58} cy={87} gap={13} r={8} look={look} />
        {/* beacon */}
        <rect x="50" y="46" width="16" height="14" rx="6" fill={accent} className="toy-bob" />
      </g>
      {/* turntable */}
      <rect x="18" y="118" width="98" height="14" rx="7" fill={accent} />
      <rect x="18" y="120" width="98" height="4" rx="2" fill="rgba(255,255,255,.3)" />

      {/* track: a closed loop with the drive wheels showing through */}
      <g>
        <path d="M42 132h76c15 0 27 9 27 19s-12 19-27 19H42c-15 0-27-9-27-19s12-19 27-19z" fill="#100C14" />
        <path d="M42 132h76c15 0 27 9 27 19s-12 19-27 19H42c-15 0-27-9-27-19s12-19 27-19z" fill={`url(#${uid}-rim)`} opacity=".3" />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={24 + ((i * 17 + spin * 0.4) % 118)} y="134" width="7" height="34" rx="3" fill="rgba(255,255,255,.26)" />
        ))}
        <circle cx="42" cy="151" r="13" fill={body} />
        <circle cx="42" cy="151" r="13" fill={`url(#${uid}-body)`} />
        <circle cx="118" cy="151" r="13" fill={body} />
        <circle cx="118" cy="151" r="13" fill={`url(#${uid}-body)`} />
        <circle cx="80" cy="158" r="8" fill={body} opacity=".9" />
      </g>
    </g>
  );
}

/* ========================= TREN DE VAPOR ========================== */
export function Train({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const roll = spin + A('wheel') * 720;
  const puff = A('whistle');
  return (
    <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 3}px)` }}>
      {/* smoke */}
      <g opacity={0.55 + puff * 0.45}>
        <circle cx="52" cy="44" r="11" fill={extra} className="toy-bob" opacity=".8" />
        <circle cx="38" cy="26" r="8" fill={extra} opacity=".55" />
        <circle cx="62" cy="22" r="6" fill={extra} opacity=".4" />
      </g>

      {/* chimney */}
      <g {...part('whistle')}>
        <path d="M42 58h22l4 22H38z" fill={accent} />
        <rect x="36" y="54" width="34" height="10" rx="5" fill={accent} />
        <rect x="36" y="54" width="34" height="4" rx="2" fill="rgba(255,255,255,.4)" />
      </g>

      {/* boiler */}
      <g {...part('shell')}>
        <rect x="26" y="80" width="104" height="50" rx="25" fill={body} />
        <rect x="26" y="80" width="104" height="50" rx="25" fill={`url(#${uid}-body)`} />
        <rect x="26" y="80" width="104" height="50" rx="25" fill={`url(#${uid}-rim)`} />
        <circle cx="34" cy="105" r="18" fill={accent} />
        <circle cx="34" cy="105" r="18" fill={`url(#${uid}-accent)`} />
        <circle cx="34" cy="105" r="8" fill={extra} />
        {/* boiler bands */}
        <rect x="70" y="80" width="6" height="50" fill="rgba(0,0,0,.14)" />
        <rect x="100" y="80" width="6" height="50" fill="rgba(0,0,0,.14)" />
      </g>

      {/* cab */}
      <g>
        <path d="M124 62h44c6 0 10 4 10 10v58h-64V72c0-6 4-10 10-10z" fill={accent} />
        <path d="M124 62h44c6 0 10 4 10 10v58h-64V72c0-6 4-10 10-10z" fill={`url(#${uid}-accent)`} />
        <rect x="126" y="74" width="46" height="30" rx="10" fill={extra} opacity=".92" />
        <Eyes cx={149} cy={89} gap={12} r={7} look={look} />
        <rect x="114" y="56" width="74" height="10" rx="5" fill={body} />
      </g>

      {/* chassis + cow-catcher */}
      <path d="M22 130h162v14H22z" fill="#100C14" opacity=".85" />
      <path d="M24 132 L10 162 h24 z" fill={accent} />

      {/* wheels: two small up front, one big driver */}
      <g {...part('wheel')}>
        <Wheel uid={uid} cx={48} cy={152} r={19} hub={accent} roll={roll} smooth={!!A('wheel')} />
        <Wheel uid={uid} cx={100} cy={152} r={14} hub={accent} roll={roll * 1.3} smooth={!!A('wheel')} />
        <Wheel uid={uid} cx={152} cy={152} r={19} hub={accent} roll={roll} smooth={!!A('wheel')} />
      </g>
      {/* coupling rod */}
      <rect x="44" y="150" width="112" height="5" rx="2.5" fill={extra} opacity=".8" transform={`rotate(${Math.sin((roll * Math.PI) / 180) * 2} 100 152)`} />
    </g>
  );
}

/* ========================== NAVE ESPACIAL ========================= */
export function Ufo({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const beam = A('beam');
  return (
    <g style={{ transform: `translate(${look.x * 7}px, ${look.y * 5}px)` }} className="toy-bob">
      {/* tractor beam */}
      <path d="M74 132 L46 186 h108 L126 132 z" fill={accent} opacity={0.18 + beam * 0.4} />
      <path d="M86 132 L70 186 h60 L114 132 z" fill={extra} opacity={0.12 + beam * 0.3} />

      {/* saucer */}
      <g {...part('beam')}>
        <ellipse cx="100" cy="124" rx="88" ry="26" fill={body} />
        <ellipse cx="100" cy="124" rx="88" ry="26" fill={`url(#${uid}-body)`} />
        <ellipse cx="100" cy="118" rx="88" ry="26" fill={accent} />
        <ellipse cx="100" cy="118" rx="88" ry="26" fill={`url(#${uid}-accent)`} />
        <ellipse cx="100" cy="118" rx="88" ry="26" fill={`url(#${uid}-rim)`} />
      </g>

      {/* running lights */}
      {[-66, -40, -14, 14, 40, 66].map((dx, i) => (
        <circle
          key={dx}
          cx={100 + dx}
          cy={124 + Math.abs(dx) * 0.06}
          r="7"
          fill={extra}
          opacity={0.55 + 0.45 * Math.abs(Math.sin((spin + i * 60) * Math.PI / 180))}
        />
      ))}

      {/* dome */}
      <path d="M58 106a42 38 0 0 1 84 0z" fill={extra} />
      <path d="M58 106a42 38 0 0 1 84 0z" fill={`url(#${uid}-rim)`} />
      <path d="M58 106a42 38 0 0 1 84 0z" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="3" />
      <ellipse cx="76" cy="86" rx="10" ry="6" fill="#fff" opacity=".5" transform="rotate(-22 76 86)" />
      <Eyes cx={100} cy={88} gap={14} r={9} look={look} />
      {/* antenna */}
      <rect x="97" y="52" width="6" height="18" rx="3" fill={accent} />
      <circle cx="100" cy="50" r="8" fill={accent} className="toy-bob" />
    </g>
  );
}

/* ====================== CAMIÓN DE BOMBEROS ======================== */
export function Firetruck({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const roll = spin + A('wheel') * 720;
  const siren = A('siren');
  return (
    <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 3}px)` }}>
      {/* ladder — raises when poked */}
      <g {...part('siren')} style={{ transform: `rotate(${-8 - siren * 26}deg)`, transformOrigin: '150px 92px', transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)' }}>
        <rect x="58" y="80" width="104" height="14" rx="7" fill={extra} />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={66 + i * 14} y="80" width="5" height="14" rx="2" fill="rgba(0,0,0,.28)" />
        ))}
        <rect x="58" y="80" width="104" height="5" rx="2.5" fill="rgba(255,255,255,.4)" />
      </g>

      {/* body */}
      <g {...part('shell')}>
        <path d="M18 104h132c8 0 14 6 14 14v28c0 7-5 12-12 12H20c-7 0-12-5-12-12v-30c0-7 5-12 10-12z" fill={body} />
        <path d="M18 104h132c8 0 14 6 14 14v28c0 7-5 12-12 12H20c-7 0-12-5-12-12v-30c0-7 5-12 10-12z" fill={`url(#${uid}-body)`} />
        <path d="M18 104h132c8 0 14 6 14 14v28c0 7-5 12-12 12H20c-7 0-12-5-12-12v-30c0-7 5-12 10-12z" fill={`url(#${uid}-rim)`} />
        {/* side lockers */}
        <rect x="30" y="118" width="30" height="22" rx="7" fill="rgba(0,0,0,.16)" />
        <rect x="68" y="118" width="30" height="22" rx="7" fill="rgba(0,0,0,.16)" />
        {/* hose reel */}
        <circle cx="120" cy="129" r="14" fill={accent} />
        <circle cx="120" cy="129" r="6" fill={extra} />
      </g>

      {/* cab */}
      <g>
        <path d="M126 70h34c10 0 18 8 18 18v22h-56V80c0-6 4-10 4-10z" fill={accent} />
        <path d="M126 70h34c10 0 18 8 18 18v22h-56V80c0-6 4-10 4-10z" fill={`url(#${uid}-accent)`} />
        <rect x="132" y="78" width="40" height="24" rx="9" fill={extra} opacity=".92" />
        <Eyes cx={152} cy={90} gap={11} r={6} look={look} />
      </g>

      {/* light bar */}
      <g>
        <rect x="130" y="60" width="38" height="10" rx="5" fill={extra} />
        <circle cx="140" cy="65" r="5" fill={accent} opacity={0.4 + 0.6 * Math.abs(Math.sin(spin * Math.PI / 180))} />
        <circle cx="158" cy="65" r="5" fill={accent} opacity={0.4 + 0.6 * Math.abs(Math.cos(spin * Math.PI / 180))} />
        {siren > 0 && <circle cx="149" cy="65" r="22" fill="none" stroke={accent} strokeWidth="3" opacity=".5" className="toy-ping" />}
      </g>

      <g {...part('wheel')}>
        <Wheel uid={uid} cx={48} cy={158} r={21} hub={accent} roll={roll} smooth={!!A('wheel')} />
        <Wheel uid={uid} cx={144} cy={158} r={21} hub={accent} roll={roll} smooth={!!A('wheel')} />
      </g>
    </g>
  );
}

/* ============================ TRACTOR ============================= */
export function Tractor({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const roll = spin + A('wheel') * 720;
  return (
    <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 3}px)` }}>
      {/* exhaust puffs */}
      <circle cx="62" cy="44" r="8" fill={extra} opacity=".45" className="toy-bob" />
      <circle cx="54" cy="28" r="5" fill={extra} opacity=".3" />
      <rect x="56" y="52" width="12" height="34" rx="6" fill="#100C14" opacity=".8" />

      {/* bonnet */}
      <g {...part('shell')}>
        <path d="M34 96h62v40H30c-6 0-10-4-10-10v-18c0-7 6-12 14-12z" fill={body} />
        <path d="M34 96h62v40H30c-6 0-10-4-10-10v-18c0-7 6-12 14-12z" fill={`url(#${uid}-body)`} />
        <path d="M34 96h62v40H30c-6 0-10-4-10-10v-18c0-7 6-12 14-12z" fill={`url(#${uid}-rim)`} />
        <rect x="20" y="106" width="10" height="22" rx="5" fill={accent} />
        <circle cx="34" cy="112" r="7" fill={accent} />
      </g>

      {/* cab */}
      <g>
        <path d="M96 58h46c8 0 14 6 14 14v64H92V72c0-8 4-14 4-14z" fill={accent} />
        <path d="M96 58h46c8 0 14 6 14 14v64H92V72c0-8 4-14 4-14z" fill={`url(#${uid}-accent)`} />
        <rect x="100" y="68" width="48" height="34" rx="12" fill={extra} opacity=".92" />
        <Eyes cx={124} cy={85} gap={12} r={7} look={look} />
        <rect x="88" y="52" width="76" height="10" rx="5" fill={body} />
      </g>

      {/* wheels: little in front, enormous behind */}
      <g {...part('wheel')}>
        <Wheel uid={uid} cx={44} cy={148} r={22} hub={accent} roll={roll * 1.6} smooth={!!A('wheel')} />
        <Wheel uid={uid} cx={134} cy={134} r={40} hub={accent} roll={roll} smooth={!!A('wheel')} />
      </g>
      {/* tread on the big wheel */}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x="132" y="92" width="5" height="12" rx="2" fill="rgba(255,255,255,.18)" transform={`rotate(${i * 45 + roll} 134 134)`} />
      ))}
    </g>
  );
}

/* =========================== REMOLCADOR =========================== */
export function Boat({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const rock = Math.sin(spin * 0.03) * 3;
  return (
    <g style={{ transform: `translate(${look.x * 6}px, ${look.y * 4}px) rotate(${rock + look.x * 3}deg)`, transformOrigin: '100px 150px' }}>
      {/* smoke */}
      <circle cx="118" cy="42" r="9" fill={extra} opacity=".45" className="toy-bob" />
      <circle cx="106" cy="26" r="6" fill={extra} opacity=".3" />

      {/* mast + flag */}
      <rect x="54" y="46" width="6" height="46" rx="3" fill="#100C14" opacity=".7" />
      <path d="M60 48 L88 56 L60 66 Z" fill={accent} />

      {/* funnel */}
      <g {...part('horn')}>
        <rect x="104" y="52" width="28" height="40" rx="9" fill={accent} />
        <rect x="104" y="52" width="28" height="40" rx="9" fill={`url(#${uid}-accent)`} />
        <rect x="104" y="62" width="28" height="10" fill={extra} />
      </g>

      {/* wheelhouse */}
      <g>
        <rect x="62" y="88" width="72" height="36" rx="12" fill={extra} />
        <rect x="62" y="88" width="72" height="36" rx="12" fill={`url(#${uid}-extra)`} />
        <rect x="72" y="96" width="52" height="22" rx="9" fill={accent} opacity=".85" />
        <Eyes cx={98} cy={107} gap={13} r={7} look={look} />
      </g>

      {/* hull */}
      <g {...part('shell')}>
        <path d="M22 124h156l-16 38c-3 7-10 12-18 12H56c-8 0-15-5-18-12z" fill={body} />
        <path d="M22 124h156l-16 38c-3 7-10 12-18 12H56c-8 0-15-5-18-12z" fill={`url(#${uid}-body)`} />
        <path d="M22 124h156l-16 38c-3 7-10 12-18 12H56c-8 0-15-5-18-12z" fill={`url(#${uid}-rim)`} />
        <rect x="26" y="128" width="148" height="9" rx="4.5" fill={accent} />
        {/* portholes */}
        {[58, 88, 118, 148].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="152" r="9" fill={extra} />
            <circle cx={cx} cy="152" r="9" fill="none" stroke="rgba(0,0,0,.2)" strokeWidth="2.5" />
          </g>
        ))}
      </g>
      {/* fenders */}
      <circle cx="20" cy="140" r="9" fill="#100C14" opacity=".55" />
      <circle cx="180" cy="140" r="9" fill="#100C14" opacity=".55" />
    </g>
  );
}

/* =========================== HELICÓPTERO ========================== *
 * El rotor se pinta en tinta, no en `extra`: es la pieza más larga del
 * dibujo y sobre el fondo de su propia caja (que usa `extra`) se
 * volvía invisible.
 * ------------------------------------------------------------------ */
export function Heli({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const rotor = spin * 8 + A('rotor') * 2160;
  return (
    <g style={{ transform: `translate(${look.x * 7}px, ${look.y * 5}px) rotate(${look.x * 3}deg)`, transformOrigin: '100px 110px' }} className="toy-bob">
      {/* tail boom */}
      <path d="M116 104h48c7 0 12 5 12 11s-5 11-12 11h-48z" fill={body} />
      <path d="M116 104h48c7 0 12 5 12 11s-5 11-12 11h-48z" fill={`url(#${uid}-rim)`} />
      <path d="M158 80 L182 86 L178 124 L160 120 Z" fill={accent} />
      <path d="M158 80 L182 86 L178 124 L160 120 Z" fill={`url(#${uid}-accent)`} />
      {/* tail rotor */}
      <g style={{ transform: `rotate(${-rotor * 1.5}deg)`, transformOrigin: '172px 102px' }}>
        <rect x="167" y="70" width="10" height="64" rx="5" fill="#100C14" opacity=".75" />
      </g>
      <circle cx="172" cy="102" r="6" fill={accent} />

      {/* cabin */}
      <g {...part('shell')}>
        <path d="M26 116c0-32 24-54 58-54 26 0 44 14 48 36l4 20c1 9-5 16-14 16H46c-11 0-20-8-20-18z" fill={body} />
        <path d="M26 116c0-32 24-54 58-54 26 0 44 14 48 36l4 20c1 9-5 16-14 16H46c-11 0-20-8-20-18z" fill={`url(#${uid}-body)`} />
        <path d="M26 116c0-32 24-54 58-54 26 0 44 14 48 36l4 20c1 9-5 16-14 16H46c-11 0-20-8-20-18z" fill={`url(#${uid}-rim)`} />
      </g>
      {/* bubble canopy, outlined */}
      <path d="M32 112c0-24 20-42 46-42 13 0 24 5 30 13l-8 33H36c-3 0-4-2-4-4z" fill={extra} />
      <path d="M32 112c0-24 20-42 46-42 13 0 24 5 30 13l-8 33H36c-3 0-4-2-4-4z" fill={`url(#${uid}-rim)`} />
      <path d="M32 112c0-24 20-42 46-42 13 0 24 5 30 13l-8 33H36c-3 0-4-2-4-4z" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="3" />
      <Eyes cx={66} cy={94} gap={14} r={9} look={look} />
      <ellipse cx="48" cy="80" rx="10" ry="6" fill="#fff" opacity=".45" transform="rotate(-24 48 80)" />

      {/* mast + main rotor */}
      <rect x="92" y="42" width="12" height="24" rx="6" fill={accent} />
      <g {...part('rotor')} style={{ transform: `rotate(${rotor}deg)`, transformOrigin: '98px 40px', transition: A('rotor') ? 'transform 1.8s cubic-bezier(.15,.9,.2,1)' : 'none' }}>
        <rect x="2" y="34" width="192" height="12" rx="6" fill="#100C14" opacity=".82" />
        <rect x="2" y="37" width="192" height="4" rx="2" fill="rgba(255,255,255,.3)" />
        <circle cx="10" cy="40" r="7" fill={accent} />
        <circle cx="186" cy="40" r="7" fill={accent} />
      </g>
      <circle cx="98" cy="40" r="11" fill={accent} />
      <circle cx="98" cy="40" r="11" fill={`url(#${uid}-accent)`} />

      {/* skids */}
      <rect x="42" y="148" width="9" height="16" rx="4.5" fill="#100C14" />
      <rect x="104" y="148" width="9" height="16" rx="4.5" fill="#100C14" />
      <rect x="24" y="162" width="110" height="11" rx="5.5" fill="#100C14" />
      <rect x="24" y="164" width="110" height="3" rx="1.5" fill="rgba(255,255,255,.24)" />
    </g>
  );
}

/* ========================= AUTOBÚS ESCOLAR ======================== */
export function Bus({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const roll = spin + A('wheel') * 720;
  const door = A('door');
  const shell = 'M32 68h112c22 0 38 16 38 36v30c0 9-7 16-16 16H26c-9 0-16-7-16-16V90c0-12 10-22 22-22z';
  return (
    <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 3}px)` }}>
      {/* señal de stop abatible, en el costado */}
      <g style={{ transform: `rotate(${-70 + door * 70}deg)`, transformOrigin: '18px 106px', transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)' }}>
        <rect x="4" y="102" width="18" height="8" rx="4" fill="#100C14" opacity=".6" />
        <path d="M-14 98 l8-8 h11 l8 8 v11 l-8 8 h-11 l-8-8z" fill={accent} />
        <path d="M-14 98 l8-8 h11 l8 8 v11 l-8 8 h-11 l-8-8z" fill={`url(#${uid}-accent)`} />
      </g>

      {/* baca */}
      <rect x="24" y="60" width="130" height="10" rx="5" fill={accent} />
      <rect x="24" y="62" width="130" height="4" rx="2" fill="rgba(255,255,255,.4)" />
      {[44, 130].map((cx) => (
        <circle key={cx} cx={cx} cy="58" r="5" fill={accent} opacity={0.5 + 0.5 * Math.abs(Math.sin((spin + cx) * Math.PI / 180))} />
      ))}

      {/* carrocería */}
      <g {...part('shell')}>
        <path d={shell} fill={body} />
        <path d={shell} fill={`url(#${uid}-body)`} />
        <path d={shell} fill={`url(#${uid}-rim)`} />
      </g>

      {/* parabrisas, con el conductor dentro */}
      <path d="M150 80h6c14 0 22 10 22 24v6h-28z" fill={extra} />
      <path d="M150 80h6c14 0 22 10 22 24v6h-28z" fill={`url(#${uid}-rim)`} />
      <path d="M150 80h6c14 0 22 10 22 24v6h-28z" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="3" />
      <Eyes cx={164} cy={96} gap={10} r={6} look={look} />

      {/* ventanillas */}
      {[26, 54, 82].map((x) => (
        <g key={x}>
          <rect x={x} y="82" width="24" height="24" rx="7" fill={extra} />
          <rect x={x} y="82" width="24" height="24" rx="7" fill="none" stroke="rgba(0,0,0,.2)" strokeWidth="3" />
          <rect x={x + 4} y="86" width="8" height="7" rx="3" fill="rgba(255,255,255,.45)" />
        </g>
      ))}

      {/* puerta de dos hojas: se pliega al tocarla */}
      <g {...part('door')}>
        <rect x="114" y="80" width="30" height="52" rx="8" fill="rgba(0,0,0,.18)" />
        {[0, 1].map((i) => (
          <rect
            key={i}
            x={114 + i * 15} y="80" width="15" height="52" rx="6"
            fill={extra}
            style={{
              transform: `perspective(300px) rotateY(${(i ? 1 : -1) * door * 72}deg)`,
              transformOrigin: `${114 + i * 15 + (i ? 15 : 0)}px 106px`,
              transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)',
            }}
          />
        ))}
      </g>

      {/* franja y rótulo */}
      <rect x="14" y="116" width="152" height="9" rx="4.5" fill={accent} />
      <Studs x={30} y={72} n={7} gap={18} />

      {/* parachoques y faros */}
      <rect x="8" y="128" width="174" height="11" rx="5" fill="#100C14" opacity=".7" />
      <ellipse cx="176" cy="122" rx="8" ry="6" fill={accent} />

      {/* ruedas */}
      <g {...part('wheel')}>
        <Wheel uid={uid} cx={50} cy={150} r={21} hub={accent} roll={roll} smooth={!!A('wheel')} />
        <Wheel uid={uid} cx={144} cy={150} r={21} hub={accent} roll={roll} smooth={!!A('wheel')} />
      </g>
    </g>
  );
}

/* =========================== SUBMARINO ============================ */
export function Sub({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const prop = spin * 4 + A('prop') * 1080;
  return (
    <g style={{ transform: `translate(${look.x * 6}px, ${look.y * 5}px) rotate(${look.x * 3}deg)`, transformOrigin: '100px 110px' }} className="toy-bob">
      {/* bubbles */}
      <circle cx="26" cy="70" r="7" fill={extra} opacity=".4" className="toy-bob" />
      <circle cx="14" cy="50" r="4" fill={extra} opacity=".28" />
      <circle cx="36" cy="46" r="5" fill={extra} opacity=".22" />

      {/* propeller */}
      <g style={{ transform: `rotate(${prop}deg)`, transformOrigin: '176px 116px', transition: A('prop') ? 'transform 1.4s cubic-bezier(.15,.9,.2,1)' : 'none' }} {...part('prop')}>
        <ellipse cx="176" cy="100" rx="7" ry="16" fill={accent} />
        <ellipse cx="176" cy="132" rx="7" ry="16" fill={accent} />
      </g>
      <rect x="160" y="110" width="20" height="12" rx="6" fill="#100C14" opacity=".7" />

      {/* fin */}
      <path d="M156 96 L180 78 L178 116 Z" fill={accent} opacity=".9" />

      {/* conning tower */}
      <g {...part('tower')}>
        <rect x="80" y="52" width="44" height="40" rx="14" fill={accent} />
        <rect x="80" y="52" width="44" height="40" rx="14" fill={`url(#${uid}-accent)`} />
        {/* periscope */}
        <rect x="98" y="26" width="8" height="30" rx="4" fill={extra} />
        <rect x="98" y="26" width="22" height="8" rx="4" fill={extra} />
      </g>

      {/* hull */}
      <g {...part('shell')}>
        <path d="M28 116c0-24 24-38 62-38h42c22 0 34 14 34 38s-12 38-34 38H90c-38 0-62-14-62-38z" fill={body} />
        <path d="M28 116c0-24 24-38 62-38h42c22 0 34 14 34 38s-12 38-34 38H90c-38 0-62-14-62-38z" fill={`url(#${uid}-body)`} />
        <path d="M28 116c0-24 24-38 62-38h42c22 0 34 14 34 38s-12 38-34 38H90c-38 0-62-14-62-38z" fill={`url(#${uid}-rim)`} />
      </g>

      {/* big front porthole with a face in it */}
      <circle cx="62" cy="116" r="26" fill={extra} />
      <circle cx="62" cy="116" r="26" fill={`url(#${uid}-extra)`} />
      <circle cx="62" cy="116" r="26" fill="none" stroke={accent} strokeWidth="6" />
      <Eyes cx={62} cy={114} gap={10} r={8} look={look} />
      {/* side portholes */}
      {[112, 140].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="116" r="11" fill={extra} />
          <circle cx={cx} cy="116" r="11" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="3" />
        </g>
      ))}
      <Studs x={96} y={148} n={4} gap={16} rx={6} ry={3} />
    </g>
  );
}
