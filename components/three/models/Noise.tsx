'use client';

import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Lathe, RoundedCylinder, Screw } from '../parts';
import { PLASTIC, CAR_PAINT, CHROME, SOFT_PLASTIC, TINTED } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * CAJA MUSICAL — seis voces y bocina, con limitador de volumen.
 *
 * La bocina es una revolución de perfil acampanado: un cono recto se
 * lee como un embudo, y lo que hace que suene a gramófono es la curva
 * de la boca.
 * ------------------------------------------------------------------ */
export default function Noise({ body, accent, extra, spin = 0 }: ModelProps) {
  const horn = useMemo<[number, number][]>(() => [
    [0.016, 0], [0.020, 0.030], [0.030, 0.070], [0.052, 0.110],
    [0.088, 0.145], [0.126, 0.168], [0.128, 0.176], [0.090, 0.156],
    [0.054, 0.124], [0.032, 0.082], [0.022, 0.038], [0.016, 0.008],
  ], []);

  const keys = [
    { x: -0.108, c: accent }, { x: -0.036, c: extra },
    { x: 0.036, c: accent }, { x: 0.108, c: extra },
  ];

  return (
    <group>
      {/* caja */}
      <RoundedBox args={[0.340, 0.200, 0.230]} radius={0.048} smoothness={8} position={[0, 0.110, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </RoundedBox>
      {/* tapa */}
      <RoundedBox args={[0.350, 0.026, 0.240]} radius={0.012} smoothness={5} position={[0, 0.214, 0]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedBox>

      {/* rejilla del altavoz */}
      <RoundedCylinder radius={0.062} height={0.014} bevel={0.006} position={[-0.060, 0.118, 0.120]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2b2833" />
      </RoundedCylinder>
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => (
          <mesh key={`${r}-${c}`} position={[-0.108 + c * 0.032, 0.150 - r * 0.030, 0.126]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.008, 12]} />
            <meshPhysicalMaterial color="#17151d" roughness={0.8} />
          </mesh>
        )),
      )}

      {/* bocina */}
      <group position={[0.140, 0.200, 0.040]} rotation={[-0.42, 0.55, 0]}>
        <Lathe profile={horn} segments={48}>
          <meshPhysicalMaterial {...CHROME} color="#e3c98d" roughness={0.22} side={2} />
        </Lathe>
      </group>
      <RoundedCylinder radius={0.022} height={0.050} bevel={0.008} position={[0.118, 0.196, 0.020]} rotation={[0, 0, 0.5]}>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedCylinder>

      {/* teclas: bajan por turnos al girar la pieza */}
      {keys.map((k, i) => {
        const press = Math.max(0, Math.sin(spin * 0.03 - i * 1.4)) * 0.016;
        return (
          <group key={k.x}>
            <RoundedBox args={[0.062, 0.030, 0.062]} radius={0.012} smoothness={5} position={[k.x, 0.232 - press, -0.056]} castShadow>
              <meshPhysicalMaterial {...PLASTIC} color={k.c} />
            </RoundedBox>
            <RoundedBox args={[0.070, 0.016, 0.070]} radius={0.007} smoothness={4} position={[k.x, 0.216, -0.056]}>
              <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2b2833" />
            </RoundedBox>
          </group>
        );
      })}

      {/* manivela */}
      <group position={[-0.178, 0.110, -0.060]} rotation={[0, 0, spin * 0.02]}>
        <RoundedCylinder radius={0.014} height={0.050} bevel={0.005} rotation={[0, 0, Math.PI / 2]}>
          <meshPhysicalMaterial {...CHROME} roughness={0.3} />
        </RoundedCylinder>
        <RoundedCylinder radius={0.010} height={0.070} bevel={0.004} position={[-0.030, 0.034, 0]}>
          <meshPhysicalMaterial {...CHROME} roughness={0.3} />
        </RoundedCylinder>
        <mesh position={[-0.030, 0.074, 0]} castShadow>
          <sphereGeometry args={[0.024, 24, 18]} />
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </mesh>
      </group>

      {/* piloto de encendido */}
      <mesh position={[0.132, 0.150, 0.118]} castShadow>
        <sphereGeometry args={[0.018, 20, 14]} />
        <meshPhysicalMaterial {...TINTED} color={accent} opacity={0.95} emissive={accent} emissiveIntensity={0.6} />
      </mesh>

      {/* asa */}
      <Lathe
        profile={[[0.105, 0], [0.105, 0.012], [0.092, 0.012], [0.092, 0]]}
        position={[0, 0.240, 0]}
      >
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#33303b" />
      </Lathe>

      {/* tornillos de los bajos */}
      {([[0.120, 0.080], [-0.120, 0.080], [0.120, -0.080], [-0.120, -0.080]] as const).map(([x, z]) => (
        <Screw key={`${x}:${z}`} r={0.012} position={[x, 0.012, z]} rotation={[Math.PI, 0, 0]} />
      ))}
    </group>
  );
}
