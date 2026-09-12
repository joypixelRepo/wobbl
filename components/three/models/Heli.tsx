'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Lathe, Extruded, RoundedCylinder, noseProfile } from '../parts';
import { PLASTIC, TINTED, CAR_PAINT, SOFT_PLASTIC, CHROME } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * HELICÓPTERO DE RESCATE — dos rotores que giran.
 *
 * Las palas se extruyen con perfil de pala (ancha en el centro,
 * afilada en la punta) en lugar de ser listones: a esta escala es lo
 * único que distingue un rotor de una cruz de palos.
 * ------------------------------------------------------------------ */
export default function Heli({ body, accent, extra, spin = 0 }: ModelProps) {
  const rotor = spin * 0.16;

  const boom = useMemo<[number, number][]>(() => [
    [0.022, 0], [0.030, 0.030], [0.038, 0.110], [0.046, 0.230], [0.052, 0.300], [0, 0.310],
  ], []);

  const blade = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.020, 0.030);
    s.quadraticCurveTo(-0.026, 0.190, -0.014, 0.318);
    s.quadraticCurveTo(0, 0.334, 0.014, 0.318);
    s.quadraticCurveTo(0.026, 0.190, 0.020, 0.030);
    s.quadraticCurveTo(0, 0.018, -0.020, 0.030);
    return s;
  }, []);

  const fin = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.058, 0.030);
    s.lineTo(0.016, 0.030);
    s.quadraticCurveTo(0.012, 0.120, -0.012, 0.140);
    s.quadraticCurveTo(-0.044, 0.146, -0.058, 0.120);
    s.lineTo(-0.058, 0.030);
    return s;
  }, []);

  return (
    <group position={[0, 0.130, 0]}>
      {/* cabina */}
      <RoundedBox args={[0.300, 0.215, 0.210]} radius={0.090} smoothness={8} position={[0.060, 0.030, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </RoundedBox>
      {/* burbuja acristalada del morro */}
      <RoundedBox args={[0.190, 0.180, 0.190]} radius={0.085} smoothness={8} position={[0.155, 0.032, 0]} castShadow>
        <meshPhysicalMaterial {...TINTED} color={extra} />
      </RoundedBox>
      {/* franja de rescate */}
      <RoundedBox args={[0.320, 0.034, 0.216]} radius={0.014} smoothness={5} position={[0.050, -0.020, 0]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedBox>

      {/* cola, torneada para que se estreche de verdad */}
      <group rotation={[0, 0, Math.PI / 2]} position={[-0.070, 0.058, 0]}>
        <Lathe profile={boom} segments={36}>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </Lathe>
      </group>
      {/* deriva */}
      <Extruded shape={fin} depth={0.016} bevel={0.006} position={[-0.348, 0.052, 0]}>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </Extruded>
      {/* estabilizador */}
      <RoundedBox args={[0.070, 0.014, 0.150]} radius={0.006} smoothness={4} position={[-0.320, 0.070, 0]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedBox>

      {/* rotor de cola */}
      <group position={[-0.372, 0.078, 0.028]} rotation={[0, 0, -rotor * 1.6]}>
        {[0, Math.PI].map((a) => (
          <Extruded key={a} shape={blade} depth={0.008} bevel={0.003} scale={[0.5, 0.32, 1]} rotation={[0, 0, a]}>
            <meshPhysicalMaterial {...PLASTIC} color="#26232c" roughness={0.4} />
          </Extruded>
        ))}
        <RoundedCylinder radius={0.014} height={0.020} bevel={0.005} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial {...CHROME} />
        </RoundedCylinder>
      </group>

      {/* mástil y rotor principal */}
      <RoundedCylinder radius={0.018} height={0.070} bevel={0.006} position={[0.040, 0.160, 0]}>
        <meshPhysicalMaterial {...CHROME} roughness={0.3} />
      </RoundedCylinder>
      <group position={[0.040, 0.198, 0]} rotation={[0, rotor, 0]}>
        {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((a) => (
          <group key={a} rotation={[0, a, 0]}>
            <Extruded shape={blade} depth={0.010} bevel={0.004} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.35, 1]}>
              <meshPhysicalMaterial {...PLASTIC} color="#26232c" roughness={0.4} />
            </Extruded>
          </group>
        ))}
        <RoundedCylinder radius={0.034} height={0.026} bevel={0.008}>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedCylinder>
      </group>

      {/* patines */}
      {[0.096, -0.096].map((z) => (
        <group key={z}>
          <RoundedCylinder radius={0.010} height={0.330} bevel={0.005} position={[0.045, -0.128, z]} rotation={[0, 0, Math.PI / 2]}>
            <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2c2932" />
          </RoundedCylinder>
          {[0.130, -0.030].map((x) => (
            <RoundedBox key={x} args={[0.016, 0.062, 0.016]} radius={0.006} smoothness={4} position={[x, -0.098, z]} castShadow>
              <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2c2932" />
            </RoundedBox>
          ))}
        </group>
      ))}

      {/* cabrestante */}
      <RoundedCylinder radius={0.024} height={0.046} bevel={0.008} position={[0.120, 0.048, 0.118]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedCylinder>
    </group>
  );
}
