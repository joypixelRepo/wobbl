'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedCylinder } from '../parts';
import { PLASTIC, CHROME, CAR_PAINT } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * MUELLE SALTARÍN — espiral de acero en carcasa de silicona.
 *
 * La espiral es un tubo barrido sobre una hélice de verdad, no una
 * pila de aros: los aros dejan un salto visible en cada vuelta y la
 * pieza deja de parecer un muelle en cuanto la giras.
 * ------------------------------------------------------------------ */
export default function Spring({ body, accent, extra, spin = 0 }: ModelProps) {
  // Comprimirlo un poco con el giro le da el gesto del juguete.
  const squash = 0.82 + 0.18 * Math.abs(Math.cos(spin * 0.015));

  const coil = useMemo(() => {
    const turns = 7;
    const steps = turns * 48;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const a = t * turns * Math.PI * 2;
      // El radio se estrecha arriba: un muelle recto se lee como un tubo.
      const r = 0.155 - t * 0.030;
      pts.push(new THREE.Vector3(Math.cos(a) * r, t * 0.300, Math.sin(a) * r));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, steps, 0.022, 14, false);
  }, []);

  return (
    <group scale={[1, squash, 1]}>
      {/* base */}
      <RoundedCylinder radius={0.180} height={0.042} bevel={0.016} position={[0, 0.021, 0]}>
        <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
      </RoundedCylinder>
      <RoundedCylinder radius={0.150} height={0.030} bevel={0.012} position={[0, 0.052, 0]}>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedCylinder>

      {/* espiral */}
      <mesh geometry={coil} position={[0, 0.064, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </mesh>

      {/* eje de acero que se adivina por dentro */}
      <RoundedCylinder radius={0.014} height={0.300} bevel={0.005} position={[0, 0.214, 0]}>
        <meshPhysicalMaterial {...CHROME} roughness={0.28} />
      </RoundedCylinder>

      {/* cabeza */}
      <mesh position={[0, 0.430, 0]} scale={[1, 0.88, 1]} castShadow receiveShadow>
        <sphereGeometry args={[0.150, 44, 32]} />
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </mesh>
      {/* orejas */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[-0.026, 0.540, s * 0.106]} rotation={[s * 0.4, 0, 0.3]} scale={[0.5, 1, 0.7]} castShadow>
          <sphereGeometry args={[0.062, 28, 20]} />
          <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
        </mesh>
      ))}
      {/* ojos */}
      {[0.050, -0.050].map((z) => (
        <group key={z} position={[0.108, 0.452, z]}>
          <mesh castShadow>
            <sphereGeometry args={[0.040, 28, 20]} />
            <meshPhysicalMaterial {...PLASTIC} color="#fbf8f2" />
          </mesh>
          <mesh position={[0.026, 0, 0]}>
            <sphereGeometry args={[0.020, 22, 16]} />
            <meshPhysicalMaterial color="#15131a" roughness={0.2} />
          </mesh>
        </group>
      ))}
      {/* hocico */}
      <mesh position={[0.132, 0.396, 0]} scale={[0.7, 0.62, 1]} castShadow>
        <sphereGeometry args={[0.046, 24, 18]} />
        <meshPhysicalMaterial {...PLASTIC} color={extra} />
      </mesh>
    </group>
  );
}
