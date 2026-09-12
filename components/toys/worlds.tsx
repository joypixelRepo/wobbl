'use client';

import { Eyes, Studs, type SubProps } from './kit';

/* ========================= CASA DE MUÑECAS ======================== *
 * Vista de frente abierta: se ven las dos plantas por dentro.
 * ------------------------------------------------------------------ */
export function Dollhouse({ uid, body, accent, extra, look, part, A }: SubProps) {
  const door = A('door');
  return (
    <g style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px)` }}>
      {/* roof */}
      <path d="M100 14 L184 72 H16 Z" fill={accent} />
      <path d="M100 14 L184 72 H16 Z" fill={`url(#${uid}-accent)`} />
      {Array.from({ length: 4 }, (_, i) => (
        <path key={i} d={`M${44 + i * 18} ${72 - i * 2} L${100} ${26 + i * 10}`} stroke="rgba(0,0,0,.12)" strokeWidth="3" />
      ))}
      {/* chimney */}
      <rect x="140" y="26" width="18" height="30" rx="5" fill={extra} />
      <circle cx="152" cy="18" r="8" fill={extra} opacity=".4" className="toy-bob" />

      {/* shell */}
      <g {...part('shell')}>
        <rect x="26" y="70" width="148" height="102" rx="12" fill={body} />
        <rect x="26" y="70" width="148" height="102" rx="12" fill={`url(#${uid}-body)`} />
        <rect x="26" y="70" width="148" height="102" rx="12" fill={`url(#${uid}-rim)`} />
      </g>

      {/* the open interior: two rooms upstairs, two down */}
      <rect x="36" y="80" width="60" height="40" rx="7" fill="rgba(0,0,0,.2)" />
      <rect x="104" y="80" width="60" height="40" rx="7" fill="rgba(0,0,0,.2)" />
      <rect x="36" y="126" width="60" height="38" rx="7" fill="rgba(0,0,0,.2)" />
      {/* upstairs: a little bed and a lamp */}
      <rect x="44" y="100" width="34" height="14" rx="5" fill={extra} />
      <rect x="44" y="94" width="10" height="20" rx="4" fill={accent} />
      <circle cx="86" cy="92" r="7" fill={accent} />
      {/* upstairs right: a table with two stools */}
      <rect x="116" y="102" width="36" height="7" rx="3.5" fill={extra} />
      <rect x="120" y="109" width="6" height="11" rx="3" fill={extra} />
      <rect x="142" y="109" width="6" height="11" rx="3" fill={extra} />
      <circle cx="128" cy="92" r="8" fill={accent} opacity=".85" />
      {/* downstairs: a rug and a plant */}
      <ellipse cx="66" cy="156" rx="24" ry="7" fill={accent} opacity=".85" />
      <rect x="82" y="140" width="10" height="16" rx="3" fill={accent} />
      <circle cx="87" cy="136" r="9" fill={extra} />

      {/* front door — swings open when poked */}
      <g {...part('door')} style={{ transform: `perspective(400px) rotateY(${-door * 70}deg)`, transformOrigin: '106px 168px', transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)' }}>
        <rect x="106" y="126" width="48" height="46" rx="8" fill={accent} />
        <rect x="106" y="126" width="48" height="46" rx="8" fill={`url(#${uid}-accent)`} />
        <circle cx="146" cy="150" r="4.5" fill={extra} />
        <rect x="114" y="134" width="32" height="14" rx="5" fill="rgba(255,255,255,.3)" />
      </g>

      {/* window boxes */}
      <rect x="36" y="118" width="60" height="7" rx="3.5" fill={accent} />
      <rect x="104" y="118" width="60" height="7" rx="3.5" fill={accent} />
      <Studs x={44} y={74} n={8} gap={16} />
    </g>
  );
}

/* ============================= CASTILLO =========================== *
 * Torres redondas con tejado cónico, igual que el modelo 3D. Antes
 * eran dos torres cuadradas de remate plano y no era el mismo castillo
 * el de la estantería que el de la ficha.
 * ------------------------------------------------------------------ */
export function Castle({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const gate = A('gate');

  const tower = (x: number) => (
    <g key={x}>
      {/* fuste, con el degradado que le da la vuelta cilíndrica */}
      <rect x={x} y="76" width="46" height="96" rx="10" fill={body} />
      <rect x={x} y="76" width="46" height="96" rx="10" fill={`url(#${uid}-body)`} />
      <rect x={x + 6} y="80" width="10" height="88" rx="5" fill="rgba(255,255,255,.34)" />
      {/* saetera */}
      <rect x={x + 18} y="104" width="10" height="26" rx="5" fill={extra} />
      <rect x={x + 18} y="104" width="10" height="26" rx="5" fill="none" stroke="rgba(0,0,0,.2)" strokeWidth="2" />
      {/* moldura y tejado cónico */}
      <rect x={x - 5} y="68" width="56" height="12" rx="5" fill={accent} />
      <path d={`M${x - 5} 68 L${x + 23} 18 L${x + 51} 68 Z`} fill={accent} />
      <path d={`M${x - 5} 68 L${x + 23} 18 L${x + 51} 68 Z`} fill={`url(#${uid}-accent)`} />
      <path d={`M${x + 23} 18 L${x + 51} 68 L${x + 34} 68 Z`} fill="rgba(0,0,0,.14)" />
      {/* asta y banderín */}
      <rect x={x + 21} y="2" width="4" height="20" rx="2" fill="#100C14" opacity=".55" />
      <path
        d={`M${x + 25} 4 L${x + 47} 10 L${x + 25} 16 Z`}
        fill={accent}
        style={{ transformOrigin: `${x + 25}px 10px`, transform: `scaleX(${0.86 + 0.14 * Math.sin(spin * 0.05)})` }}
      />
    </g>
  );

  return (
    <g style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px)` }}>
      {/* peana */}
      <rect x="8" y="168" width="184" height="14" rx="6" fill={extra} />
      <rect x="8" y="170" width="184" height="5" rx="2.5" fill="rgba(255,255,255,.3)" />

      {tower(14)}
      {tower(140)}

      {/* cuerpo central */}
      <g {...part('shell')}>
        <rect x="60" y="94" width="80" height="78" rx="8" fill={body} />
        <rect x="60" y="94" width="80" height="78" rx="8" fill={`url(#${uid}-body)`} />
        <rect x="60" y="94" width="80" height="78" rx="8" fill={`url(#${uid}-rim)`} />
        <rect x="56" y="88" width="88" height="11" rx="4" fill={accent} />
      </g>
      {/* almenas del adarve */}
      {[62, 80, 98, 116].map((x) => (
        <rect key={x} x={x} y="74" width="14" height="16" rx="3" fill={body} />
      ))}
      <Studs x={70} y={98} n={4} gap={18} />

      {/* arco y rastrillo */}
      <path d="M82 172 v-30 a18 18 0 0 1 36 0 v30z" fill="rgba(0,0,0,.34)" />
      <g {...part('gate')} style={{ transform: `translateY(${-gate * 26}px)`, transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)' }}>
        <path d="M84 170 v-28 a16 16 0 0 1 32 0 v28z" fill={accent} />
        <path d="M84 170 v-28 a16 16 0 0 1 32 0 v28z" fill={`url(#${uid}-accent)`} />
        {[92, 100, 108].map((x) => <rect key={x} x={x} y="128" width="3.5" height="42" fill="rgba(0,0,0,.3)" />)}
        {[140, 154].map((y) => <rect key={y} x="84" y={y} width="32" height="3.5" fill="rgba(0,0,0,.3)" />)}
      </g>
      {/* el centinela, que asoma al subir el rastrillo */}
      {gate > 0.1 && (
        <g opacity={gate}>
          <rect x="92" y="150" width="16" height="22" rx="7" fill={extra} />
          <Eyes cx={100} cy={154} gap={5} r={3.5} look={look} />
        </g>
      )}

      {/* ventanas del cuerpo */}
      {[74, 126].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="116" r="8" fill={extra} />
          <circle cx={cx} cy="116" r="8" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="2" />
        </g>
      ))}
    </g>
  );
}

/* ========================= COCINA DE JUGUETE ====================== */
export function Kitchen({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const oven = A('oven');
  return (
    <g style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px)` }}>
      {/* extractor hood */}
      <path d="M40 20h120l-14 30H54z" fill={accent} />
      <path d="M40 20h120l-14 30H54z" fill={`url(#${uid}-accent)`} />
      <rect x="54" y="48" width="92" height="8" rx="4" fill={extra} />
      {/* backsplash */}
      <rect x="34" y="58" width="132" height="34" rx="8" fill={extra} opacity=".55" />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={42 + i * 26} y="64" width="20" height="22" rx="4" fill="rgba(255,255,255,.22)" />
      ))}

      {/* worktop */}
      <rect x="24" y="90" width="152" height="14" rx="7" fill={accent} />
      <rect x="24" y="92" width="152" height="5" rx="2.5" fill="rgba(255,255,255,.4)" />

      {/* hobs — one of them has a pan on it */}
      {[[56, 84], [96, 84]].map(([cx, cy]) => (
        <g key={cx}>
          <ellipse cx={cx} cy={cy} rx="15" ry="6" fill="#100C14" opacity=".6" />
          <ellipse cx={cx} cy={cy - 1} rx="9" ry="3.5" fill={extra} opacity=".7" />
        </g>
      ))}
      <g>
        <ellipse cx="142" cy="82" rx="24" ry="9" fill={extra} />
        <ellipse cx="142" cy="79" rx="24" ry="9" fill={body} />
        <rect x="164" y="76" width="26" height="7" rx="3.5" fill="#100C14" opacity=".7" />
        <circle cx="136" cy="70" r="6" fill="#fff" opacity=".35" className="toy-bob" />
      </g>

      {/* unit body */}
      <g {...part('shell')}>
        <rect x="24" y="102" width="152" height="72" rx="12" fill={body} />
        <rect x="24" y="102" width="152" height="72" rx="12" fill={`url(#${uid}-body)`} />
        <rect x="24" y="102" width="152" height="72" rx="12" fill={`url(#${uid}-rim)`} />
      </g>

      {/* oven door — drops open when poked */}
      <g {...part('oven')} style={{ transform: `perspective(500px) rotateX(${oven * 72}deg)`, transformOrigin: '100px 168px', transition: 'transform .6s cubic-bezier(.34,1.8,.44,1)' }}>
        <rect x="44" y="112" width="76" height="56" rx="10" fill={extra} />
        <rect x="44" y="112" width="76" height="56" rx="10" fill={`url(#${uid}-extra)`} />
        <rect x="52" y="122" width="60" height="34" rx="7" fill="rgba(16,12,20,.7)" />
        <Eyes cx={82} cy={139} gap={13} r={7} look={look} />
        <rect x="48" y="106" width="68" height="8" rx="4" fill={accent} />
      </g>

      {/* knobs, which turn with the toy */}
      {[132, 152].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="122" r="11" fill={accent} />
          <circle cx={cx} cy="122" r="11" fill={`url(#${uid}-accent)`} />
          <rect x={cx - 2} y="114" width="4" height="9" rx="2" fill="#100C14" opacity=".6" transform={`rotate(${spin * (i ? -1 : 1)} ${cx} 122)`} />
        </g>
      ))}
      {/* sink */}
      <rect x="126" y="140" width="42" height="24" rx="8" fill={extra} opacity=".8" />
      <rect x="132" y="146" width="30" height="12" rx="5" fill="rgba(0,0,0,.25)" />
    </g>
  );
}

