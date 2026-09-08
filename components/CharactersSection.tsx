'use client';

import { useEffect, useRef, useState } from 'react';
import { SplitHeading, Sticker } from '@/components/ui';
import { CHARACTERS } from '@/data/catalog';
import { usePointer, useRaf, useIsTouch, lerp, clamp } from '@/lib/hooks';
import { HowTo } from '@/components/HowTo';
import { play } from '@/lib/sound';

/** Four bespoke faces. They watch the pointer, and they move if you crowd them. */
function Face({ id, body, accent, blink }: { id: string; body: string; accent: string; blink: boolean }) {
  switch (id) {
    case 'robo':
      return (
        <>
          <rect x="26" y="10" width="8" height="16" rx="4" fill={accent} />
          <circle cx="30" cy="9" r="7" fill={accent} className="toy-bob" />
          <rect x="12" y="24" width="76" height="62" rx="22" fill={body} />
          <rect x="12" y="24" width="76" height="62" rx="22" fill="url(#ch-sheen)" />
          <rect x="22" y="36" width="56" height="30" rx="12" fill="#100C14" />
          <rect x="6" y="42" width="8" height="18" rx="4" fill={accent} />
          <rect x="86" y="42" width="8" height="18" rx="4" fill={accent} />
          <rect x="34" y="74" width="32" height="6" rx="3" fill="rgba(0,0,0,.28)" />
        </>
      );
    case 'blob':
      return (
        <>
          <path d="M50 8c26 0 42 18 42 40 0 24-12 36-42 36S8 72 8 48C8 26 24 8 50 8z" fill={body} />
          <path d="M50 8c26 0 42 18 42 40 0 24-12 36-42 36S8 72 8 48C8 26 24 8 50 8z" fill="url(#ch-sheen)" />
          <ellipse cx="32" cy="30" rx="12" ry="8" fill="#fff" opacity=".45" transform="rotate(-22 32 30)" />
          {!blink && <path d="M36 66q14 12 28 0" stroke={accent} strokeWidth="5" fill="none" strokeLinecap="round" />}
        </>
      );
    case 'zip':
      return (
        <>
          <path d="M14 62 44 12l-6 30h20L30 92l8-30z" fill={accent} opacity=".55" />
          <ellipse cx="54" cy="50" rx="38" ry="34" fill={body} />
          <ellipse cx="54" cy="50" rx="38" ry="34" fill="url(#ch-sheen)" />
          <path d="M4 34h22M0 50h26M4 66h22" stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none" opacity=".8" />
        </>
      );
    default: // boom
      return (
        <>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <rect key={a} x="46" y="0" width="8" height="22" rx="4" fill={accent} transform={`rotate(${a} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="38" fill={body} />
          <circle cx="50" cy="50" r="38" fill="url(#ch-sheen)" />
          <path d="M32 62l7 10 7-10 7 10 7-10 7 10 5-8" stroke="#100C14" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
  }
}

interface Slot { left: string; top: string; size: number; }
const SLOTS: Slot[] = [
  { left: '10%', top: '18%', size: 1 },
  { left: '62%', top: '10%', size: .86 },
  { left: '30%', top: '58%', size: .94 },
  { left: '78%', top: '54%', size: 1.06 },
];

export default function CharactersSection() {
  const pointer = usePointer();
  const touch = useIsTouch();
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const eyes = useRef<(SVGGElement | null)[]>([]);
  const offs = useRef(CHARACTERS.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 })));
  const [said, setSaid] = useState<number | null>(null);
  const [poked, setPoked] = useState(false);
  const [blink, setBlink] = useState<Record<number, boolean>>({});

  useRaf((dt) => {
    const p = pointer.current;
    CHARACTERS.forEach((_, i) => {
      const el = refs.current[i];
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.hypot(dx, dy) || 1;

      // Shy: they lean away when the pointer gets close.
      const o = offs.current[i];
      if (!touch && dist < r.width * 1.15) {
        const push = (1 - dist / (r.width * 1.15)) * 46;
        o.tx = (-dx / dist) * push;
        o.ty = (-dy / dist) * push;
      } else {
        o.tx = 0; o.ty = 0;
      }
      o.x = lerp(o.x, o.tx, 1 - Math.pow(.004, dt));
      o.y = lerp(o.y, o.ty, 1 - Math.pow(.004, dt));
      el.style.setProperty('--ox', `${o.x}px`);
      el.style.setProperty('--oy', `${o.y}px`);

      // Eyes track the pointer wherever it is on the page.
      const g = eyes.current[i];
      if (g) {
        const ex = clamp(dx / 260, -1, 1) * 5;
        const ey = clamp(dy / 260, -1, 1) * 4;
        g.setAttribute('transform', `translate(${ex} ${ey})`);
      }
    });
  });

  // Independent blinking, so the group never feels synchronised.
  useEffect(() => {
    const timers = CHARACTERS.map((_, i) =>
      window.setInterval(() => {
        setBlink((b) => ({ ...b, [i]: true }));
        window.setTimeout(() => setBlink((b) => ({ ...b, [i]: false })), 130);
      }, 3200 + i * 900 + Math.random() * 1400),
    );
    return () => timers.forEach(window.clearInterval);
  }, []);

  function poke(i: number) {
    setPoked(true);
    play(['boing', 'pop', 'whoosh', 'snap'][i] as 'boing');
    setSaid(i);
    const el = refs.current[i];
    if (el) {
      el.classList.remove('poked');
      void el.offsetWidth;
      el.classList.add('poked');
    }
    window.setTimeout(() => setSaid((s) => (s === i ? null : s)), 2200);
  }

  return (
    <section id="characters" className="scene characters" data-palette="grape">
      <svg width="0" height="0" aria-hidden style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="ch-sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity=".4" />
            <stop offset="52%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity=".24" />
          </linearGradient>
        </defs>
      </svg>

      <div className="ch-head">
        <Sticker rotate={3} tone="d">SECCIÓN 06 — LA PANDILLA</Sticker>
        <SplitHeading text="CUATRO" className="t-huge" />
        <SplitHeading text="CARACTERES" className="t-huge ch-h2" />
        <SplitHeading text="MUY FUERTES." className="t-big ch-h3" sticker />
        <p className="body-copy ch-copy">
          Viven dentro de los juguetes, en las cajas y, si te acercas demasiado, un poco
          más a la izquierda de donde estaban.
        </p>
        <HowTo
          steps={['Acércales el cursor', 'Tócalos para reaccionar']}
          active={poked ? -1 : 0}
          done={poked ? [0, 1] : []}
          className="ch-howto"
        />
      </div>

      <div className="ch-stage">
        {CHARACTERS.map((c, i) => (
          <div
            key={c.id}
            className="ch-slot"
            style={{ left: SLOTS[i].left, top: SLOTS[i].top, ['--sz' as string]: SLOTS[i].size }}
            ref={(el) => { refs.current[i] = el; }}
          >
            <button className="ch-figure" onClick={() => poke(i)} data-cursor="play" type="button" aria-label={`${c.name} — ${c.role}`}>
              <svg viewBox="0 0 100 100" className="ch-svg">
                <Face id={c.id} body={c.body} accent={c.accent} blink={!!blink[i]} />
                <g ref={(el) => { eyes.current[i] = el; }}>
                  {blink[i] ? (
                    <>
                      <rect x="30" y="47" width="14" height="4" rx="2" fill="#100C14" />
                      <rect x="56" y="47" width="14" height="4" rx="2" fill="#100C14" />
                    </>
                  ) : (
                    <>
                      <circle cx="37" cy="48" r="9" fill="#fff" />
                      <circle cx="37" cy="48" r="4.4" fill="#100C14" />
                      <circle cx="35.4" cy="46.2" r="1.6" fill="#fff" />
                      <circle cx="63" cy="48" r="9" fill="#fff" />
                      <circle cx="63" cy="48" r="4.4" fill="#100C14" />
                      <circle cx="61.4" cy="46.2" r="1.6" fill="#fff" />
                    </>
                  )}
                </g>
              </svg>
            </button>

            <div className="ch-plate">
              <strong>{c.name}</strong>
              <span>{c.role}</span>
              <em>{c.trait}</em>
            </div>

            {said === i && <span className="ch-bubble">{c.line}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
