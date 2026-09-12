'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Extruded, RoundedCylinder, Lathe } from '../parts';
import { PLASTIC, TINTED, CAR_PAINT, SOFT_PLASTIC, RUBBER } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * BARCO REMOLCADOR — flota de verdad y se endereza solo.
 *
 * El casco se extruye de su **planta** —proa en punta, costados rectos,
 * espejo de popa recto— hacia abajo. Extruido de la sección transversal
 * salía un tronco redondo con forma de submarino: la silueta que
 * identifica un barco se ve desde arriba, no de perfil.
 * ------------------------------------------------------------------ */
export default function Boat({ body, accent, extra, spin = 0 }: ModelProps) {
  const H = 0.175;   // puntal del casco

  const plan = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.275, -0.140);                          // amura de babor en popa
    s.lineTo(0.105, -0.152);
    s.quadraticCurveTo(0.240, -0.148, 0.312, 0);       // proa
    s.quadraticCurveTo(0.240, 0.148, 0.105, 0.152);
    s.lineTo(-0.275, 0.140);
    s.quadraticCurveTo(-0.298, 0.120, -0.296, 0);      // espejo de popa
    s.quadraticCurveTo(-0.298, -0.120, -0.275, -0.140);
    return s;
  }, []);

  return (
    <group rotation={[0, 0, Math.sin(spin * 0.02) * 0.035]}>
      {/* casco */}
      <Extruded shape={plan} depth={H} bevel={0.022} curveSegments={30} rotation={[-Math.PI / 2, 0, 0]} position={[0, H / 2 + 0.010, 0]}>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </Extruded>

      {/* franja de flotación */}
      <Extruded shape={plan} depth={0.022} bevel={0.010} curveSegments={30} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.070, 0]} scale={[1.012, 1.012, 1]}>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </Extruded>

      {/* cubierta, un pelo más pequeña que el casco para dejar regala */}
      <Extruded shape={plan} depth={0.016} bevel={0.008} curveSegments={30} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.196, 0]} scale={[0.94, 0.94, 1]}>
        <meshPhysicalMaterial {...PLASTIC} color="#e8dfcc" roughness={0.55} />
      </Extruded>

      {/* caseta de gobierno */}
      <RoundedBox args={[0.215, 0.130, 0.200]} radius={0.028} smoothness={6} position={[-0.060, 0.262, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color="#f4efe4" />
      </RoundedBox>
      <RoundedBox args={[0.225, 0.062, 0.208]} radius={0.024} smoothness={6} position={[-0.060, 0.282, 0]} castShadow>
        <meshPhysicalMaterial {...TINTED} color={extra} />
      </RoundedBox>
      <RoundedBox args={[0.235, 0.020, 0.220]} radius={0.009} smoothness={4} position={[-0.060, 0.334, 0]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedBox>

      {/* chimenea */}
      <Lathe
        profile={[[0.052, 0], [0.052, 0.120], [0.059, 0.131], [0.059, 0.148], [0.040, 0.148], [0, 0.148]]}
        position={[-0.222, 0.204, 0]}
      >
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </Lathe>
      <mesh position={[-0.222, 0.290, 0]} castShadow>
        <cylinderGeometry args={[0.0535, 0.0535, 0.028, 32]} />
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#26232c" />
      </mesh>

      {/* mástil con bandera */}
      <RoundedCylinder radius={0.007} height={0.190} bevel={0.003} position={[0.070, 0.296, 0]}>
        <meshPhysicalMaterial {...PLASTIC} color="#f4efe4" />
      </RoundedCylinder>
      <RoundedBox args={[0.006, 0.044, 0.080]} radius={0.003} smoothness={3} position={[0.070, 0.364, 0.044]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedBox>

      {/* defensas de goma a lo largo del costado */}
      {[0.170, 0.060, -0.050, -0.160, -0.250].map((x) => (
        [1, -1].map((s) => {
          const z = s * (0.152 - Math.max(0, (x - 0.105) / 0.207) * 0.10);
          return (
            <mesh key={`${x}:${s}`} position={[x, 0.172, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.028, 0.011, 10, 22]} />
              <meshPhysicalMaterial {...RUBBER} />
            </mesh>
          );
        })
      ))}
      {/* defensa de proa */}
      <mesh position={[0.306, 0.152, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.040, 0.015, 10, 26]} />
        <meshPhysicalMaterial {...RUBBER} />
      </mesh>

      {/* ojos de buey */}
      {[0.130, 0.040, -0.055].map((x) => (
        [1, -1].map((s) => (
          <RoundedCylinder key={`${x}:${s}`} radius={0.020} height={0.014} bevel={0.005} position={[x, 0.140, s * 0.150]} rotation={[Math.PI / 2, 0, 0]}>
            <meshPhysicalMaterial {...TINTED} color={extra} />
          </RoundedCylinder>
        ))
      ))}

      {/* bita de remolque en popa */}
      <RoundedCylinder radius={0.022} height={0.046} bevel={0.008} position={[-0.230, 0.224, 0]}>
        <meshPhysicalMaterial {...CHROMEISH} />
      </RoundedCylinder>
    </group>
  );
}

const CHROMEISH = { color: '#3a3640', metalness: 0.6, roughness: 0.35, envMapIntensity: 1.1 } as const;
