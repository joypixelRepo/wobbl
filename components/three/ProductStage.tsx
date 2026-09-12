'use client';

import { Bounds, Center } from '@react-three/drei';
import { StudioRig, ProductCamera } from './Studio';

/**
 * El encuadre. Un cohete mide medio metro de alto y un coche medio de
 * largo: con una distancia de cámara fija, uno se sale y el otro queda
 * diminuto. `Center` apoya la pieza en el suelo y `Bounds` calcula la
 * distancia para que llene el cuadro igual en los veintiocho.
 */
export function ProductStage({
  children, margin = 1.15, yaw = 0.62, shadows = true,
}: { children: React.ReactNode; margin?: number; yaw?: number; shadows?: boolean }) {
  return (
    <>
      {/* Poco más de veinte grados sobre el objeto: es la altura de una
          foto de catálogo. Desde más arriba se lee como un plano cenital. */}
      <ProductCamera yaw={yaw} distance={2} height={0.78} />
      <StudioRig shadows={shadows} />
      <Bounds fit clip observe margin={margin}>
        <Center bottom>{children}</Center>
      </Bounds>
    </>
  );
}
