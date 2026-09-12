'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Toy from '@/components/Toy';
import { SplitHeading, Sticker } from '@/components/ui';
import { PALETTES, applyPalette, type Palette } from '@/lib/theme';
import { play } from '@/lib/sound';
import { useShop } from '@/lib/store';

/**
 * The colour lab. Picking a chip repaints the document — background, type,
 * shapes, shadows and every toy on screen — through the same CSS variables
 * the rest of the site reads from. Nothing here is a local override.
 */
export default function ColorsSection({ onPick }: { onPick: (p: Palette) => void }) {
  const { openSheet } = useShop();
  const [active, setActive] = useState(0);
  const [ripple, setRipple] = useState<{ id: number; x: number; y: number; color: string } | null>(null);
  const rid = useRef(1);
  // React can replay a state updater with its original base value, so the
  // repaint must never live inside one — it reads the index from a ref instead.
  const activeRef = useRef(0);
  useEffect(() => { activeRef.current = active; }, [active]);

  function choose(i: number, e?: React.MouseEvent) {
    const p = PALETTES[i];
    applyIndex(i);
    play('pop');
    if (e) {
      setRipple({ id: rid.current++, x: e.clientX, y: e.clientY, color: p.bg });
      window.setTimeout(() => setRipple(null), 800);
    }
  }

  /** Repaint the document and tell the page a human chose this. */
  const applyIndex = useCallback((i: number) => {
    const p = PALETTES[i];
    activeRef.current = i;
    setActive(i);
    applyPalette(p);
    onPick(p);
  }, [onPick]);

  // Idle drift: if nobody touches it, the lab keeps changing on its own.
  useEffect(() => {
    let idle = 0;
    const start = () => {
      window.clearInterval(idle);
      idle = window.setInterval(() => applyIndex((activeRef.current + 1) % PALETTES.length), 5200);
    };
    const el = document.getElementById('colors');
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        // Repaint on arrival — the readout must never disagree with the page.
        applyIndex(activeRef.current);
        start();
      } else {
        window.clearInterval(idle);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); window.clearInterval(idle); };
  }, [applyIndex]);

  const p = PALETTES[active];

  return (
    <section id="colors" className="scene colors">
      <div className="colors-head">
        <Sticker rotate={4} tone="a">SECCIÓN 03 — EL LABORATORIO DE COLOR</Sticker>
        <SplitHeading text="CAMBIA" className="t-mega colors-h" />
        <SplitHeading text="EL MUNDO." className="t-mega colors-h colors-h2" sticker />
      </div>

      <div className="colors-stage">
        <div className="colors-toys">
          {(['bot', 'dino', 'rocket'] as const).map((k, i) => (
            <div
              key={k}
              className="colors-toy toy-float"
              style={{ ['--dur' as string]: `${6 + i}s`, ['--delay' as string]: `${i * .5}s` }}
              data-cursor="view"
              onPointerDown={() => play('boing')}
              onClick={() => openSheet(k)}
            >
              <Toy
                kind={k}
                body={[p.a, p.b, p.d][i]}
                accent={[p.c, p.c, p.a][i]}
                extra={[p.b, p.d, p.c][i]}
                look={{ x: 0, y: 0 }}
              />
            </div>
          ))}
        </div>

        <div className="colors-readout">
          <span className="label">MUNDO ACTUAL</span>
          <strong className="colors-name">{p.name}</strong>
          <span className="colors-hex">{p.bg} · {p.a} · {p.b} · {p.c}</span>
        </div>
      </div>

      <div className="colors-tray" role="group" aria-label="Elige el color del mundo">
        {PALETTES.map((pal, i) => (
          <button
            key={pal.id}
            className={`chip ${i === active ? 'on' : ''}`}
            style={{ ['--chip' as string]: pal.bg, ['--chip2' as string]: pal.a, ['--chip3' as string]: pal.b }}
            onClick={(e) => choose(i, e)}
            onPointerEnter={() => play('click')}
            data-cursor="press"
            title={pal.name}
            type="button"
          >
            <span className="chip-face" />
            <span className="chip-name">{pal.name}</span>
          </button>
        ))}
      </div>

      <p className="body-copy colors-note">
        Cada juguete WOBBL sale en tres combinaciones de color porque una nunca iba a bastar.
        Pulsa una ficha y la web entera cambia con ella.
      </p>

      {ripple && (
        <span
          key={ripple.id}
          className="colors-ripple"
          style={{ left: ripple.x, top: ripple.y, background: ripple.color }}
          aria-hidden
        />
      )}
    </section>
  );
}
