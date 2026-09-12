'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { GL_SETTINGS } from '@/components/three/Studio';
import { ProductStage } from '@/components/three/ProductStage';
import { MODELS } from '@/components/three/models';
import { PRODUCTS, type ToyKind } from '@/data/catalog';


function Cell({ kind }: { kind: ToyKind }) {
  const product = PRODUCTS.find((p) => p.kind === kind)!;
  const c = product.colorways[0];
  const Model = MODELS[kind]!;
  return (
    <div style={{ background: '#efeae1', borderRadius: 14, overflow: 'hidden', aspectRatio: '4/3' }}>
      <Canvas shadows dpr={[1, 2]} gl={{ ...GL_SETTINGS, preserveDrawingBuffer: true }}>
        <ProductStage>
          <Model body={c.body} accent={c.accent} extra={c.extra} spin={0} />
        </ProductStage>
      </Canvas>
      <div style={{ font: '700 12px system-ui', padding: '6px 10px', color: '#100C14' }}>
        {product.name} · {kind}
      </div>
    </div>
  );
}

function Grid() {
  const params = useSearchParams();
  const only = params.get('k')?.split(',') ?? null;
  const solo = params.get('solo');
  const kinds = (Object.keys(MODELS) as ToyKind[]).filter((k) => !only || only.includes(k));

  if (solo) {
    const product = PRODUCTS.find((p) => p.kind === solo)!;
    const c = product.colorways[Number(params.get('cw') ?? 0)];
    const Model = MODELS[solo as ToyKind]!;
    return (
      <div style={{ height: '100vh', background: '#efeae1' }}>
        <Canvas shadows dpr={[1, 2]} gl={{ ...GL_SETTINGS, preserveDrawingBuffer: true }}>
        <ProductStage>
            <Model body={c.body} accent={c.accent} extra={c.extra} spin={0} />
          </ProductStage>
          <OrbitControls makeDefault enablePan={false} minDistance={0.4} maxDistance={5} />
        </Canvas>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: 16, background: '#f7f3ec' }}>
      {kinds.map((k) => <Cell key={k} kind={k} />)}
    </div>
  );
}

export default function Dev3D() {
  return <Suspense><Grid /></Suspense>;
}
