'use client';

import { RoundedBox } from '@react-three/drei';
import { Lathe, RoundedCylinder } from '../parts';
import { PLASTIC, TINTED, CHROME, CAR_PAINT } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * NAVE ESPACIAL — platillo con luces y rayo tractor.
 *
 * El plato es una sola revolución con el canto vivo en el ecuador: dos
 * conos pegados dejarían una arista recta, y lo que hace que un
 * platillo parezca metal embutido es justamente ese labio curvo.
 * ------------------------------------------------------------------ */
export default function Ufo({ body, accent, extra, spin = 0 }: ModelProps) {
  const lights = 10;
  return (
    <group position={[0, 0.075, 0]}>
      {/* plato */}
      <Lathe
        profile={[
          [0, -0.052], [0.070, -0.050], [0.150, -0.040], [0.230, -0.018],
          [0.278, 0], [0.268, 0.022], [0.200, 0.052], [0.120, 0.070], [0, 0.076],
        ]}
        segments={64}
      >
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </Lathe>

      {/* labio del ecuador */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.272, 0.013, 12, 72]} />
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </mesh>

      {/* luces en el canto */}
      {Array.from({ length: lights }, (_, i) => {
        const a = (i / lights) * Math.PI * 2;
        const on = 0.35 + 0.65 * Math.abs(Math.sin(spin * 0.04 + i * 0.9));
        return (
          <mesh key={i} position={[Math.cos(a) * 0.238, -0.012, Math.sin(a) * 0.238]} castShadow>
            <sphereGeometry args={[0.024, 20, 14]} />
            <meshPhysicalMaterial {...TINTED} color={extra} opacity={0.95} emissive={extra} emissiveIntensity={on} />
          </mesh>
        );
      })}

      {/* cúpula */}
      <mesh position={[0, 0.070, 0]} castShadow>
        <sphereGeometry args={[0.118, 40, 26, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...TINTED} color={extra} />
      </mesh>
      <mesh position={[0, 0.072, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.118, 0.011, 12, 48]} />
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </mesh>
      {/* el tripulante */}
      <mesh position={[0, 0.106, 0]} castShadow>
        <sphereGeometry args={[0.048, 28, 20]} />
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </mesh>
      {[0.019, -0.019].map((z) => (
        <mesh key={z} position={[0.040, 0.116, z]} castShadow>
          <sphereGeometry args={[0.013, 16, 12]} />
          <meshPhysicalMaterial color="#15131a" roughness={0.15} metalness={0.3} />
        </mesh>
      ))}

      {/* antena */}
      <RoundedCylinder radius={0.006} height={0.060} bevel={0.002} position={[0, 0.200, 0]}>
        <meshPhysicalMaterial {...CHROME} roughness={0.3} />
      </RoundedCylinder>
      <mesh position={[0, 0.236, 0]} castShadow>
        <sphereGeometry args={[0.022, 20, 14]} />
        <meshPhysicalMaterial {...TINTED} color={accent} opacity={0.95} emissive={accent} emissiveIntensity={0.5} />
      </mesh>

      {/* tren de aterrizaje */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
        return (
          <group key={i} position={[Math.cos(a) * 0.150, -0.052, Math.sin(a) * 0.150]}>
            <RoundedCylinder radius={0.013} height={0.046} bevel={0.005}>
              <meshPhysicalMaterial {...CHROME} roughness={0.34} />
            </RoundedCylinder>
            <RoundedCylinder radius={0.032} height={0.016} bevel={0.006} position={[0, -0.028, 0]}>
              <meshPhysicalMaterial {...PLASTIC} color={accent} />
            </RoundedCylinder>
          </group>
        );
      })}
    </group>
  );
}
