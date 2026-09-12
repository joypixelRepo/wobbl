'use client';

import { RoundedBox } from '@react-three/drei';
import { PLUSH, PLASTIC, CAR_PAINT } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * OSO DE PELUCHE — costura doble, lavable a 30°.
 *
 * Único del catálogo que no lleva plástico: el material es mate del
 * todo y con `sheen`, que es lo que simula la pelusa devolviendo luz
 * por los bordes en lugar de un brillo especular. Con un material
 * brillante parecería de goma, no de tela.
 * ------------------------------------------------------------------ */
export default function Bear({ body, accent, extra, spin = 0 }: ModelProps) {
  const tilt = Math.sin(spin * 0.02) * 0.06;
  const fur = { ...PLUSH, color: body, sheenColor: '#ffffff' };
  const pad = { ...PLUSH, color: extra };

  return (
    <group position={[0, 0.010, 0]} rotation={[0, 0, tilt]}>
      {/* piernas, sentado */}
      {[0.098, -0.098].map((z) => (
        <group key={z}>
          <mesh position={[0.042, 0.086, z]} scale={[1.25, 1, 1]} castShadow receiveShadow>
            <sphereGeometry args={[0.086, 32, 24]} />
            <meshPhysicalMaterial {...fur} />
          </mesh>
          <mesh position={[0.128, 0.082, z]} scale={[0.5, 0.85, 0.85]} castShadow>
            <sphereGeometry args={[0.062, 26, 20]} />
            <meshPhysicalMaterial {...pad} />
          </mesh>
        </group>
      ))}

      {/* tripa */}
      <mesh position={[0, 0.220, 0]} scale={[0.92, 1, 0.95]} castShadow receiveShadow>
        <sphereGeometry args={[0.160, 40, 30]} />
        <meshPhysicalMaterial {...fur} />
      </mesh>
      <mesh position={[0.078, 0.212, 0]} scale={[0.55, 0.85, 0.8]} castShadow>
        <sphereGeometry args={[0.112, 32, 24]} />
        <meshPhysicalMaterial {...pad} />
      </mesh>

      {/* brazos */}
      {[0.150, -0.150].map((z) => (
        <group key={z} rotation={[z > 0 ? -0.35 : 0.35, 0, 0]}>
          <mesh position={[0.030, 0.268, z]} scale={[1, 1.45, 1]} rotation={[0, 0, 0.4]} castShadow>
            <sphereGeometry args={[0.062, 28, 22]} />
            <meshPhysicalMaterial {...fur} />
          </mesh>
          <mesh position={[0.096, 0.208, z]} scale={[0.9, 0.9, 0.9]} castShadow>
            <sphereGeometry args={[0.048, 24, 18]} />
            <meshPhysicalMaterial {...pad} />
          </mesh>
        </group>
      ))}

      {/* orejas */}
      {[0.110, -0.110].map((z) => (
        <group key={z}>
          <mesh position={[-0.030, 0.520, z]} scale={[0.65, 1, 1]} castShadow>
            <sphereGeometry args={[0.070, 28, 20]} />
            <meshPhysicalMaterial {...fur} />
          </mesh>
          <mesh position={[0.002, 0.520, z]} scale={[0.4, 0.66, 0.66]} castShadow>
            <sphereGeometry args={[0.070, 24, 18]} />
            <meshPhysicalMaterial {...pad} />
          </mesh>
        </group>
      ))}

      {/* cabeza */}
      <mesh position={[0, 0.440, 0]} scale={[0.95, 1, 1]} castShadow receiveShadow>
        <sphereGeometry args={[0.172, 44, 32]} />
        <meshPhysicalMaterial {...fur} />
      </mesh>
      {/* hocico */}
      <mesh position={[0.132, 0.408, 0]} scale={[0.8, 0.72, 1]} castShadow>
        <sphereGeometry args={[0.082, 32, 24]} />
        <meshPhysicalMaterial {...pad} />
      </mesh>
      <mesh position={[0.198, 0.428, 0]} scale={[0.7, 0.55, 1]} castShadow>
        <sphereGeometry args={[0.036, 24, 18]} />
        <meshPhysicalMaterial {...CAR_PAINT} color="#2b2630" roughness={0.3} />
      </mesh>

      {/* ojos */}
      {[0.070, -0.070].map((z) => (
        <mesh key={z} position={[0.130, 0.492, z]} castShadow>
          <sphereGeometry args={[0.028, 26, 20]} />
          <meshPhysicalMaterial {...CAR_PAINT} color="#221d28" roughness={0.16} clearcoat={1} />
        </mesh>
      ))}

      {/* lazo al cuello */}
      <mesh position={[0.086, 0.320, 0]} rotation={[0, 0, 0.2]} castShadow>
        <torusGeometry args={[0.126, 0.022, 14, 40]} />
        <meshPhysicalMaterial {...PLASTIC} color={accent} roughness={0.7} clearcoat={0.2} />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} position={[0.152, 0.318, s * 0.062]} rotation={[s * 0.5, 0, 0.3]} scale={[0.5, 1, 1.35]} castShadow>
          <sphereGeometry args={[0.048, 24, 18]} />
          <meshPhysicalMaterial {...PLASTIC} color={accent} roughness={0.7} clearcoat={0.2} />
        </mesh>
      ))}
      <mesh position={[0.166, 0.318, 0]} castShadow>
        <sphereGeometry args={[0.026, 20, 16]} />
        <meshPhysicalMaterial {...PLASTIC} color={accent} roughness={0.7} clearcoat={0.2} />
      </mesh>
    </group>
  );
}
