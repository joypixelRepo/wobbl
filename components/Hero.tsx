'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Toy from '@/components/Toy';
import ProductShot from '@/components/ProductShot';
import { SplitHeading, ToyButton, Sticker } from '@/components/ui';
import { usePointer, useRaf, useIsTouch, lerp, rand } from '@/lib/hooks';
import { play } from '@/lib/sound';
import { useShop } from '@/lib/store';
import { PRODUCTS } from '@/data/catalog';

const REACTIONS: Record<string, { word: string; sound: 'boing' | 'pop' | 'snap' | 'click' | 'whoosh' }> = {
  head:   { word: '¡HOLA!',  sound: 'boing' },
  chest:  { word: '¡ZAS!',   sound: 'snap' },
  'arm-l':{ word: '¡ADIÓS!', sound: 'whoosh' },
  'arm-r':{ word: '¡CHOCA!', sound: 'whoosh' },
  torso:  { word: '¡UF!',    sound: 'pop' },
  legs:   { word: '¡PLAF!',  sound: 'click' },
};

/* Las piezas que flotan son productos del catálogo, no dibujos sueltos:
   así salen con la misma ficha horneada que se ve en la estantería. */
const ORBIT = [
  { id: 'cohete',            cw: 0, x: 12, y: 22, s: 1.0, depth: 1.5, dur: 7 },
  { id: 'nave-espacial',     cw: 0, x: 84, y: 16, s: .82, depth: 2.2, dur: 9 },
  { id: 'coche-de-carreras', cw: 0, x: 88, y: 68, s: .9,  depth: 1.1, dur: 6.2 },
  { id: 'dinosaurio',        cw: 0, x: 8,  y: 70, s: .86, depth: 1.8, dur: 8 },
  { id: 'tren-de-vapor',     cw: 0, x: 70, y: 88, s: .62, depth: .7, dur: 10 },
  { id: 'unicornio',         cw: 0, x: 26, y: 88, s: .58, depth: .9, dur: 11 },
];

interface Pop { id: number; word: string; x: number; y: number; }
let popId = 1;

