'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Toy from '@/components/Toy';
import { ToyButton } from '@/components/ui';
import { type Product } from '@/data/catalog';
import { has3D } from '@/components/three/models';
import dynamic from 'next/dynamic';
import { play } from '@/lib/sound';
import { useShop } from '@/lib/store';

/* El visor 3D se carga solo al abrir una ficha que tenga modelo: three
   pesa demasiado para meterlo en el arranque de la página. */
const ProductViewer = dynamic(() => import('@/components/three/ProductViewer'), {
  ssr: false,
  loading: () => <span className="pd-loading label">CARGANDO PIEZA…</span>,
});

/* ------------------------------------------------------------------ *
 * The camera pushes in on one toy. Drag it to turn it around.
 * ------------------------------------------------------------------ */
export default function ProductDetail({ product, onClose }: { product: Product; onClose: () => void }) {
  const { add } = useShop();
  const [cw, setCw] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const c = product.colorways[cw];
  const threeD = has3D(product.kind);

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

  return (
    <div className="pd" role="dialog" aria-modal="true" aria-label={product.name}>
      <button className="pd-scrim" onClick={onClose} aria-label="Cerrar" data-cursor="press" type="button" />
      <div className="pd-card">
        <div
          className={`pd-stage ${threeD ? 'is-3d' : ''}`}
          ref={stage}
          /* Fondo blanco siempre. Antes tomaba el tercer color de la gama y
             el plató cambiaba con cada juguete: en un catálogo la luz y el
             fondo son constantes y lo único que cambia es el producto. */
          style={{ background: '#ffffff' }}
          data-cursor={threeD ? "drag" : "view"}
        >
          {threeD ? (
            <div className="pd-3d">
              <ProductViewer kind={product.kind} colorway={c} />
            </div>
          ) : (
            <div className="pd-toy">
              <Toy
                kind={product.kind}
                body={c.body}
                accent={c.accent}
                extra={c.extra}
                look={{ x: 0, y: 0 }}
              />
            </div>
          )}
          <span className="pd-drag-hint label">
            {threeD ? 'PRODUCTO EN 3D · ARRÁSTRALO PARA GIRARLO' : 'PIEZA EN PREPARACIÓN'}
          </span>
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
            <span><i>ALTURA</i><b>{product.size}</b></span>
            <span><i>TÉCNICA</i><b>{product.pieces}</b></span>
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
