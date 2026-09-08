'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Toy from '@/components/Toy';
import { SplitHeading, Sticker, ToyButton } from '@/components/ui';
import { PRODUCTS, type Product } from '@/data/catalog';
import { play } from '@/lib/sound';
import { useShop } from '@/lib/store';
import { useIsTouch } from '@/lib/hooks';
import { HowTo } from '@/components/HowTo';

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

/** Where each toy sits in the room. Depth drives scale + parallax. */
const PLACEMENT = [
  { x: 27, y: 60, s: 1.00, depth: 1.0, shelf: false },
  { x: 36, y: 28, s: .72, depth: 0.55, shelf: true },
  { x: 45, y: 66, s: 1.14, depth: 1.25, shelf: false },
  { x: 54, y: 27, s: .78, depth: 0.6, shelf: true },
  { x: 62, y: 62, s: 1.02, depth: 1.05, shelf: false },
  { x: 70, y: 30, s: .82, depth: 0.65, shelf: true },
  { x: 78, y: 65, s: 1.1, depth: 1.2, shelf: false },
  { x: 86, y: 29, s: .8, depth: 0.62, shelf: true },
];

export default function CollectionSection() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const [openId, setOpenId] = useState<string | null>(null);
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

  const open = PRODUCTS.find((p) => p.id === openId) || null;

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
          <Sticker rotate={-4} tone="c">SECCIÓN 02 — LA HABITACIÓN</Sticker>
          <SplitHeading text="AQUÍ VIVEN" className="t-big" />
          <SplitHeading text="TODOS." className="t-big col-intro-2" sticker />
          <p className="body-copy col-intro-copy">
            Sin cuadrículas ni filtros: una habitación. Recórrela{touch ? ' deslizando de lado' : ' bajando'} y
            toca el juguete que te llame la atención.
          </p>
          <HowTo
            steps={[touch ? 'Desliza por la sala' : 'Baja para avanzar', 'Toca un juguete', 'Gíralo y guárdalo']}
            active={openId ? 2 : hover ? 1 : 0}
            className="col-howto"
          />
          <span className="col-arrow" aria-hidden>{touch ? 'DESLIZA →' : 'SIGUE BAJANDO →'}</span>
        </div>

        {PRODUCTS.map((p, i) => {
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
              onClick={() => { play('whoosh'); setOpenId(p.id); }}
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
          <SplitHeading text="TODA LA SALA." className="t-big col-outro-2" />
          <p className="body-copy">Ocho objetos. Nada de relleno. Si no sobrevivió a seis meses de prototipos, no está aquí.</p>
        </div>
      </div>

      {open && <ProductDetail product={open} onClose={() => { play('click'); setOpenId(null); }} />}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * The camera pushes in on one toy. Drag it to turn it around.
 * ------------------------------------------------------------------ */
function ProductDetail({ product, onClose }: { product: Product; onClose: () => void }) {
  const { add } = useShop();
  const [cw, setCw] = useState(0);
  const [turn, setTurn] = useState(0);
  const drag = useRef<{ on: boolean; x: number; start: number }>({ on: false, x: 0, start: 0 });
  const stage = useRef<HTMLDivElement>(null);
  const c = product.colorways[cw];

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    gsap.fromTo('.pd-card', { scale: .82, y: 60, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: .55, ease: 'back.out(1.7)' });
    gsap.fromTo('.pd-meta > *', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .4, stagger: .06, delay: .18, ease: 'power2.out' });
  }, [product.id]);

  // A 2D toy turned in 3D: reads as a real object being rotated in the hand.
  const rot = turn % 360;
  const flipped = rot > 90 && rot < 270;

  return (
    <div className="pd" role="dialog" aria-modal="true" aria-label={product.name}>
      <button className="pd-scrim" onClick={onClose} aria-label="Cerrar" data-cursor="press" type="button" />
      <div className="pd-card">
        <div
          className="pd-stage"
          ref={stage}
          style={{ background: c.extra }}
          data-cursor="drag"
          onPointerDown={(e) => {
            drag.current = { on: true, x: e.clientX, start: turn };
            try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch { /* no capture available */ }
            play('clack');
          }}
          onPointerMove={(e) => {
            if (!drag.current.on) return;
            setTurn(drag.current.start + (e.clientX - drag.current.x) * 0.9);
          }}
          onPointerUp={() => { drag.current.on = false; }}
          onPointerCancel={() => { drag.current.on = false; }}
        >
          <div
            className="pd-toy"
            style={{
              transform: `perspective(900px) rotateY(${rot}deg) scaleX(${flipped ? -1 : 1})`,
            }}
          >
            <Toy
              kind={product.kind}
              body={c.body}
              accent={c.accent}
              extra={c.extra}
              look={{ x: Math.sin((rot * Math.PI) / 180) * .8, y: 0 }}
              spin={rot}
            />
          </div>
          <span className="pd-drag-hint label">ARRASTRA PARA GIRARLO · 360°</span>
          {/* Lives inside the stage: on a phone the stage is sticky, so the
              close button stays reachable however far you scroll the sheet. */}
          <button
            className="pd-x"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            data-cursor="press"
            type="button"
            aria-label="Cerrar"
          >✕</button>
        </div>

        <div className="pd-meta">
          <span className="label pd-sub">{product.sub}</span>
          <h3 className="t-big pd-name">{product.name}</h3>
          <p className="body-copy pd-blurb">{product.blurb}</p>

          <div className="pd-specs">
            <span><i>EDAD</i><b>{product.ages}</b></span>
            <span><i>CONTIENE</i><b>{product.pieces}</b></span>
            <span><i>PRECIO</i><b>{product.price} €</b></span>
          </div>

          <div className="pd-colors">
            <span className="label">COLOR · {c.name}</span>
            <div className="pd-swatches">
              {product.colorways.map((k, i) => (
                <button
                  key={k.name}
                  className={`pd-swatch ${i === cw ? 'on' : ''}`}
                  style={{ ['--sw' as string]: k.body, ['--sw2' as string]: k.accent }}
                  onClick={() => { setCw(i); play('pop'); }}
                  data-cursor="press"
                  aria-label={k.name}
                  type="button"
                />
              ))}
            </div>
          </div>

          <ToyButton
            size="lg" tone="d" shape="chunk"
            cursor="grab"
            onClick={() => { add(product, cw, stage.current?.getBoundingClientRect()); onClose(); }}
          >
            METER EN MI CAJA · {product.price} €
          </ToyButton>
        </div>
      </div>
    </div>
  );
}
