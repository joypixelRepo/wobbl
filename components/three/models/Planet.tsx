'use client';

import { RoundedCylinder } from '../parts';
import { PLASTIC, CAR_PAINT, CHROME } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * PUZLE ESFÉRICO — 32 segmentos, una sola solución.
 *
 * Los gajos se dibujan con aros hundidos en la esfera en lugar de
 * pintarse encima: una junta de puzle tiene profundidad, y es esa
 * sombra fina la que dice que la bola se abre.
 * ------------------------------------------------------------------ */
export default function Planet({ body, accent, extra, spin = 0 }: ModelProps) {
  const R = 0.215;
  const meridians = 8;

  return (
    <group position={[0, R + 0.028, 0]} rotation={[0, spin * 0.01, 0]}>
      {/* peana */}
      <RoundedCylinder radius={0.130} height={0.030} bevel={0.012} position={[0, -R - 0.014, 0]}>
        <meshPhysicalMaterial {...PLASTIC} color={extra} />
      </RoundedCylinder>

      {/* esfera */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[R, 64, 44]} />
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </mesh>

      {/* casquete polar en otro color: marca dónde empieza el puzle */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[R * 1.002, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.28]} />
        <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[R * 1.002, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.22]} />
        <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
      </mesh>

      {/* meridianos hundidos */}
      {Array.from({ length: meridians }, (_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i / meridians) * Math.PI]} castShadow>
          <torusGeometry args={[R * 0.998, 0.005, 8, 96]} />
          <meshPhysicalMaterial color="#000000" transparent opacity={0.35} roughness={0.9} />
        </mesh>
      ))}
      {/* paralelos del ecuador */}
      {[-0.072, 0.072].map((y) => {
        const r = Math.sqrt(Math.max(R * R - y * y, 0.0001));
        return (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[r * 0.998, 0.005, 8, 96]} />
            <meshPhysicalMaterial color="#000000" transparent opacity={0.35} roughness={0.9} />
          </mesh>
        );
      })}

      {/* anillo orbital, el detalle que lo convierte en planeta */}
      <group rotation={[0.32, 0, 0.26]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[R * 1.62, 0.020, 14, 96]} />
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[R * 1.62, 0.007, 10, 96]} />
          <meshPhysicalMaterial {...CHROME} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
