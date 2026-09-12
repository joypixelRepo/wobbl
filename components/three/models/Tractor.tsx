'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Extruded, Wheel, RoundedCylinder, Lathe } from '../parts';
import { PLASTIC, TINTED, CAR_PAINT, SOFT_PLASTIC, CHROME } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * TRACTOR — rueda alta con taco y enganche trasero.
 *
 * Lo que hace que un tractor se lea como tractor es la diferencia de
 * diámetro entre ejes: casi el doble detrás. Con ruedas iguales se
 * convierte en una furgoneta con capó.
 * ------------------------------------------------------------------ */
export default function Tractor({ body, accent, extra, spin = 0 }: ModelProps) {
  const roll = spin * 0.04;

  const bonnet = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.060, 0.110);
    s.lineTo(0.230, 0.110);
    s.quadraticCurveTo(0.272, 0.112, 0.274, 0.146);
    s.lineTo(0.274, 0.226);
    s.quadraticCurveTo(0.270, 0.258, 0.232, 0.262);
    s.lineTo(-0.060, 0.262);
    s.lineTo(-0.060, 0.110);
    return s;
  }, []);

  const fender = useMemo(() => {
    const s = new THREE.Shape();
    s.absarc(0, 0, 0.168, Math.PI * 0.06, Math.PI * 0.94, false);
    s.absarc(0, 0, 0.146, Math.PI * 0.94, Math.PI * 0.06, true);
    return s;
  }, []);

  return (
    <group>
      {/* capó */}
      <Extruded shape={bonnet} depth={0.170} bevel={0.016}>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </Extruded>
      {/* parrilla */}
      <RoundedBox args={[0.016, 0.090, 0.150]} radius={0.014} smoothness={4} position={[0.280, 0.180, 0]} castShadow>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2b2831" />
      </RoundedBox>
      {[0.056, -0.056].map((z) => (
        <RoundedCylinder key={z} radius={0.026} height={0.020} bevel={0.006} position={[0.284, 0.236, z]} rotation={[0, 0, Math.PI / 2]}>
          <meshPhysicalMaterial {...TINTED} color="#fff3da" opacity={0.9} emissive="#ffeec2" emissiveIntensity={0.35} />
        </RoundedCylinder>
      ))}

      {/* escape vertical */}
      <Lathe
        profile={[[0.018, 0], [0.018, 0.150], [0.026, 0.160], [0.026, 0.176], [0.014, 0.176], [0, 0.176]]}
        position={[0.222, 0.258, 0.058]}
      >
        <meshPhysicalMaterial {...CHROME} roughness={0.34} />
      </Lathe>

      {/* cabina */}
      <RoundedBox args={[0.230, 0.210, 0.215]} radius={0.030} smoothness={6} position={[-0.150, 0.300, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </RoundedBox>
      {/* cristales de la cabina */}
      <RoundedBox args={[0.018, 0.150, 0.185]} radius={0.024} smoothness={5} position={[-0.032, 0.312, 0]} castShadow>
        <meshPhysicalMaterial {...TINTED} color={extra} />
      </RoundedBox>
      {[0.112, -0.112].map((z) => (
        <RoundedBox key={z} args={[0.180, 0.150, 0.016]} radius={0.026} smoothness={5} position={[-0.155, 0.312, z]} castShadow>
          <meshPhysicalMaterial {...TINTED} color={extra} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.018, 0.140, 0.185]} radius={0.024} smoothness={5} position={[-0.266, 0.312, 0]} castShadow>
        <meshPhysicalMaterial {...TINTED} color={extra} />
      </RoundedBox>
      {/* techo volado */}
      <RoundedBox args={[0.268, 0.026, 0.250]} radius={0.012} smoothness={4} position={[-0.150, 0.416, 0]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedBox>
      {[0.076, -0.076].map((z) => (
        <RoundedBox key={z} args={[0.030, 0.020, 0.034]} radius={0.008} smoothness={4} position={[-0.032, 0.428, z]} castShadow>
          <meshPhysicalMaterial {...TINTED} color="#ffd23a" opacity={0.92} emissive="#ffb300" emissiveIntensity={0.4} />
        </RoundedBox>
      ))}

      {/* guardabarros sobre las ruedas grandes */}
      {[0.148, -0.148].map((z) => (
        <Extruded key={z} shape={fender} depth={0.070} bevel={0.008} position={[-0.150, 0.148, z]}>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </Extruded>
      ))}

      {/* enganche trasero */}
      <RoundedBox args={[0.060, 0.030, 0.028]} radius={0.010} smoothness={4} position={[-0.300, 0.132, 0]} castShadow>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2b2831" />
      </RoundedBox>

      {/* ruedas: pequeñas delante, enormes detrás */}
      <Wheel radius={0.076} width={0.048} hub={accent} position={[0.212, 0.076, 0.118]} roll={roll * 1.9} />
      <Wheel radius={0.076} width={0.048} hub={accent} position={[0.212, 0.076, -0.118]} roll={roll * 1.9} />
      <Wheel radius={0.148} width={0.072} hub={accent} position={[-0.150, 0.148, 0.148]} roll={roll} />
      <Wheel radius={0.148} width={0.072} hub={accent} position={[-0.150, 0.148, -0.148]} roll={roll} />
    </group>
  );
}
