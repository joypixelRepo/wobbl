'use client';

import { RoundedBox } from '@react-three/drei';
import { RoundedCylinder, Lathe } from '../parts';
import { PLASTIC, CAR_PAINT, SOFT_PLASTIC, CHROME } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * CASTILLO MEDIEVAL — rastrillo de manivela y dos torres.
 *
 * Las almenas son piezas sueltas encima del muro, no una banda dentada
 * recortada: es lo que deja pasar la luz entre merlón y merlón y lo
 * que hace que la silueta se lea a contraluz.
 * ------------------------------------------------------------------ */
export default function Castle({ body, accent, extra, spin = 0 }: ModelProps) {
  const gate = Math.max(0, Math.sin(spin * 0.02)) * 0.115;

  const merlons = (cx: number, cz: number, r: number, n: number, y: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      return (
        <RoundedBox
          key={`${cx}:${cz}:${i}`}
          args={[0.044, 0.056, 0.034]}
          radius={0.008}
          smoothness={4}
          position={[cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]}
          rotation={[0, -a, 0]}
          castShadow
        >
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
      );
    });

  return (
    <group>
      {/* peana */}
      <RoundedBox args={[0.600, 0.030, 0.380]} radius={0.012} smoothness={4} position={[0, 0.015, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color={extra} />
      </RoundedBox>

      {/* muralla y torre del homenaje */}
      <RoundedBox args={[0.330, 0.270, 0.210]} radius={0.016} smoothness={5} position={[0, 0.165, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </RoundedBox>
      <RoundedBox args={[0.356, 0.026, 0.236]} radius={0.010} smoothness={4} position={[0, 0.312, 0]} castShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </RoundedBox>
      {[-0.130, -0.044, 0.044, 0.130].map((x) => (
        [0.104, -0.104].map((z) => (
          <RoundedBox key={`${x}:${z}`} args={[0.056, 0.056, 0.038]} radius={0.008} smoothness={4} position={[x, 0.352, z]} castShadow>
            <meshPhysicalMaterial {...CAR_PAINT} color={body} />
          </RoundedBox>
        ))
      ))}

      {/* torres cilíndricas */}
      {[-0.225, 0.225].map((x) => (
        <group key={x}>
          <RoundedCylinder radius={0.102} height={0.400} bevel={0.014} position={[x, 0.230, 0]} radial={40}>
            <meshPhysicalMaterial {...CAR_PAINT} color={body} />
          </RoundedCylinder>
          <RoundedCylinder radius={0.116} height={0.024} bevel={0.008} position={[x, 0.430, 0]} radial={40}>
            <meshPhysicalMaterial {...CAR_PAINT} color={body} />
          </RoundedCylinder>
          {merlons(x, 0, 0.098, 8, 0.468)}
          {/* tejado cónico */}
          <mesh position={[x, 0.560, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.125, 0.160, 24]} />
            <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
          </mesh>
          {/* asta y banderín */}
          <RoundedCylinder radius={0.006} height={0.100} bevel={0.002} position={[x, 0.690, 0]}>
            <meshPhysicalMaterial {...CHROME} roughness={0.35} />
          </RoundedCylinder>
          <mesh position={[x + 0.042, 0.716, 0]} rotation={[Math.PI / 2, 0, -Math.PI / 2]} castShadow>
            <coneGeometry args={[0.028, 0.080, 3]} />
            <meshPhysicalMaterial {...PLASTIC} color={accent} side={2} />
          </mesh>
          {/* saetera */}
          <RoundedBox args={[0.024, 0.070, 0.020]} radius={0.009} smoothness={4} position={[x, 0.280, 0.100]} castShadow>
            <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2a2732" />
          </RoundedBox>
        </group>
      ))}

      {/* arco y rastrillo */}
      <mesh position={[0, 0.150, 0.106]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.082, 0.082, 0.024, 24, 1, false, 0, Math.PI]} />
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#241f2b" />
      </mesh>
      <RoundedBox args={[0.164, 0.120, 0.024]} radius={0.006} smoothness={4} position={[0, 0.090, 0.106]}>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#241f2b" />
      </RoundedBox>
      <group position={[0, 0.090 + gate, 0.112]}>
        <RoundedBox args={[0.160, 0.150, 0.014]} radius={0.006} smoothness={4} castShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
        </RoundedBox>
        {[-0.050, 0, 0.050].map((x) => (
          <RoundedBox key={x} args={[0.010, 0.150, 0.020]} radius={0.004} smoothness={3} position={[x, 0, 0.004]}>
            <meshPhysicalMaterial {...CHROME} color="#4b4652" roughness={0.4} />
          </RoundedBox>
        ))}
      </group>
      {/* manivela del rastrillo */}
      <group position={[0.130, 0.268, 0.116]} rotation={[0, 0, spin * 0.03]}>
        <RoundedCylinder radius={0.010} height={0.030} bevel={0.004} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial {...CHROME} roughness={0.32} />
        </RoundedCylinder>
        <RoundedCylinder radius={0.007} height={0.048} bevel={0.003} position={[0.022, 0.022, 0.012]}>
          <meshPhysicalMaterial {...CHROME} roughness={0.32} />
        </RoundedCylinder>
      </group>

      {/* dos figuras en el adarve */}
      {[-0.080, 0.082].map((x) => (
        <group key={x} position={[x, 0.352, 0]}>
          <RoundedCylinder radius={0.024} height={0.058} bevel={0.010}>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </RoundedCylinder>
          <mesh position={[0, 0.046, 0]} castShadow>
            <sphereGeometry args={[0.026, 22, 16]} />
            <meshPhysicalMaterial {...PLASTIC} color={extra} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
