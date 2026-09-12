'use client';

import { useMemo, useRef, useState } from 'react';
import Toy from '@/components/Toy';
import { SplitHeading, Sticker, ToyButton } from '@/components/ui';
import { CATEGORIES, PRODUCTS, type CategoryId, type Product } from '@/data/catalog';
import { useShop } from '@/lib/store';
import { play } from '@/lib/sound';
import { useIsTouch } from '@/lib/hooks';

/** Cuatro por balda: la estantería se construye sola a partir del catálogo. */
const PER_SHELF = 4;
function shelves(list: Product[]) {
  const rows: Product[][] = [];
  for (let i = 0; i < list.length; i += PER_SHELF) rows.push(list.slice(i, i + PER_SHELF));
  return rows;
}

export default function ShopSection() {
  const { setBoxOpen, count, openSheet } = useShop();
  const [filter, setFilter] = useState<CategoryId | 'todo'>('todo');

  const list = useMemo(
    () => (filter === 'todo' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter],
  );
  const line = CATEGORIES.find((c) => c.id === filter)?.line;

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
            {PRODUCTS.length} juguetes y todas las cajas se abren. Levanta la tapa, gira el juguete,
            elige color y mételo en tu caja. Sale en 48 horas, empaquetado por alguien que
            también juega con ellos.
          </p>
          <ToyButton size="sm" tone="fg" onClick={() => { play('clack'); setBoxOpen(true); }} cursor="open">
            ABRIR MI CAJA ({count})
          </ToyButton>
        </div>
      </div>

      <div className="shop-filters" role="group" aria-label="Filtrar por tipo de juguete">
        <button
          type="button"
          className={`shop-chip ${filter === 'todo' ? 'on' : ''}`}
          onClick={() => { setFilter('todo'); play('click'); }}
          data-cursor="press"
        >
          TODO <i>{PRODUCTS.length}</i>
        </button>
        {CATEGORIES.map((c) => {
          const n = PRODUCTS.filter((p) => p.category === c.id).length;
          return (
            <button
              key={c.id}
              type="button"
              className={`shop-chip ${filter === c.id ? 'on' : ''}`}
              onClick={() => { setFilter(c.id); play('click'); }}
              data-cursor="press"
            >
              {c.name} <i>{n}</i>
            </button>
          );
        })}
      </div>
      <p className="shop-filter-line">{line ?? 'Todo lo que sale de la fábrica, en una sola pared.'}</p>

      <div className="shelf">
        {shelves(list).map((row, i) => (
          <div key={`${filter}-${i}`} className="shelf-bay">
            <div className="shelf-row">
              {row.map((p) => <ToyBoxCard key={p.id} product={p} onOpen={() => openSheet(p.id)} />)}
            </div>
            <span className="shelf-plank" aria-hidden />
          </div>
        ))}
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
function ToyBoxCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const { add } = useShop();
  const [cw, setCw] = useState(0);
  const [open, setOpen] = useState(false);
  const [turn, setTurn] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  // `moved` acumula el recorrido del puntero: si apenas se ha movido es
  // un clic para abrir la ficha, y si no, es un arrastre para girar.
  const drag = useRef({ on: false, x: 0, start: 0, moved: 0 });
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
          data-cursor="view"
          onPointerDown={(e) => {
            drag.current = { on: true, x: e.clientX, start: turn, moved: 0 };
            try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch { /* no capture available */ }
            if (touch) setOpen(true);
          }}
          onPointerMove={(e) => {
            if (!drag.current.on) return;
            const dx = e.clientX - drag.current.x;
            drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
            setTurn(drag.current.start + dx * .8);
          }}
          onPointerUp={() => {
            const wasDrag = drag.current.moved > 6;
            drag.current.on = false;
            if (!wasDrag) onOpen();
          }}
          onPointerCancel={() => { drag.current.on = false; }}
        >
          <Toy kind={product.kind} body={c.body} accent={c.accent} extra={c.extra} look={{ x: open ? .4 : 0, y: open ? -.2 : 0 }} spin={turn} shadow={false} />
        </div>

        <span className="tbx-tag" aria-hidden>
          <b>{product.name}</b>
          <i>{product.size}</i>
        </span>
        <button
          className="tbx-open"
          type="button"
          onClick={onOpen}
          data-cursor="view"
        >
          VER FICHA
        </button>
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
