'use client';

import { Bounds, Center, useBounds } from '@react-three/drei';
import { useEffect } from 'react';
import { StudioRig, ProductCamera } from './Studio';

/**
 * El encuadre. Un cohete mide medio metro de alto y un coche medio de
 * largo: con una distancia de cámara fija, uno se sale y el otro queda
 * diminuto. `Center` apoya la pieza en el suelo y `Bounds` calcula la
 * distancia para que llene el cuadro igual en los veintiocho.
 */
/**
 * Reencuadra cuando cambia la pieza. Hace falta para el horneado de
 * fichas: allí el lienzo NO se remonta —remontarlo 84 veces agota los
 * contextos WebGL del navegador— así que lo único que cambia es el
 * modelo de dentro, y `Bounds` por sí solo no se entera.
 */
function Refit({ on }: { on: string }) {
  const bounds = useBounds();
  useEffect(() => { bounds.refresh().clip().fit(); }, [on, bounds]);
  return null;
}

export function ProductStage({
  children, margin = 1.15, yaw = 0.62, shadows = true, bg = '#ffffff', refitKey,
}: { children: React.ReactNode; margin?: number; yaw?: number; shadows?: boolean; bg?: string | null; refitKey?: string }) {
  return (
    <>
      {/* Poco más de veinte grados sobre el objeto: es la altura de una
          foto de catálogo. Desde más arriba se lee como un plano cenital. */}
      <ProductCamera yaw={yaw} distance={2} height={0.78} />
      <StudioRig shadows={shadows} bg={bg} />
      <Bounds fit clip observe margin={margin}>
        {refitKey !== undefined && <Refit on={refitKey} />}
        <Center bottom>{children}</Center>
      </Bounds>
    </>
  );
}
