'use client';

import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Lathe, Extruded, RoundedCylinder, noseProfile } from '../parts';
import { PLASTIC, TINTED, CAR_PAINT, CHROME } from '../materials';
import * as THREE from 'three';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * SUBMARINO — periscopio que sube y baja.
 *
 * Casco de revolución con proa ojival y popa afilada: la silueta de un
 * submarino es prácticamente toda su identidad, así que aquí manda el
 * torno y el resto son apliques.
 * ------------------------------------------------------------------ */
export default function Sub({ body, accent, extra, spin = 0 }: ModelProps) {
  const R = 0.125;

  const hull = useMemo<[number, number][]>(() => [
    [0, -0.300],
    [R * 0.30, -0.292],
    [R * 0.62, -0.262],
    [R * 0.88, -0.190],
    [R, -0.090],
    [R, 0.130],
    ...noseProfile(R, 0.130, 0.315, 10),
  ], [R]);

  const fin = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.090, 0);
    s.lineTo(0.030, 0);
    s.quadraticCurveTo(0.026, 0.090, -0.004, 0.104);
    s.quadraticCurveTo(-0.062, 0.108, -0.090, 0.082);
    s.lineTo(-0.090, 0);
    return s;
  }, []);

  return (
    <group position={[0, R + 0.012, 0]}>
      {/* casco, tumbado con la proa hacia +X */}
      <group rotation={[0, 0, -Math.PI / 2]}>
        <Lathe profile={hull} segments={48}>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </Lathe>
      </group>

      {/* franja de flotación */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[R * 1.005, R * 1.005, 0.030, 48]} />
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </mesh>

      {/* vela */}
      <RoundedBox args={[0.150, 0.110, 0.088]} radius={0.030} smoothness={6} position={[-0.010, 0.108, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
      </RoundedBox>
      {/* periscopio */}
      <RoundedCylinder radius={0.011} height={0.110} bevel={0.004} position={[-0.030, 0.205, 0]}>
        <meshPhysicalMaterial {...CHROME} roughness={0.3} />
      </RoundedCylinder>
      <RoundedBox args={[0.050, 0.018, 0.018]} radius={0.007} smoothness={4} position={[-0.012, 0.252, 0]} castShadow>
        <meshPhysicalMaterial {...CHROME} roughness={0.3} />
      </RoundedBox>
      {/* aletas de la vela */}
      {[0.062, -0.062].map((z) => (
        <RoundedBox key={z} args={[0.120, 0.014, 0.046]} radius={0.006} smoothness={4} position={[-0.010, 0.126, z]} castShadow>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedBox>
      ))}

      {/* portilla grande de proa */}
      <group position={[0.238, 0.010, 0]} rotation={[0, 0, Math.PI / 2]}>
        <RoundedCylinder radius={0.058} height={0.030} bevel={0.010}>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedCylinder>
        <RoundedCylinder radius={0.046} height={0.042} bevel={0.008}>
          <meshPhysicalMaterial {...TINTED} color={extra} />
        </RoundedCylinder>
      </group>

      {/* ojos de buey laterales */}
      {[0.080, -0.020].map((x) => (
        [1, -1].map((s) => (
          <RoundedCylinder key={`${x}:${s}`} radius={0.026} height={0.020} bevel={0.006} position={[x, 0.006, s * R * 0.97]} rotation={[Math.PI / 2, 0, 0]}>
            <meshPhysicalMaterial {...TINTED} color={extra} />
          </RoundedCylinder>
        ))
      ))}

      {/* timones de popa */}
      {[0, Math.PI / 2].map((a) => (
        <group key={a} rotation={[a, 0, 0]}>
          <Extruded shape={fin} depth={0.014} bevel={0.005} position={[-0.230, 0.056, 0]}>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </Extruded>
          <Extruded shape={fin} depth={0.014} bevel={0.005} position={[-0.230, -0.056, 0]} rotation={[Math.PI, 0, 0]}>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </Extruded>
        </group>
      ))}

      {/* hélice */}
      <group position={[-0.322, 0, 0]} rotation={[spin * 0.1, 0, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[(i / 3) * Math.PI * 2, 0, 0.35]} castShadow>
            <boxGeometry args={[0.010, 0.070, 0.030]} />
            <meshPhysicalMaterial {...CHROME} color="#c9a24a" roughness={0.3} />
          </mesh>
        ))}
        <RoundedCylinder radius={0.018} height={0.030} bevel={0.006} rotation={[0, 0, Math.PI / 2]}>
          <meshPhysicalMaterial {...CHROME} color="#c9a24a" roughness={0.28} />
        </RoundedCylinder>
      </group>
    </group>
  );
}