export default function Hero({ onExplore }: { onExplore: () => void }) {
  const pointer = usePointer();
  const touch = useIsTouch();
  const { startChaos, openSheet } = useShop();
  const stage = useRef<HTMLDivElement>(null);
  const botWrap = useRef<HTMLDivElement>(null);
  const orbitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState<Record<string, number>>({});
  const [pops, setPops] = useState<Pop[]>([]);
  const smooth = useRef({ x: 0, y: 0 });
  const [starFound, setStarFound] = useState(false);

  useRaf((dt) => {
    const p = pointer.current;
    if (touch) {
      // On touch the toy breathes on its own instead of tracking a pointer.
      const t = performance.now() / 1400;
      smooth.current.x = Math.sin(t) * .45;
      smooth.current.y = Math.cos(t * .8) * .3;
    } else {
      smooth.current.x = lerp(smooth.current.x, p.nx, 1 - Math.pow(.008, dt));
      smooth.current.y = lerp(smooth.current.y, p.ny, 1 - Math.pow(.008, dt));
    }
    const { x, y } = smooth.current;
    setLook((prev) => (Math.abs(prev.x - x) < .003 && Math.abs(prev.y - y) < .003 ? prev : { x, y }));

    if (botWrap.current) {
      botWrap.current.style.transform =
        `perspective(1200px) rotateY(${x * 13}deg) rotateX(${-y * 9}deg) translate3d(${x * 22}px, ${y * 14}px, 0)`;
    }
    orbitRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = ORBIT[i].depth;
      el.style.transform = `translate3d(${-x * 26 * d}px, ${-y * 20 * d}px, 0)`;
    });
  });

  const react = useCallback((partId: string) => {
    const r = REACTIONS[partId] ?? { word: 'BOING', sound: 'boing' as const };
    play(r.sound);
    setActive((a) => ({ ...a, [partId]: 1 }));
    window.setTimeout(() => setActive((a) => ({ ...a, [partId]: 0 })), 700);

    const rect = botWrap.current?.getBoundingClientRect();
    if (rect) {
      const id = popId++;
      setPops((p) => [...p, {
        id,
        word: r.word,
        x: rect.left + rect.width * rand(.24, .76),
        y: rect.top + rect.height * rand(.16, .6),
      }]);
      window.setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 900);
    }
  }, []);

  // Toys get thrown around if you scroll like a maniac.
  useEffect(() => {
    const onFast = () => {
      orbitRefs.current.forEach((el, i) => {
        if (!el) return;
        el.animate(
          [
            { transform: el.style.transform || 'none' },
            { transform: `translate3d(${rand(-260, 260)}px, ${rand(-200, 40)}px, 0) rotate(${rand(-220, 220)}deg)` },
            { transform: el.style.transform || 'none' },
          ],
          { duration: 900 + i * 60, easing: 'cubic-bezier(.34,1.6,.44,1)' },
        );
      });
    };
    window.addEventListener('wobbl:fastscroll', onFast);
    return () => window.removeEventListener('wobbl:fastscroll', onFast);
  }, []);

  return (
    <section id="hero" className="hero" ref={stage}>
      <div className="hero-bg" aria-hidden>
        <span className="hb hb1" /><span className="hb hb2" /><span className="hb hb3" /><span className="hb hb4" />
      </div>

      {/* floating cast */}
      {ORBIT.map((o, i) => (
        <div
          key={o.id}
          className="hero-orbit"
          style={{ left: `${o.x}%`, top: `${o.y}%`, width: `clamp(56px, ${9 * o.s}vw, ${150 * o.s}px)` }}
          ref={(el) => { orbitRefs.current[i] = el; }}
        >
          <div
            className="toy-float hero-orbit-inner"
            style={{ ['--dur' as string]: `${o.dur}s`, ['--delay' as string]: `${i * .6}s`, ['--rot' as string]: `${(i % 2 ? 1 : -1) * 8}deg` }}
            data-cursor="view"
            onPointerDown={() => { play('pop'); }}
            onClick={() => openSheet(o.id)}
          >
            <ProductShot product={o.id} colorway={o.cw} sizes="(max-width: 700px) 24vw, 150px" />
          </div>
        </div>
      ))}

      <div className="hero-inner">
        <div className="hero-top">
          <Sticker rotate={-5} tone="c">NUEVO · ROBOT MODULAR EN ÁMBAR</Sticker>
        </div>

        <SplitHeading tag="h1" text="JUGAR NO" className="t-mega hero-line hero-line-1" />

        <div className="hero-mid">
          <div className="hero-toy" ref={botWrap} data-cursor="play">
            <Toy
              kind="bot"
              body="#FF4433"
              accent="#FFCE00"
              extra="#2B2BFF"
              look={look}
              active={active}
              onPart={react}
            />
            <span className="hero-toy-tip label">TOCA SUS PIEZAS</span>
          </div>
        </div>

        <SplitHeading tag="h2" text="TIENE REGLAS." className="t-mega hero-line hero-line-2" />

        <div className="hero-foot">
          <ToyButton size="lg" tone="b" shape="chunk" onClick={onExplore} cursor="play">
            VER LA COLECCIÓN
            <span className="hero-btn-knob" aria-hidden />
          </ToyButton>
          <p className="hero-note body-copy">
            {PRODUCTS.length} piezas. {PRODUCTS.reduce((n, p) => n + p.colorways.length, 0)} combinaciones
            de color. Sopladas a mano, de una en una, y ninguna sale igual que la anterior.
          </p>
        </div>
      </div>

      {/* the hidden star — chaos mode */}
      <button
        className={`hero-star ${starFound ? 'found' : ''}`}
        aria-label="Una estrella escondida"
        data-cursor="press"
        onClick={() => { setStarFound(true); startChaos(); window.setTimeout(() => setStarFound(false), 6000); }}
        type="button"
      >
        <svg viewBox="0 0 100 100"><path d="M50 4 61 36h34L67 56l11 34-28-21-28 21 11-34L5 36h34z" /></svg>
      </button>

      <div className="hero-scroll" aria-hidden>
        <span>BAJA</span>
        <i />
      </div>

      {pops.map((p) => (
        <span key={p.id} className="hero-pop" style={{ left: p.x, top: p.y }} aria-hidden>{p.word}</span>
      ))}
    </section>
  );
}
