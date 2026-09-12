'use client';

import { useMemo } from 'react';
import { Lathe, RoundedCylinder } from '../parts';
import { PLASTIC, WOOD, CAR_PAINT } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * TORRE DE BLOQUES — 18 aros de haya con caras imantadas.
 *
 * Cada aro es una revolución con el canto muy redondeado y un agujero
 * pasante: es lo que convierte un disco en una pieza que se ensarta.
 * ------------------------------------------------------------------ */
export default function Stack({ body, accent, extra, spin = 0 }: ModelProps) {
  const ring = (outer: number, height: number, hole: number) => {
    const b = height * 0.46;
    return [
      [hole, -height / 2],
      [outer - b, -height / 2],
      [outer, -height / 2 + b],
      [outer, height / 2 - b],
      [outer - b, height / 2],
      [hole, height / 2],
    ] as [number, number][];
  };

  const rings = useMemo(() => [
    { r: 0.170, y: 0.052, c: extra },
    { r: 0.146, y: 0.128, c: body },
    { r: 0.122, y: 0.196, c: accent },
    { r: 0.098, y: 0.256, c: extra },
    { r: 0.076, y: 0.308, c: body },
  ], [body, accent, extra]);

  return (
    <group>
      {/* base de haya */}
      <RoundedCylinder radius={0.215} height={0.038} bevel={0.014} position={[0, 0.019, 0]}>
        <meshPhysicalMaterial {...WOOD} />
      </RoundedCylinder>

      {/* eje cónico */}
      <Lathe profile={[[0.030, 0], [0.030, 0.180], [0.022, 0.330], [0.018, 0.360], [0, 0.366]]} position={[0, 0.036, 0]}>
        <meshPhysicalMaterial {...WOOD} color="#d9ab79" />
      </Lathe>

      {/* aros, cada uno girado un poco: nunca quedan alineados */}
      {rings.map((r, i) => (
        <group key={r.y} rotation={[0, spin * 0.004 * (i + 1) + i * 0.4, 0]}>
          <Lathe profile={ring(r.r, i === 0 ? 0.058 : 0.052, 0.034)} position={[0, r.y, 0]} segments={64}>
            <meshPhysicalMaterial {...CAR_PAINT} color={r.c} />
          </Lathe>
        </group>
      ))}

      {/* bola rematadora */}
      <mesh position={[0, 0.392, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.060, 40, 28]} />
        <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
      </mesh>
      <mesh position={[0, 0.392, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.060, 0.004, 8, 56]} />
        <meshPhysicalMaterial {...PLASTIC} color="#00000022" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}
