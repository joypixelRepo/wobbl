'use client';

import { useMemo } from 'react';
import { Lathe, RoundedCylinder } from '../parts';
import { PLASTIC, CAR_PAINT, CHROME } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * UNICORNIO — crin peinable de 40 mechones.
 *
 * Construido con cápsulas y esferas, no con siluetas extruidas: un
 * animal extruido sale con los costados planos y se lee como una
 * galleta. El volumen de un caballo es todo redondo.
 * ------------------------------------------------------------------ */
export default function Unicorn({ body, accent, extra, spin = 0 }: ModelProps) {
  const sway = Math.sin(spin * 0.02) * 0.05;
  const coat = { ...CAR_PAINT, color: body };

  const horn = useMemo<[number, number][]>(() =>
    Array.from({ length: 10 }, (_, i) => {
      const t = i / 9;
      return [0.026 * (1 - t) ** 0.8, t * 0.140] as [number, number];
    }), []);

  /* Mechones de la crin: de la cruz a la testuz, alternando color. */
  const mane = [
    { x: 0.010, y: 0.430, len: 0.160, r: 0.032, rot: -0.75 },
    { x: 0.062, y: 0.480, len: 0.150, r: 0.030, rot: -0.62 },
    { x: 0.112, y: 0.528, len: 0.135, r: 0.028, rot: -0.48 },
    { x: 0.160, y: 0.572, len: 0.115, r: 0.026, rot: -0.32 },
    { x: 0.206, y: 0.604, len: 0.092, r: 0.024, rot: -0.14 },
  ];

  return (
    <group rotation={[0, -0.38, 0]}>
      {/* barriga: cápsula tumbada */}
      <mesh position={[-0.040, 0.330, 0]} rotation={[Math.PI / 2, 0, 0.10]} castShadow receiveShadow>
        <capsuleGeometry args={[0.125, 0.230, 10, 28]} />
        <meshPhysicalMaterial {...coat} />
      </mesh>
      {/* grupa */}
      <mesh position={[-0.192, 0.316, 0]} scale={[1, 1, 0.95]} castShadow receiveShadow>
        <sphereGeometry args={[0.132, 36, 26]} />
        <meshPhysicalMaterial {...coat} />
      </mesh>
      {/* pecho */}
      <mesh position={[0.096, 0.330, 0]} scale={[0.95, 1, 0.92]} castShadow receiveShadow>
        <sphereGeometry args={[0.126, 36, 26]} />
        <meshPhysicalMaterial {...coat} />
      </mesh>

      {/* cuello */}
      <mesh position={[0.148, 0.462, 0]} rotation={[0, 0, -0.62]} castShadow receiveShadow>
        <capsuleGeometry args={[0.074, 0.180, 8, 24]} />
        <meshPhysicalMaterial {...coat} />
      </mesh>

      {/* cabeza y hocico */}
      <mesh position={[0.258, 0.562, 0]} rotation={[0, 0, -1.05]} scale={[1, 1, 0.92]} castShadow receiveShadow>
        <capsuleGeometry args={[0.058, 0.096, 8, 24]} />
        <meshPhysicalMaterial {...coat} />
      </mesh>
      <mesh position={[0.330, 0.520, 0]} scale={[1.05, 0.85, 0.95]} castShadow>
        <sphereGeometry args={[0.052, 30, 22]} />
        <meshPhysicalMaterial {...coat} />
      </mesh>
      <mesh position={[0.372, 0.508, 0]} scale={[0.55, 0.6, 1]} castShadow>
        <sphereGeometry args={[0.032, 24, 18]} />
        <meshPhysicalMaterial {...PLASTIC} color={extra} />
      </mesh>
      {/* ollares */}
      {[0.022, -0.022].map((z) => (
        <mesh key={z} position={[0.392, 0.512, z]} scale={[0.5, 0.7, 1]} castShadow>
          <sphereGeometry args={[0.012, 14, 10]} />
          <meshPhysicalMaterial color="#2d2a34" roughness={0.5} />
        </mesh>
      ))}

      {/* ojos */}
      {[0.048, -0.048].map((z) => (
        <group key={z} position={[0.302, 0.578, z]}>
          <mesh castShadow>
            <sphereGeometry args={[0.026, 26, 20]} />
            <meshPhysicalMaterial {...PLASTIC} color="#fbf8f2" />
          </mesh>
          <mesh position={[0.014, -0.002, z > 0 ? 0.007 : -0.007]}>
            <sphereGeometry args={[0.014, 20, 14]} />
            <meshPhysicalMaterial color="#221d28" roughness={0.14} clearcoat={1} />
          </mesh>
        </group>
      ))}

      {/* orejas */}
      {[0.046, -0.046].map((z) => (
        <mesh key={z} position={[0.236, 0.638, z]} rotation={[0, 0, -0.30]} castShadow>
          <coneGeometry args={[0.026, 0.074, 16]} />
          <meshPhysicalMaterial {...coat} />
        </mesh>
      ))}

      {/* cuerno de caracol */}
      <group position={[0.282, 0.646, 0]} rotation={[0, 0, -0.24]}>
        <Lathe profile={horn} segments={24}>
          <meshPhysicalMaterial {...CHROME} color="#f2dcae" roughness={0.16} />
        </Lathe>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[0, 0.014 + i * 0.022, 0]} rotation={[0.3, i * 1.05, 0]} castShadow>
            <torusGeometry args={[0.023 - i * 0.0032, 0.0048, 8, 24]} />
            <meshPhysicalMaterial {...CHROME} color="#fff0cc" roughness={0.14} />
          </mesh>
        ))}
      </group>

      {/* crin */}
      {mane.map((m, i) => (
        <mesh
          key={i}
          position={[m.x, m.y, 0]}
          rotation={[0, 0, m.rot + sway * (i + 1) * 0.25]}
          castShadow
        >
          <capsuleGeometry args={[m.r, m.len, 8, 20]} />
          <meshPhysicalMaterial {...CAR_PAINT} color={i % 2 ? extra : accent} roughness={0.26} />
        </mesh>
      ))}

      {/* cola */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[-0.296 - i * 0.014, 0.264 - i * 0.040, (i - 1) * 0.034]}
          rotation={[0, 0, 1.05 + i * 0.10 + sway * 0.4]}
          castShadow
        >
          <capsuleGeometry args={[0.032 - i * 0.005, 0.200 - i * 0.030, 8, 18]} />
          <meshPhysicalMaterial {...CAR_PAINT} color={i % 2 ? extra : accent} roughness={0.26} />
        </mesh>
      ))}

      {/* patas y cascos */}
      {([[0.082, 0.078], [0.082, -0.078], [-0.168, 0.078], [-0.168, -0.078]] as const).map(([x, z]) => (
        <group key={`${x}:${z}`}>
          <mesh position={[x, 0.152, z]} castShadow receiveShadow>
            <capsuleGeometry args={[0.038, 0.140, 8, 20]} />
            <meshPhysicalMaterial {...coat} />
          </mesh>
          <RoundedCylinder radius={0.044} height={0.052} bevel={0.016} position={[x, 0.028, z]}>
            <meshPhysicalMaterial {...PLASTIC} color={extra} />
          </RoundedCylinder>
        </group>
      ))}
    </group>
  );
}
