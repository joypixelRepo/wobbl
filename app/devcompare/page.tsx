'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import Toy from '@/components/Toy';
import { GL_SETTINGS } from '@/components/three/Studio';
import { ProductStage } from '@/components/three/ProductStage';
import { MODELS } from '@/components/three/models';
import { PRODUCTS } from '@/data/catalog';

/**
 * Ruta de trabajo: el dibujo vectorial y el modelo 3D del mismo
 * producto, uno al lado del otro. Sirve para que los dos digan lo
 * mismo. Va de seis en seis porque el navegador corta alrededor de
 * dieciséis contextos WebGL.
 */
function Grid() {
  const q = useSearchParams().get('k');
  const list = q ? PRODUCTS.filter((p) => q.split(',').includes(p.kind)) : PRODUCTS.slice(0, 6);

  return (
    <div style={{ background: '#f3f0ea', padding: 16, display: 'grid', gap: 14 }}>
      {list.map((p) => {
        const c = p.colorways[0];
        const Model = MODELS[p.kind];
        return (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, alignItems: 'center', background: '#fff', borderRadius: 14, padding: 10 }}>
            <div style={{ display: 'grid', placeItems: 'center', aspectRatio: '4/3' }}>
              <div style={{ width: '78%' }}>
                <Toy kind={p.kind} body={c.body} accent={c.accent} extra={c.extra} />
              </div>
            </div>
            <div style={{ aspectRatio: '4/3' }}>
              {Model && (
                <Canvas shadows dpr={1} gl={GL_SETTINGS}>
                  <ProductStage bg="#ffffff">
                    <Model body={c.body} accent={c.accent} extra={c.extra} spin={0} />
                  </ProductStage>
                </Canvas>
              )}
            </div>
            <div style={{ gridColumn: '1 / -1', font: '700 11px system-ui', letterSpacing: '.1em', color: '#100C14' }}>
              {p.name} · {p.kind} — IZQUIERDA vector · DERECHA 3D
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DevCompare() {
  return <Suspense><Grid /></Suspense>;
}
