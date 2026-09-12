'use client';

import { PLASTIC, CAR_PAINT } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * MUÑECO BLANDITO — silicona de retorno lento.
 *
 * La silueta no es una esfera: se aplasta contra el suelo y se ensancha
 * por abajo, que es lo que hace la silicona por su propio peso. Una
 * esfera perfecta se lee como una pelota dura.
 * ------------------------------------------------------------------ */
export default function Blob({ body, accent, extra, spin = 0 }: ModelProps) {
  const squish = 1 + Math.sin(spin * 0.025) * 0.05;
  const silicone = { ...CAR_PAINT, color: body, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.03 };

  return (
    /* Un poco de tres cuartos: de perfil puro la cara se pierde. */
    <group scale={[squish, 2 - squish, squish]} rotation={[0, -0.55, 0]}>
      {/* cuerpo: dos esferas fundidas, ancha abajo y estrecha arriba */}
      <mesh position={[0, 0.155, 0]} scale={[1.18, 0.92, 1.12]} castShadow receiveShadow>
        <sphereGeometry args={[0.172, 48, 34]} />
        <meshPhysicalMaterial {...silicone} />
      </mesh>
      <mesh position={[0, 0.268, 0]} scale={[0.98, 1, 0.96]} castShadow receiveShadow>
        <sphereGeometry args={[0.140, 44, 32]} />
        <meshPhysicalMaterial {...silicone} />
      </mesh>

      {/* pies */}
      {[0.078, -0.078].map((z) => (
        <mesh key={z} position={[0.118, 0.036, z]} scale={[1.2, 0.6, 1]} castShadow receiveShadow>
          <sphereGeometry args={[0.056, 28, 20]} />
          <meshPhysicalMaterial {...silicone} />
        </mesh>
      ))}
      {/* bracitos */}
      {[0.168, -0.168].map((z) => (
        <mesh key={z} position={[0.040, 0.180, z]} scale={[0.8, 0.8, 1.1]} castShadow>
          <sphereGeometry args={[0.056, 26, 20]} />
          <meshPhysicalMaterial {...silicone} />
        </mesh>
      ))}

      {/* La cara va en un grupo girado para mirar a +X: así los ojos se
          hunden en el cuerpo en vez de quedar pegados por fuera, y la
          sonrisa se dibuja en su propio plano. */}
      <group position={[0.048, 0.278, 0]} rotation={[0, Math.PI / 2, 0]}>
        {[0.062, -0.062].map((x) => (
          <group key={x} position={[x, 0.026, 0.064]}>
            <mesh castShadow>
              <sphereGeometry args={[0.048, 32, 24]} />
              <meshPhysicalMaterial {...PLASTIC} color="#fbf8f2" />
            </mesh>
            <mesh position={[0, -0.003, 0.026]}>
              <sphereGeometry args={[0.026, 26, 20]} />
              <meshPhysicalMaterial color={accent} roughness={0.16} clearcoat={1} />
            </mesh>
            <mesh position={[-0.011, 0.013, 0.042]}>
              <sphereGeometry args={[0.009, 16, 12]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.1} />
            </mesh>
          </group>
        ))}

        {/* sonrisa: arco de toro centrado abajo */}
        <mesh position={[0, -0.036, 0.084]} rotation={[0, 0, (3 * Math.PI) / 2 - (Math.PI * 0.66) / 2]} castShadow>
          <torusGeometry args={[0.058, 0.014, 14, 32, Math.PI * 0.66]} />
          <meshPhysicalMaterial color={accent} roughness={0.3} clearcoat={0.9} />
        </mesh>

        {/* colorete */}
        {[0.104, -0.104].map((x) => (
          <mesh key={x} position={[x, -0.026, 0.044]} scale={[1, 0.7, 0.35]} castShadow>
            <sphereGeometry args={[0.040, 20, 14]} />
            <meshPhysicalMaterial color={extra} roughness={0.3} transparent opacity={0.5} clearcoat={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
