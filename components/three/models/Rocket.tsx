'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { Lathe, Extruded, noseProfile } from '../parts';
import { PLASTIC, TINTED, CHROME, CAR_PAINT } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * COHETE ESPACIAL — tres fases y un astronauta.
 *
 * El fuselaje es una sola revolución: un cohete hecho de cilindros
 * apilados deja escalones que en una pieza torneada no existen. Las
 * juntas de separación van hundidas, no pegadas encima.
 * ------------------------------------------------------------------ */
export default function Rocket({ body, accent, extra, spin = 0 }: ModelProps) {
  const R = 0.118;

  const hull = useMemo<[number, number][]>(() => [
    [0, 0.012],
    [R * 0.62, 0.012],
    [R * 0.94, 0.030],
    [R, 0.050],
    [R, 0.300],
    [R, 0.355],
    ...noseProfile(R, 0.355, 0.560, 12),
  ], [R]);

  const bell = useMemo<[number, number][]>(() => [
    [0.028, 0.012],
    [0.030, -0.010],
    [0.046, -0.038],
    [0.072, -0.060],
    [0.074, -0.052],
    [0.050, -0.032],
    [0.036, -0.006],
    [0.034, 0.012],
  ], []);

  const fin = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(R * 0.86, 0.190);                              // raíz alta
    s.quadraticCurveTo(R + 0.055, 0.120, R + 0.098, 0.012); // borde de ataque
    s.lineTo(R + 0.098, -0.020);
    s.quadraticCurveTo(R + 0.040, -0.014, R * 0.90, 0.020); // borde de salida
    s.lineTo(R * 0.86, 0.190);
    return s;
  }, [R]);

  return (
    <group position={[0, 0.062, 0]}>
      {/* casco */}
      <Lathe profile={hull}>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </Lathe>

      {/* ojiva en color de contraste, encajada en el casco */}
      <Lathe profile={noseProfile(R * 0.997, 0.372, 0.560, 12)}>
        <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
      </Lathe>

      {/* juntas de separación de fase, hundidas */}
      {[0.150, 0.300].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[R * 0.985, 0.009, 10, 64]} />
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </mesh>
      ))}

      {/* portilla: aro, cristal y casco del astronauta */}
      <group position={[0, 0.255, R * 0.62]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.050, 0.012, 12, 40]} />
          <meshPhysicalMaterial {...CHROME} />
        </mesh>
        <mesh position={[0, 0, -0.006]}>
          <sphereGeometry args={[0.050, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
          <meshPhysicalMaterial {...TINTED} color={extra} />
        </mesh>
        <mesh position={[0, -0.004, -0.030]}>
          <sphereGeometry args={[0.034, 24, 18]} />
          <meshPhysicalMaterial {...PLASTIC} color="#f4f1ea" />
        </mesh>
        <mesh position={[0, -0.004, -0.022]} rotation={[0.2, 0, 0]}>
          <sphereGeometry args={[0.0345, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.36]} />
          <meshPhysicalMaterial color="#1a1720" roughness={0.18} metalness={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* aletas */}
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, (i / 3) * Math.PI * 2 + spin * 0.004, 0]}>
          <Extruded shape={fin} depth={0.019} bevel={0.007}>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </Extruded>
        </group>
      ))}

      {/* toberas */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + Math.PI / 3;
        return (
          <Lathe key={i} profile={bell} position={[Math.cos(a) * 0.052, 0, Math.sin(a) * 0.052]}>
            <meshPhysicalMaterial {...CHROME} color="#cfd3dc" roughness={0.28} />
          </Lathe>
        );
      })}

      {/* faja inferior */}
      <mesh position={[0, 0.072, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[R * 0.99, 0.007, 10, 64]} />
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </mesh>
    </group>
  );
}