/* =============================== NORIA ============================ */
export function Ferris({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const turn = spin * 1.2 + A('turn') * 720;
  const cars = [0, 45, 90, 135, 180, 225, 270, 315];
  const R = 66;
  return (
    <g style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px)` }}>
      {/* legs */}
      <path d="M100 104 L48 170 h18 L100 120 Z" fill={accent} />
      <path d="M100 104 L152 170 h-18 L100 120 Z" fill={accent} />
      <rect x="34" y="166" width="132" height="12" rx="6" fill={extra} />
      <rect x="34" y="168" width="132" height="4" rx="2" fill="rgba(255,255,255,.35)" />

      {/* wheel */}
      <g {...part('turn')} style={{ transform: `rotate(${turn}deg)`, transformOrigin: '100px 96px', transition: A('turn') ? 'transform 2.4s cubic-bezier(.16,1,.3,1)' : 'none' }}>
        <circle cx="100" cy="96" r={R} fill="none" stroke={body} strokeWidth="11" />
        <circle cx="100" cy="96" r={R} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="4" />
        <circle cx="100" cy="96" r={R - 18} fill="none" stroke={body} strokeWidth="6" opacity=".7" />
        {cars.map((a) => (
          <rect key={`s-${a}`} x="97" y="34" width="6" height="62" rx="3" fill={body} opacity=".85" transform={`rotate(${a} 100 96)`} />
        ))}
        {/* gondolas hang level whatever the wheel does */}
        {cars.map((a, i) => {
          const rad = ((a - 90) * Math.PI) / 180;
          const cx = 100 + Math.cos(rad) * R;
          const cy = 96 + Math.sin(rad) * R;
          return (
            <g key={a} transform={`rotate(${-turn} ${cx} ${cy})`}>
              <rect x={cx - 12} y={cy - 2} width="24" height="20" rx="7" fill={i % 2 ? accent : extra} />
              <rect x={cx - 12} y={cy - 2} width="24" height="7" rx="3.5" fill="rgba(255,255,255,.35)" />
              <rect x={cx - 2} y={cy - 8} width="4" height="8" rx="2" fill="#100C14" opacity=".5" />
            </g>
          );
        })}
      </g>

      {/* hub with a face, so you can tell it is a toy and not a diagram */}
      <circle cx="100" cy="96" r="22" fill={accent} />
      <circle cx="100" cy="96" r="22" fill={`url(#${uid}-accent)`} />
      <Eyes cx={100} cy={94} gap={8} r={6} look={look} />

      {/* ticket booth */}
      <rect x="150" y="140" width="34" height="28" rx="8" fill={body} />
      <rect x="156" y="146" width="22" height="12" rx="4" fill={extra} />
      <path d="M148 134 h38 l-6 8 h-26 z" fill={accent} />
    </g>
  );
}

/* ====================== LABORATORIO DE CIENCIA ==================== *
 * El cristal va siempre perfilado: relleno en `extra` y sin contorno,
 * el matraz desaparecía sobre el fondo de su propia caja.
 * ------------------------------------------------------------------ */
export function Lab({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const boil = A('boil');
  const flask = 'M74 44h22v34l26 52c4 8-1 16-10 16H58c-9 0-14-8-10-16l26-52z';
  return (
    <g style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px)` }}>
      {/* bubbles coming off the flask */}
      <g opacity={0.55 + boil * 0.45}>
        <circle cx="86" cy="30" r="9" fill={accent} className="toy-bob" />
        <circle cx="70" cy="12" r="6" fill={accent} opacity=".6" />
        <circle cx="100" cy="10" r="5" fill={extra} opacity=".55" />
      </g>

      {/* the star of the bench: a flask that bubbles */}
      <g {...part('boil')}>
        <path d={flask} fill={extra} opacity=".45" />
        <path d={flask} fill={`url(#${uid}-rim)`} />
        {/* liquid */}
        <path d="M64 112h42l16 20c4 6-1 12-8 12H58c-8 0-12-6-8-12z" fill={accent} />
        <path d="M64 112h42l16 20c4 6-1 12-8 12H58c-8 0-12-6-8-12z" fill={`url(#${uid}-accent)`} />
        <ellipse cx="85" cy="112" rx="21" ry="4" fill="rgba(255,255,255,.5)" />
        <circle cx="74" cy="126" r="5" fill="#fff" opacity=".55" className="toy-bob" />
        <circle cx="96" cy="132" r="3.5" fill="#fff" opacity=".45" />
        {/* the outline, last, so the glass reads on any ground */}
        <path d={flask} fill="none" stroke="rgba(0,0,0,.3)" strokeWidth="4" strokeLinejoin="round" />
        {/* stopper */}
        <rect x="70" y="36" width="30" height="11" rx="5.5" fill={body} />
        <rect x="70" y="36" width="30" height="4" rx="2" fill="rgba(255,255,255,.4)" />
      </g>
      {/* burner under it */}
      <path d="M78 148h16l6 12H72z" fill={body} />
      <path d="M86 138q7 6 0 12 -7-6 0-12z" fill={accent} opacity={0.5 + boil * 0.5} className="toy-bob" />

      {/* test-tube rack */}
      <g>
        <rect x="120" y="104" width="66" height="11" rx="5" fill={body} />
        <rect x="120" y="140" width="66" height="11" rx="5" fill={body} />
        <rect x="122" y="111" width="6" height="32" fill={body} />
        <rect x="178" y="111" width="6" height="32" fill={body} />
        {[134, 152, 170].map((x, i) => (
          <g key={x}>
            <rect x={x} y="84" width="16" height="62" rx="8" fill={extra} opacity=".45" />
            <path d={`M${x} 118h16v20a8 8 0 0 1-16 0z`} fill={[accent, body, accent][i]} />
            <rect x={x} y="84" width="16" height="62" rx="8" fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="3" />
            <rect x={x - 2} y="80" width="20" height="7" rx="3.5" fill={body} />
          </g>
        ))}
      </g>

      {/* the bench */}
      <g {...part('shell')}>
        <rect x="14" y="156" width="172" height="18" rx="9" fill={body} />
        <rect x="14" y="156" width="172" height="18" rx="9" fill={`url(#${uid}-body)`} />
        <rect x="14" y="159" width="172" height="5" rx="2.5" fill="rgba(255,255,255,.38)" />
        <Studs x={32} y={160} n={8} gap={20} />
      </g>

      {/* safety goggles left on the bench, with a face behind them */}
      <g style={{ transform: `rotate(${Math.sin(spin * 0.03) * 3}deg)`, transformOrigin: '40px 130px' }}>
        <rect x="14" y="118" width="54" height="24" rx="12" fill={body} />
        <rect x="14" y="118" width="54" height="24" rx="12" fill={`url(#${uid}-rim)`} />
        <circle cx="28" cy="130" r="9" fill={extra} />
        <circle cx="54" cy="130" r="9" fill={extra} />
        <circle cx="28" cy="130" r="9" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="2.5" />
        <circle cx="54" cy="130" r="9" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="2.5" />
        <Eyes cx={41} cy={130} gap={13} r={5.5} look={look} />
      </g>
    </g>
  );
}

/* ========================= PISTA DE COCHES ======================== */
export function Track({ uid, body, accent, extra, look, part, A, spin = 0 }: SubProps) {
  const go = A('go');
  // The car runs the loop: angle drives its position round the circle.
  const t = (spin * 2 + go * 720) % 360;
  const rad = ((t - 90) * Math.PI) / 180;
  const carX = 118 + Math.cos(rad) * 40;
  const carY = 78 + Math.sin(rad) * 40;
  return (
    <g style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px)` }}>
      {/* the loop */}
      <g {...part('go')}>
        <circle cx="118" cy="78" r="46" fill="none" stroke={body} strokeWidth="20" />
        <circle cx="118" cy="78" r="46" fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="20" />
        <circle cx="118" cy="78" r="46" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="4" strokeDasharray="7 11" />
      </g>

      {/* the straight running into it */}
      <path d="M10 136h180c6 0 10 4 10 10s-4 10-10 10H10c-6 0-10-4-10-10s4-10 10-10z" fill={body} />
      <path d="M10 136h180c6 0 10 4 10 10s-4 10-10 10H10c-6 0-10-4-10-10s4-10 10-10z" fill={`url(#${uid}-rim)`} />
      <rect x="10" y="144" width="180" height="4" rx="2" fill="rgba(255,255,255,.45)" strokeDasharray="10 12" />
      {/* ramp up into the loop */}
      <path d="M60 136 q22 -6 30 -18 l14 10 q-14 14 -30 20z" fill={body} opacity=".9" />

      {/* the car that runs it */}
      <g style={{ transform: `translate(${carX - 100}px, ${carY - 100}px) rotate(${t}deg)`, transformOrigin: '100px 100px', transition: A('go') ? 'transform 1.6s cubic-bezier(.2,.8,.2,1)' : 'none' }}>
        <rect x="82" y="90" width="36" height="16" rx="7" fill={accent} />
        <rect x="90" y="82" width="20" height="12" rx="5" fill={extra} />
        <circle cx="90" cy="108" r="6" fill="#100C14" />
        <circle cx="110" cy="108" r="6" fill="#100C14" />
      </g>

      {/* start gantry */}
      <g>
        <rect x="18" y="102" width="9" height="40" rx="4" fill={extra} />
        <rect x="18" y="96" width="46" height="12" rx="5" fill={extra} />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={22 + (i % 4) * 10} y={98 + Math.floor(i / 4) * 5} width="10" height="5" fill={i % 2 ? '#fff' : '#100C14'} opacity=".85" />
        ))}
      </g>

      {/* pit crew of one */}
      <g>
        <circle cx="168" cy="116" r="13" fill={accent} />
        <Eyes cx={168} cy={114} gap={5} r={4} look={look} />
        <path d="M156 110 h24" stroke={extra} strokeWidth="5" strokeLinecap="round" />
      </g>
      <Studs x={28} y={158} n={8} gap={20} />
    </g>
  );
}
