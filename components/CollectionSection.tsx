'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Toy from '@/components/Toy';
import { SplitHeading, Sticker } from '@/components/ui';
import { FEATURED, PRODUCTS } from '@/data/catalog';
import { play } from '@/lib/sound';
import { useIsTouch } from '@/lib/hooks';
import { HowTo } from '@/components/HowTo';
import { useShop } from '@/lib/store';

/* Wallpaper shapes, laid out deterministically so server and client agree. */
const WALLPAPER = Array.from({ length: 34 }, (_, i) => {
  const g = (i * 2654435761) % 1000 / 1000;
  const g2 = (i * 40503) % 997 / 997;
  return {
    x: 2 + ((i * 3.1) % 96),
    y: 6 + g * 74,
    s: 26 + g2 * 62,
    r: i % 3 === 0 ? '22%' : '50%',
    dash: i % 4 === 0,
  };
});

/**
 * Where each toy sits in the room. Generated from the featured list so the
 * room never has to be re-laid-out by hand when the catalogue grows: odd
 * positions go up on a shelf, even ones stand on the floor, and depth drives
 * both the scale and how far the toy travels under parallax.
 */
const PLACEMENT = FEATURED.map((_, i) => {
  const t = FEATURED.length > 1 ? i / (FEATURED.length - 1) : 0;
  const shelf = i % 2 === 1;
  return {
    x: 20 + t * 68,
    y: shelf ? 27 + (i % 4) : 60 + (i % 3) * 3,
    s: shelf ? 0.74 + (i % 3) * 0.05 : 1.0 + (i % 3) * 0.07,
    depth: shelf ? 0.55 + (i % 3) * 0.05 : 1.0 + (i % 3) * 0.12,
    shelf,
  };
});

export default function CollectionSection() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const { openSheet, sheet } = useShop();
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    if (touch) return;
    const el = track.current;
    const container = wrap.current;
    if (!el || !container) return;

    const ctx = gsap.context(() => {
      const distance = () => el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${distance() * 1.05}`,
          pin: true,
          scrub: 0.85,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      // Depth parallax: near toys travel further than the ones on high shelves.
      gsap.utils.toArray<HTMLElement>('.col-item').forEach((item) => {
        const d = Number(item.dataset.depth || 1);
        gsap.to(item, {
          xPercent: (1 - d) * 26,
          ease: 'none',
          scrollTrigger: { containerAnimation: tween, trigger: item, start: 'left right', end: 'right left', scrub: true },
        });
      });
    }, container);

    return () => ctx.revert();
  }, [touch]);


  return (
    <section id="collection" className="collection" ref={wrap} data-palette="ink">
      <div className="col-room" ref={track}>
        {/* wallpaper + floor */}
        <div className="col-wall" aria-hidden>
          {WALLPAPER.map((d, i) => (
            <span key={i} className="col-dot" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, borderRadius: d.r, borderStyle: d.dash ? 'dashed' : 'solid' }} />
          ))}
          <span className="col-horizon" />
        </div>

        <div className="col-intro">
          <Sticker rotate={-4} tone="c">SECCIÓN 02 — LA VITRINA</Sticker>
          <SplitHeading text="AQUÍ VIVEN" className="t-big" />
          <SplitHeading text="TODOS." className="t-big col-intro-2" sticker />
          <p className="body-copy col-intro-copy">
            Sin cuadrículas ni filtros: una vitrina con las {FEATURED.length} de siempre.
            Recórrela{touch ? ' deslizando de lado' : ' bajando'} y toca la pieza que te llame la atención.
          </p>
          <HowTo
            steps={[touch ? 'Desliza por la vitrina' : 'Baja para avanzar', 'Toca una pieza', 'Gírala y guárdala']}
            active={sheet ? 2 : hover ? 1 : 0}
            className="col-howto"
          />
          <span className="col-arrow" aria-hidden>{touch ? 'DESLIZA →' : 'SIGUE BAJANDO →'}</span>
        </div>

        {FEATURED.map((p, i) => {
          const pl = PLACEMENT[i];
          const cw = p.colorways[0];
          return (
            <div
              key={p.id}
              className={`col-item ${pl.shelf ? 'on-shelf' : 'on-floor'} ${hover === p.id ? 'hot' : ''}`}
              data-depth={pl.depth}
              style={{ left: `${pl.x}%`, top: `${pl.y}%`, ['--s' as string]: pl.s }}
              onPointerEnter={() => { setHover(p.id); play('click'); }}
              onPointerLeave={() => setHover(null)}
              onClick={() => openSheet(p.id)}
              data-cursor="view"
            >
              {pl.shelf && <span className="col-shelf" aria-hidden />}
              <div className="col-toy">
                <Toy
                  kind={p.kind}
                  body={cw.body}
                  accent={cw.accent}
                  extra={cw.extra}
                  look={{ x: hover === p.id ? .5 : 0, y: 0 }}
                  spin={hover === p.id ? 40 : 0}
                />
              </div>
              <span className="col-tag">
                <b>{p.name}</b>
                <i>{p.price} €</i>
              </span>
            </div>
          );
        })}

        <div className="col-outro">
          <SplitHeading text="Y ESTA ES" className="t-big" />
          <SplitHeading text="LA VITRINA." className="t-big col-outro-2" />
          <p className="body-copy">
            {FEATURED.length} piezas, y en la estantería esperan {PRODUCTS.length - FEATURED.length} más.
            Nada de relleno: si no salió entera del recocido, no está aquí.
          </p>
        </div>
      </div>
    </section>
  );
}
