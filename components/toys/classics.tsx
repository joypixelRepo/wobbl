'use client';

import { Eyes, Gloss, Wheel, type SubProps } from './kit';

/* ---------------------------- WOBBL BOT --------------------------- *
 * The mascot, and the only toy that is taken apart by hand in the
 * hero — every group here is addressable through `part`.
 * ------------------------------------------------------------------ */
export function Bot({ uid, body, accent, extra, look, part, A }: SubProps) {
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
        <rect x="97" y="12" width="6" height="14" rx="3" fill={extra} />
        <circle cx="100" cy="14" r="7" fill={body} className="toy-bob" />
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

/* ------------------------- MUELLE SALTARÍN ------------------------ */
export function Spring({ uid, body, accent, extra, look, part, A }: SubProps) {
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

/* --------------------------- SUPERTORRE --------------------------- */
export function Stack({ uid, body, accent, extra, look, part, A }: SubProps) {
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

/* ---------------------------- BLOB BUDDY -------------------------- *
 * Not on sale — it is the mascot that keeps the empty cart company.
 * ------------------------------------------------------------------ */
export function Blob({ uid, body, accent, look, part, A }: SubProps) {
  const s = A('squish');
  const shape = 'M100 32c34 0 60 24 62 56 2 30-12 52-32 62-12 6-18 20-30 20s-18-14-30-20C50 140 36 118 38 88c2-32 28-56 62-56z';
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
      <path d={shape} fill={body} />
      <path d={shape} fill={`url(#${uid}-body)`} />
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

/* ------------------------ COCHE DE CARRERAS ------------------------ *
 * Monoplaza de ruedas descubiertas, igual que el modelo 3D. Antes era
 * un utilitario cerrado y en la ficha aparecía un coche distinto del
 * que se veía en la estantería.
 * ------------------------------------------------------------------ */
export function Racer({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const roll = spin + A('wheel') * 720;
  const shell = 'M30 150 q-8 -2 -8 -12 l0 -22 q0 -14 14 -18 l38 -8 q8 -12 22 -12 h18 q12 0 16 12 l50 8 q16 4 16 14 q0 10 -14 12 l-46 4 q-6 12 -22 12 h-26 q-14 0 -20 -10z';
  const pod = 'M74 124 h56 q10 0 10 10 v14 q0 10 -10 10 h-56 q-10 0 -10 -10 v-14 q0 -10 10 -10z';

  return (
    <g style={{ transform: `translate(${look.x * 6}px, ${look.y * 3}px)` }}>
      {/* alerón trasero sobre dos pilones */}
      <g>
        <rect x="12" y="90" width="46" height="11" rx="4" fill={accent} transform="rotate(-7 35 96)" />
        <rect x="18" y="104" width="36" height="8" rx="3" fill={accent} transform="rotate(-7 36 108)" />
        {[14, 52].map((x) => (
          <rect key={x} x={x} y="88" width="7" height="30" rx="3" fill={accent} />
        ))}
        <rect x="30" y="112" width="12" height="26" rx="5" fill={body} />
      </g>

      {/* chasis */}
      <g {...part('shell')}>
        <path d={shell} fill={body} />
        <path d={shell} fill={`url(#${uid}-body)`} />
        <path d={shell} fill={`url(#${uid}-rim)`} />
      </g>

      {/* pontón lateral con su boca de refrigeración */}
      <path d={pod} fill={body} />
      <path d={pod} fill={`url(#${uid}-rim)`} />
      <rect x="126" y="130" width="12" height="20" rx="5" fill="#141219" opacity=".8" />

      {/* franja central y dorsal */}
      <rect x="86" y="120" width="60" height="7" rx="3" fill={accent} />
      <circle cx="52" cy="126" r="10" fill="#f4f1ea" />
      <circle cx="52" cy="126" r="10" fill={`url(#${uid}-rim)`} />

      {/* bañera: arco antivuelco, casco y parabrisas */}
      <path d="M74 118 q6 -22 24 -22 q18 0 24 22z" fill={body} />
      <circle cx="98" cy="106" r="15" fill={extra} />
      <circle cx="98" cy="106" r="15" fill={`url(#${uid}-extra)`} />
      <path d="M84 104 a15 15 0 0 1 28 -4 l-28 8z" fill="#15131a" opacity=".85" />
      <path d="M116 110 q10 2 12 10" stroke={extra} strokeWidth="5" fill="none" strokeLinecap="round" opacity=".9" />

      {/* morro y alerón delantero */}
      <path d="M150 136 h30 q8 0 8 6 q0 6 -8 6 h-30z" fill={accent} />
      <g>
        <rect x="156" y="158" width="40" height="9" rx="4" fill={accent} transform="rotate(4 176 162)" />
        {[156, 188].map((x) => (
          <rect key={x} x={x} y="146" width="8" height="22" rx="3" fill={accent} />
        ))}
      </g>

      {/* escape */}
      <rect x="18" y="126" width="16" height="8" rx="4" fill="#c9ccd4" />

      {/* ruedas descubiertas: traseras más grandes */}
      <g {...part('wheel')}>
        {([[56, 148, 30], [152, 152, 25]] as const).map(([cx, cy, r]) => (
          <g key={cx} style={{ transform: `rotate(${roll * (r > 27 ? 1 : 1.2)}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: A('wheel') ? 'transform 1.4s cubic-bezier(.2,.8,.2,1)' : 'none' }}>
            <circle cx={cx} cy={cy} r={r} fill="#1b191f" />
            <circle cx={cx} cy={cy} r={r * 0.56} fill={accent} />
            <circle cx={cx} cy={cy} r={r * 0.56} fill={`url(#${uid}-accent)`} />
            <circle cx={cx} cy={cy} r={r * 0.16} fill="#e8eaf0" />
            {[0, 60, 120].map((a) => (
              <rect key={a} x={cx - r * 0.07} y={cy - r * 0.58} width={r * 0.14} height={r * 1.16} rx={r * 0.07} fill="rgba(0,0,0,.35)" transform={`rotate(${a} ${cx} ${cy})`} />
            ))}
          </g>
        ))}
      </g>
    </g>
  );
}

/* -------------------------- PUZLE ESFÉRICO ------------------------ *
 * Esfera con casquete de otro color, gajos tallados y anillo, como el
 * modelo 3D. Antes eran dos mitades lisas con garabatos encima: no era
 * la misma pieza.
 * ------------------------------------------------------------------ */
export function Planet({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const open = A('open');
  const R = 68;

  return (
    <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 4}px)` }}>
      {/* mitad del anillo que pasa por detrás */}
      <g style={{ transform: `rotate(${-18 + spin * 0.15}deg)`, transformOrigin: '100px 100px' }}>
        <path d="M12 100a88 26 0 0 1 176 0" fill="none" stroke={accent} strokeWidth="9" />
      </g>

      <g {...part('open')}>
        {/* esfera */}
        <g style={{ transform: `translateX(${-open * 24}px)`, transformOrigin: '100px 100px', transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)' }}>
          <path d={`M100 ${100 - R}a${R} ${R} 0 0 0 0 ${R * 2}z`} fill={body} />
          <path d={`M100 ${100 - R}a${R} ${R} 0 0 0 0 ${R * 2}z`} fill={`url(#${uid}-body)`} />
        </g>
        <g style={{ transform: `translateX(${open * 24}px)`, transformOrigin: '100px 100px', transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)' }}>
          <path d={`M100 ${100 - R}a${R} ${R} 0 0 1 0 ${R * 2}z`} fill={body} />
          <path d={`M100 ${100 - R}a${R} ${R} 0 0 1 0 ${R * 2}z`} fill={`url(#${uid}-body)`} />
        </g>

        {/* casquetes polares, en otro color: marcan por dónde abre */}
        <path d={`M${100 - R * 0.72} ${100 - R * 0.69} a${R} ${R} 0 0 1 ${R * 1.44} 0z`} fill={accent} opacity={1 - open * 0.8} />
        <path d={`M${100 - R * 0.6} ${100 + R * 0.8} a${R} ${R} 0 0 0 ${R * 1.2} 0z`} fill={extra} opacity={1 - open * 0.8} />

        {/* gajos tallados: meridianos hundidos, no pintados encima */}
        {[0.30, 0.60, 0.86].map((k) => (
          <g key={k} opacity={0.5 - open * 0.4}>
            <path d={`M100 32 a${R * k} ${R} 0 0 0 0 136`} fill="none" stroke="#000" strokeOpacity=".28" strokeWidth="2.5" />
            <path d={`M100 32 a${R * k} ${R} 0 0 1 0 136`} fill="none" stroke="#000" strokeOpacity=".28" strokeWidth="2.5" />
          </g>
        ))}
        {/* paralelos */}
        {[-30, 30].map((dy) => {
          const rx = Math.sqrt(Math.max(R * R - dy * dy, 1));
          return <ellipse key={dy} cx="100" cy={100 + dy} rx={rx} ry={rx * 0.16} fill="none" stroke="#000" strokeOpacity=".22" strokeWidth="2.5" opacity={1 - open} />;
        })}

        {/* brillo de vidrio */}
        <ellipse cx="74" cy="70" rx="20" ry="14" fill="#fff" opacity=".42" transform="rotate(-26 74 70)" />
      </g>

      {/* núcleo, al separarse las mitades */}
      <circle cx="100" cy="100" r={open * 17} fill={accent} opacity={open} />

      {/* mitad del anillo que pasa por delante */}
      <g style={{ transform: `rotate(${-18 + spin * 0.15}deg)`, transformOrigin: '100px 100px' }}>
        <path d="M12 100a88 26 0 0 0 176 0" fill="none" stroke={accent} strokeWidth="9" />
        <path d="M12 100a88 26 0 0 0 176 0" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="3" />
      </g>
    </g>
  );
}

/* ----------------------------- ORGANILLO -------------------------- *
 * Caja, bocina acampanada y manivela, como el modelo 3D. La versión
 * anterior no tenía manivela y se leía como un altavoz.
 * ------------------------------------------------------------------ */
export function Noise({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const keys = [
    { x: 46, id: 'k0', fill: accent },
    { x: 74, id: 'k1', fill: extra },
    { x: 102, id: 'k2', fill: accent },
    { x: 130, id: 'k3', fill: extra },
  ];
  const crank = spin * 1.2 + A('horn') * 360;

  return (
    <g style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px)` }}>
      {/* bocina acampanada: dos curvas y una boca elíptica */}
      <g {...part('horn')} style={{ transform: `scale(${1 + A('horn') * 0.08})`, transformOrigin: '150px 54px', transition: 'transform .35s cubic-bezier(.34,1.8,.44,1)' }}>
        <path d="M132 82 q4 -34 26 -52 q10 -8 18 -10 l10 26 q-10 4 -16 14 q-10 16 -10 30z" fill={accent} />
        <path d="M132 82 q4 -34 26 -52 q10 -8 18 -10 l10 26 q-10 4 -16 14 q-10 16 -10 30z" fill={`url(#${uid}-accent)`} />
        <ellipse cx="181" cy="33" rx="9" ry="15" fill={extra} transform="rotate(24 181 33)" />
        <ellipse cx="181" cy="33" rx="9" ry="15" fill="none" stroke="rgba(0,0,0,.2)" strokeWidth="2.5" transform="rotate(24 181 33)" />
        {A('horn') > 0 && [1, 2].map((i) => (
          <path key={i} d={`M${190 + i * 7} ${26 - i * 3} q6 ${8 + i * 3} 0 ${15 + i * 4}`} stroke={accent} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity={0.85 - i * 0.3} className="toy-ping" />
        ))}
      </g>

      {/* caja */}
      <g {...part('box')}>
        <rect x="26" y="74" width="116" height="80" rx="18" fill={body} />
        <rect x="26" y="74" width="116" height="80" rx="18" fill={`url(#${uid}-body)`} />
        <rect x="26" y="74" width="116" height="80" rx="18" fill={`url(#${uid}-rim)`} />
        {/* tapa */}
        <rect x="22" y="66" width="124" height="14" rx="7" fill={accent} />
        <rect x="22" y="68" width="124" height="4" rx="2" fill="rgba(255,255,255,.35)" />
        {/* rejilla */}
        <g opacity=".3">
          {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (
            <circle key={`${r}-${c}`} cx={46 + c * 12} cy={96 + r * 11} r="3" fill="#000" />
          )))}
        </g>
        {/* piloto */}
        <circle cx="124" cy="96" r="7" fill={accent} />
        <circle cx="124" cy="96" r="7" fill={`url(#${uid}-accent)`} />
      </g>

      {/* manivela: es lo que dice "organillo" y no "altavoz" */}
      <g style={{ transform: `rotate(${crank}deg)`, transformOrigin: '18px 118px' }}>
        <rect x="10" y="114" width="18" height="8" rx="4" fill="#c9ccd4" />
        <rect x="4" y="98" width="8" height="22" rx="4" fill="#c9ccd4" />
        <circle cx="8" cy="96" r="9" fill={accent} />
        <circle cx="8" cy="96" r="9" fill={`url(#${uid}-accent)`} />
      </g>
      <circle cx="18" cy="118" r="6" fill="#8e929b" />

      {/* teclas */}
      {keys.map((k) => (
        <g key={k.id} {...part(k.id)} style={{ transform: `translateY(${A(k.id) * 6}px)`, transition: 'transform .18s ease-out' }}>
          <rect x={k.x} y="160" width="24" height="22" rx="8" fill="rgba(0,0,0,.22)" />
          <rect x={k.x} y="156" width="24" height="22" rx="8" fill={k.fill} />
          <rect x={k.x + 4} y="160" width="16" height="6" rx="3" fill="rgba(255,255,255,.42)" />
        </g>
      ))}
    </g>
  );
}
