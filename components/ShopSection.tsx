'use client';

import { useRef, useState } from 'react';
import Toy from '@/components/Toy';
import { SplitHeading, Sticker, ToyButton } from '@/components/ui';
import { PRODUCTS, type Product } from '@/data/catalog';
import { useShop } from '@/lib/store';
import { play } from '@/lib/sound';
import { useIsTouch } from '@/lib/hooks';

export default function ShopSection() {
  const { setBoxOpen, count } = useShop();
  return (
    <section id="shop" className="scene shop" data-palette="cream">
      <div className="shop-head">
        <div>
          <Sticker rotate={-3} tone="b">SECCIÓN 08 — LA ESTANTERÍA</Sticker>
          <SplitHeading text="LLÉVATE" className="t-huge" />
          <SplitHeading text="UNO A CASA." className="t-huge shop-h2" />
        </div>
        <div className="shop-head-side">
          <p className="body-copy">
            Todas las cajas se abren. Levanta la tapa, gira el juguete, elige color y mételo
            en tu caja. Sale en 48 horas, empaquetado por alguien que también juega con ellos.
          </p>
          <ToyButton size="sm" tone="fg" onClick={() => { play('clack'); setBoxOpen(true); }} cursor="open">
            ABRIR MI CAJA ({count})
          </ToyButton>
        </div>
      </div>

      <div className="shelf">
        <div className="shelf-row">
          {PRODUCTS.slice(0, 4).map((p) => <ToyBoxCard key={p.id} product={p} />)}
        </div>
        <span className="shelf-plank" aria-hidden />
        <div className="shelf-row">
          {PRODUCTS.slice(4).map((p) => <ToyBoxCard key={p.id} product={p} />)}
        </div>
        <span className="shelf-plank" aria-hidden />
      </div>

      <p className="shop-fine">
        ENVÍO GRATIS DESDE 70 € · 30 DÍAS PARA DEVOLVER · CERTIFICADO CE · RECAMBIOS PARA SIEMPRE
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * A product card shaped like the actual packaging. Hovering lifts the
 * lid; the toy rises out of the box and the whole card changes colour.
 * ------------------------------------------------------------------ */
function ToyBoxCard({ product }: { product: Product }) {
  const { add } = useShop();
  const [cw, setCw] = useState(0);
  const [open, setOpen] = useState(false);
  const [turn, setTurn] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef({ on: false, x: 0, start: 0 });
  const touch = useIsTouch();
  const c = product.colorways[cw];

  const flipped = ((turn % 360) + 360) % 360 > 90 && ((turn % 360) + 360) % 360 < 270;

  return (
    <article
      className={`tbx ${open ? 'open' : ''}`}
      style={{ ['--box' as string]: c.extra, ['--body' as string]: c.body, ['--acc' as string]: c.accent }}
      onPointerEnter={() => { if (!touch) { setOpen(true); play('clack'); } }}
      onPointerLeave={() => { if (!touch) setOpen(false); }}
      data-cursor="grab"
    >
      <div className="tbx-box" ref={box}>
        <span className="tbx-lid" aria-hidden>
          <span className="tbx-lid-face">WOBBL</span>
        </span>
        <span className="tbx-back" aria-hidden />

        <div
          className="tbx-toy"
          style={{ transform: `perspective(700px) rotateY(${turn}deg) scaleX(${flipped ? -1 : 1})` }}
          onPointerDown={(e) => {
            drag.current = { on: true, x: e.clientX, start: turn };
            try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch { /* no capture available */ }
            if (touch) setOpen((o) => !o);
          }}
          onPointerMove={(e) => { if (drag.current.on) setTurn(drag.current.start + (e.clientX - drag.current.x) * .8); }}
          onPointerUp={() => { drag.current.on = false; }}
          onPointerCancel={() => { drag.current.on = false; }}
        >
          <Toy kind={product.kind} body={c.body} accent={c.accent} extra={c.extra} look={{ x: open ? .4 : 0, y: open ? -.2 : 0 }} spin={turn} shadow={false} />
        </div>

        <span className="tbx-tag" aria-hidden>
          <b>{product.name}</b>
          <i>{product.ages}</i>
        </span>
      </div>

      <div className="tbx-meta">
        <div className="tbx-line">
          <h3 className="tbx-name">{product.name}</h3>
          <span className="tbx-price">{product.price} €</span>
        </div>
        <p className="tbx-sub">{product.sub} · {product.pieces}</p>

        <div className="tbx-foot">
          <div className="tbx-swatches">
            {product.colorways.map((k, i) => (
              <button
                key={k.name}
                className={`tbx-sw ${i === cw ? 'on' : ''}`}
                style={{ ['--sw' as string]: k.body, ['--sw2' as string]: k.accent }}
                onClick={() => { setCw(i); play('pop'); }}
                data-cursor="press"
                aria-label={`${product.name} en ${k.name}`}
                type="button"
              />
            ))}
          </div>
          <button
            className="tbx-add"
            onClick={() => add(product, cw, box.current?.getBoundingClientRect())}
            data-cursor="grab"
            type="button"
          >
            LO QUIERO
            <span aria-hidden>+</span>
          </button>
        </div>
      </div>
    </article>
  );
}
