'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GL_SETTINGS } from './Studio';
import { ProductStage } from './ProductStage';
import { MODELS } from './models';
import type { Colorway, ToyKind } from '@/data/catalog';

/**
 * El visor de la ficha: el producto de verdad, girable con la mano.
 * Es el único sitio de la web donde vive un lienzo WebGL propio, y solo
 * mientras la ficha está abierta — el navegador no aguanta un contexto
 * por tarjeta, y con la estantería entera abierta se queda sin ninguno.
 */
export default function ProductViewer({
  kind, colorway, autoRotate = true,
}: { kind: ToyKind; colorway: Colorway; autoRotate?: boolean }) {
  const Model = MODELS[kind];
  if (!Model) return null;
  return (
    <Canvas shadows dpr={[1, 2]} gl={GL_SETTINGS} style={{ touchAction: 'none' }}>
      <ProductStage>
        <Model body={colorway.body} accent={colorway.accent} extra={colorway.extra} spin={0} />
      </ProductStage>
      <OrbitControls
        makeDefault
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={0.9}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={0.6}
        maxDistance={4}
      />
    </Canvas>
  );
}
