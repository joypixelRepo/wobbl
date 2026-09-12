'use client';

import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Lathe, RoundedCylinder } from '../parts';
import { PLASTIC, TINTED, CAR_PAINT, CHROME, SOFT_PLASTIC, WOOD } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * LABORATORIO DE CIENCIA — doce piezas y seis fichas.
 *
 * El cristal es el protagonista: matraz y tubos van en un material
 * translúcido con el líquido dentro como sólido aparte, que es lo que
 * da la lectura de "hay algo flotando ahí".
 * ------------------------------------------------------------------ */
export default function Lab({ body, accent, extra, spin = 0 }: ModelProps) {
  const bubble = 0.5 + 0.5 * Math.abs(Math.sin(spin * 0.04));
  const glass = { ...TINTED, color: '#dff0ff', opacity: 0.32 };

  // Matraz Erlenmeyer: cuello recto y cuerpo cónico.
  const flask = useMemo<[number, number][]>(() => [
    [0, 0], [0.098, 0], [0.100, 0.010], [0.062, 0.096],
    [0.030, 0.150], [0.030, 0.215], [0.034, 0.222], [0, 0.222],
  ], []);
  const liquid = useMemo<[number, number][]>(() => [
    [0, 0.008], [0.092, 0.008], [0.060, 0.098], [0.058, 0.104], [0, 0.104],
  ], []);

  return (
    <group>
      {/* mesa */}
      <RoundedBox args={[0.620, 0.026, 0.280]} radius={0.010} smoothness={4} position={[0, 0.222, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...WOOD} />
      </RoundedBox>
      <RoundedBox args={[0.600, 0.022, 0.260]} radius={0.008} smoothness={4} position={[0, 0.100, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...WOOD} color="#cfa070" />
      </RoundedBox>
      {([[0.278, 0.122], [-0.278, 0.122], [0.278, -0.122], [-0.278, -0.122]] as const).map(([x, z]) => (
        <RoundedBox key={`${x}:${z}`} args={[0.028, 0.220, 0.028]} radius={0.008} smoothness={4} position={[x, 0.110, z]} castShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
      ))}

      {/* matraz sobre el mechero */}
      <group position={[-0.170, 0.300, 0.020]}>
        <Lathe profile={flask} segments={40}>
          <meshPhysicalMaterial {...glass} />
        </Lathe>
        <Lathe profile={liquid} segments={40}>
          <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
        </Lathe>
        <RoundedCylinder radius={0.034} height={0.020} bevel={0.007} position={[0, 0.226, 0]}>
          <meshPhysicalMaterial {...PLASTIC} color={extra} />
        </RoundedCylinder>
        {/* burbujas */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[(i - 1) * 0.026, 0.060 + i * 0.028, 0.010]} castShadow>
            <sphereGeometry args={[0.012 - i * 0.002, 16, 12]} />
            <meshPhysicalMaterial {...TINTED} color="#ffffff" opacity={0.5 * bubble} />
          </mesh>
        ))}
      </group>
      {/* mechero */}
      <RoundedCylinder radius={0.048} height={0.022} bevel={0.008} position={[-0.170, 0.246, 0.020]}>
        <meshPhysicalMaterial {...CHROME} color="#4b4652" roughness={0.4} />
      </RoundedCylinder>
      <RoundedCylinder radius={0.014} height={0.040} bevel={0.005} position={[-0.170, 0.268, 0.020]}>
        <meshPhysicalMaterial {...CHROME} roughness={0.3} />
      </RoundedCylinder>
      <mesh position={[-0.170, 0.300, 0.020]} castShadow>
        <coneGeometry args={[0.018, 0.052, 14]} />
        <meshPhysicalMaterial {...TINTED} color="#7fb4ff" opacity={0.6 * bubble} emissive="#4f8dff" emissiveIntensity={0.6 * bubble} />
      </mesh>

      {/* gradilla con tres tubos */}
      <group position={[0.130, 0.236, 0]}>
        <RoundedBox args={[0.230, 0.018, 0.090]} radius={0.007} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
        <RoundedBox args={[0.230, 0.016, 0.090]} radius={0.007} smoothness={4} position={[0, 0.130, 0]} castShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
        {[0.100, -0.100].map((x) => (
          <RoundedBox key={x} args={[0.018, 0.140, 0.076]} radius={0.006} smoothness={4} position={[x, 0.066, 0]} castShadow>
            <meshPhysicalMaterial {...CAR_PAINT} color={body} />
          </RoundedBox>
        ))}
        {[-0.062, 0, 0.062].map((x, i) => (
          <group key={x} position={[x, 0.090, 0]}>
            <RoundedCylinder radius={0.023} height={0.190} bevel={0.020} radial={28}>
              <meshPhysicalMaterial {...glass} />
            </RoundedCylinder>
            <RoundedCylinder radius={0.020} height={0.072} bevel={0.018} position={[0, -0.052, 0]} radial={24}>
              <meshPhysicalMaterial {...CAR_PAINT} color={[accent, extra, accent][i]} />
            </RoundedCylinder>
            <RoundedCylinder radius={0.026} height={0.016} bevel={0.006} position={[0, 0.100, 0]}>
              <meshPhysicalMaterial {...PLASTIC} color={[extra, accent, extra][i]} />
            </RoundedCylinder>
          </group>
        ))}
      </group>

      {/* gafas de seguridad encima de la mesa */}
      <group position={[-0.060, 0.248, -0.078]} rotation={[0, 0.3, 0]}>
        <RoundedBox args={[0.150, 0.046, 0.046]} radius={0.020} smoothness={6} castShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
        </RoundedBox>
        {[0.042, -0.042].map((x) => (
          <RoundedCylinder key={x} radius={0.028} height={0.018} bevel={0.007} position={[x, 0.002, 0.020]} rotation={[Math.PI / 2, 0, 0]}>
            <meshPhysicalMaterial {...TINTED} color="#bfe4ff" opacity={0.55} />
          </RoundedCylinder>
        ))}
      </group>

      {/* frascos en la balda baja */}
      {[-0.180, -0.090, 0.010].map((x, i) => (
        <group key={x} position={[x, 0.112, -0.040]}>
          <RoundedCylinder radius={0.030 - i * 0.003} height={0.084} bevel={0.012}>
            <meshPhysicalMaterial {...glass} />
          </RoundedCylinder>
          <RoundedCylinder radius={0.027 - i * 0.003} height={0.042} bevel={0.010} position={[0, -0.018, 0]}>
            <meshPhysicalMaterial {...CAR_PAINT} color={[extra, accent, body][i]} />
          </RoundedCylinder>
          <RoundedCylinder radius={0.016} height={0.018} bevel={0.005} position={[0, 0.048, 0]}>
            <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2d2a34" />
          </RoundedCylinder>
        </group>
      ))}

      {/* fichas de experimentos */}
      {[0, 1].map((i) => (
        <RoundedBox key={i} args={[0.120, 0.006, 0.086]} radius={0.004} smoothness={3} position={[0.230, 0.240 + i * 0.008, -0.086 + i * 0.010]} rotation={[0, 0.18 - i * 0.3, 0]} castShadow>
          <meshPhysicalMaterial {...PLASTIC} color={i ? accent : '#f6f2ea'} roughness={0.45} />
        </RoundedBox>
      ))}
    </group>
  );
}
