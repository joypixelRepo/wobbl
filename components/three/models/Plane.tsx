'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Lathe, Extruded, Wheel, noseProfile } from '../parts';
import { PLASTIC, TINTED, CHROME, CAR_PAINT } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * AVIONETA — hélice libre y alas desmontables.
 *
 * El fuselaje es una revolución tumbada sobre el eje X. Las alas se
 * extruyen de su planta real, con punta más estrecha que raíz: un ala
 * de grosor constante se lee como una tabla clavada al costado.
 * ------------------------------------------------------------------ */
export default function Plane({ body, accent, extra, spin = 0 }: ModelProps) {
  const L = 0.60;

  const fuselage = useMemo<[number, number][]>(() => [
    [0.010, 0],
    [0.030, 0.030],
    [0.052, 0.085],
    [0.068, 0.160],
    [0.074, 0.250],
    [0.074, 0.400],
    ...noseProfile(0.074, 0.400, L, 8),
  ], [L]);

  // Planta del ala: cuerda ancha en la raíz, estrecha en la punta.
  const wing = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.090, 0);
    s.lineTo(0.075, 0);
    s.quadraticCurveTo(0.070, 0.290, 0.035, 0.330);
    s.quadraticCurveTo(0.010, 0.348, -0.030, 0.330);
    s.quadraticCurveTo(-0.078, 0.300, -0.090, 0);
    return s;
  }, []);

  const fin = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.085, 0.055);
    s.lineTo(0.010, 0.055);
    s.quadraticCurveTo(0.006, 0.150, -0.020, 0.170);
    s.quadraticCurveTo(-0.055, 0.178, -0.085, 0.150);
    s.lineTo(-0.085, 0.055);
    return s;
  }, []);

  const blade = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.017, 0.018);
    s.quadraticCurveTo(-0.021, 0.110, -0.010, 0.150);
    s.quadraticCurveTo(0, 0.163, 0.010, 0.150);
    s.quadraticCurveTo(0.021, 0.110, 0.017, 0.018);
    s.quadraticCurveTo(0, 0.008, -0.017, 0.018);
    return s;
  }, []);

  const prop = spin * 0.12;

  return (
    <group position={[0, 0.118, 0]}>
      {/* fuselaje, tumbado sobre X con el morro hacia +X */}
      <group rotation={[0, 0, -Math.PI / 2]}>
        <Lathe profile={fuselage} position={[0, -0.26, 0]}>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </Lathe>
      </group>

      {/* franja lateral */}
      <mesh position={[0.03, -0.006, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.0742, 0.0742, 0.30, 40, 1, true, Math.PI * 0.92, Math.PI * 0.16]} />
        <meshPhysicalMaterial {...PLASTIC} color={accent} side={THREE.DoubleSide} />
      </mesh>

      {/* cabina acristalada */}
      <RoundedBox args={[0.150, 0.070, 0.118]} radius={0.034} smoothness={6} position={[0.045, 0.056, 0]} castShadow>
        <meshPhysicalMaterial {...TINTED} color={extra} />
      </RoundedBox>
      <RoundedBox args={[0.158, 0.016, 0.126]} radius={0.007} smoothness={4} position={[0.045, 0.024, 0]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedBox>

      {/* alas: una por lado, con diedro */}
      {[1, -1].map((s) => (
        <Extruded
          key={s}
          shape={wing}
          depth={0.020}
          bevel={0.008}
          position={[0.010, -0.004, 0]}
          rotation={[s * (Math.PI / 2 - 0.07), 0, 0]}
        >
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </Extruded>
      ))}
      {/* punta de ala en color de contraste */}
      {[0.318, -0.318].map((z) => (
        <RoundedBox key={z} args={[0.070, 0.020, 0.028]} radius={0.009} smoothness={4} position={[-0.010, 0.002, z]} castShadow>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedBox>
      ))}

      {/* deriva y estabilizador */}
      <Extruded shape={fin} depth={0.016} bevel={0.006} position={[-0.235, 0.010, 0]}>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </Extruded>
      <RoundedBox args={[0.080, 0.016, 0.200]} radius={0.007} smoothness={4} position={[-0.250, 0.020, 0]} castShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </RoundedBox>

      {/* hélice: buje y dos palas */}
      <group position={[0.330, 0, 0]} rotation={[prop, 0, 0]}>
        {[0, Math.PI].map((a) => (
          <Extruded key={a} shape={blade} depth={0.011} bevel={0.004} rotation={[0, Math.PI / 2, a]} position={[0, 0, 0]}>
            <meshPhysicalMaterial {...PLASTIC} color="#23212a" roughness={0.35} />
          </Extruded>
        ))}
      </group>
      <group rotation={[0, 0, -Math.PI / 2]}>
        <Lathe profile={noseProfile(0.030, 0.330, 0.372, 7)}>
          <meshPhysicalMaterial {...CHROME} />
        </Lathe>
      </group>

      {/* tren de aterrizaje */}
      {[0.082, -0.082].map((z) => (
        <mesh key={z} position={[0.055, -0.074, z]} castShadow>
          <cylinderGeometry args={[0.0085, 0.0085, 0.062, 12]} />
          <meshPhysicalMaterial {...CHROME} roughness={0.3} />
        </mesh>
      ))}
      {[0.082, -0.082].map((z) => (
        <Wheel key={`w${z}`} radius={0.042} width={0.026} hub={accent} position={[0.055, -0.105, z]} roll={spin * 0.03} />
      ))}
      <Wheel radius={0.022} width={0.016} hub={accent} position={[-0.250, -0.062, 0]} />
      <mesh position={[-0.250, -0.030, 0]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.044, 10]} />
        <meshPhysicalMaterial {...CHROME} roughness={0.3} />
      </mesh>
    </group>
  );
}
