'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Extruded, RoundedCylinder } from '../parts';
import { PLASTIC, CAR_PAINT, SOFT_PLASTIC } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * DINOSAURIO — nueve articulaciones y mandíbula con muelle.
 *
 * Va erguido sobre dos patas, con la cola de contrapeso. La primera
 * versión salía tumbada y larga y se leía como un cocodrilo: en un
 * bípedo la masa tiene que estar ALTA y la cola bajar hacia atrás.
 * ------------------------------------------------------------------ */
export default function Dino({ body, accent, extra, spin = 0 }: ModelProps) {
  const jaw = Math.max(0, Math.sin(spin * 0.03)) * 0.38;

  // Silueta de perfil: cola baja atrás, tronco alto, cuello subiendo.
  const torso = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.400, 0.108);                            // punta de la cola
    s.quadraticCurveTo(-0.250, 0.140, -0.140, 0.245);   // lomo de la cola
    s.quadraticCurveTo(-0.060, 0.330, -0.020, 0.430);
    s.quadraticCurveTo(0.010, 0.505, 0.075, 0.520);     // cuello
    s.quadraticCurveTo(0.130, 0.512, 0.128, 0.430);
    s.quadraticCurveTo(0.120, 0.330, 0.098, 0.250);     // pecho
    s.quadraticCurveTo(0.070, 0.168, -0.010, 0.152);    // barriga
    s.quadraticCurveTo(-0.150, 0.130, -0.270, 0.098);
    s.quadraticCurveTo(-0.350, 0.086, -0.400, 0.108);
    return s;
  }, []);

  const plate = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.028, 0);
    s.quadraticCurveTo(0, 0.058, 0.028, 0);
    s.quadraticCurveTo(0, -0.010, -0.028, 0);
    return s;
  }, []);

  return (
    <group>
      {/* tronco y cola */}
      <Extruded shape={torso} depth={0.165} bevel={0.034} curveSegments={32}>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </Extruded>
      {/* barriga clara */}
      <mesh position={[0.040, 0.300, 0]} scale={[0.72, 1.05, 0.98]} castShadow>
        <sphereGeometry args={[0.110, 32, 24]} />
        <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
      </mesh>

      {/* placas del lomo, siguiendo la curva */}
      {[[-0.255, 0.150], [-0.170, 0.222], [-0.085, 0.320], [-0.018, 0.428]].map(([x, y], i) => (
        <Extruded key={i} shape={plate} depth={0.028} bevel={0.008} position={[x, y, 0]} scale={[1, 1 + i * 0.16, 1]} rotation={[0, 0, -0.5 + i * 0.16]}>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </Extruded>
      ))}

      {/* patas: gruesas, con muslo y pie grande */}
      {[0.086, -0.086].map((z) => (
        <group key={z}>
          <mesh position={[-0.010, 0.230, z]} scale={[0.85, 1.15, 1]} castShadow receiveShadow>
            <sphereGeometry args={[0.096, 30, 22]} />
            <meshPhysicalMaterial {...CAR_PAINT} color={body} />
          </mesh>
          <RoundedCylinder radius={0.052} height={0.150} bevel={0.024} position={[0.012, 0.108, z]}>
            <meshPhysicalMaterial {...CAR_PAINT} color={body} />
          </RoundedCylinder>
          <RoundedBox args={[0.165, 0.056, 0.108]} radius={0.026} smoothness={6} position={[0.046, 0.028, z]} castShadow receiveShadow>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </RoundedBox>
          {[-0.032, 0, 0.032].map((dz) => (
            <mesh key={dz} position={[0.122, 0.026, z + dz]} rotation={[0, 0, -Math.PI / 2]} castShadow>
              <coneGeometry args={[0.013, 0.032, 12]} />
              <meshPhysicalMaterial {...PLASTIC} color="#f7f3e9" />
            </mesh>
          ))}
        </group>
      ))}

      {/* bracitos */}
      {[0.074, -0.074].map((z) => (
        <group key={z}>
          <RoundedCylinder radius={0.024} height={0.086} bevel={0.014} position={[0.112, 0.348, z]} rotation={[0, 0, -0.85]}>
            <meshPhysicalMaterial {...CAR_PAINT} color={body} />
          </RoundedCylinder>
          <mesh position={[0.156, 0.318, z]} castShadow>
            <sphereGeometry args={[0.026, 20, 14]} />
            <meshPhysicalMaterial {...CAR_PAINT} color={body} />
          </mesh>
        </group>
      ))}

      {/* cabeza, encima del cuello */}
      <group position={[0.108, 0.570, 0]} rotation={[0, 0, -0.08]}>
        <RoundedBox args={[0.215, 0.140, 0.155]} radius={0.052} smoothness={8} castShadow receiveShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
        {/* morro */}
        <RoundedBox args={[0.115, 0.086, 0.132]} radius={0.034} smoothness={7} position={[0.118, -0.012, 0]} castShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
        {/* mandíbula */}
        <group position={[0.010, -0.048, 0]} rotation={[0, 0, -jaw]}>
          <RoundedBox args={[0.215, 0.052, 0.138]} radius={0.024} smoothness={6} position={[0.070, -0.014, 0]} castShadow>
            <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
          </RoundedBox>
          {[0.060, 0.104, 0.148].map((x) => (
            [0.048, -0.048].map((z) => (
              <mesh key={`${x}:${z}`} position={[x, 0.016, z]} castShadow>
                <coneGeometry args={[0.013, 0.032, 10]} />
                <meshPhysicalMaterial {...PLASTIC} color="#f8f5ec" />
              </mesh>
            ))
          ))}
        </group>
        {/* ojos, hundidos en la cabeza y mirando al frente */}
        {[0.062, -0.062].map((z) => (
          <group key={z} position={[0.062, 0.056, z]}>
            <mesh castShadow>
              <sphereGeometry args={[0.030, 26, 20]} />
              <meshPhysicalMaterial {...PLASTIC} color="#fbf8f2" />
            </mesh>
            <mesh position={[0.020, 0, 0]}>
              <sphereGeometry args={[0.015, 20, 14]} />
              <meshPhysicalMaterial color="#15131a" roughness={0.18} clearcoat={1} />
            </mesh>
          </group>
        ))}
        {/* ceja: lo que le da cara de simpático y no de reptil */}
        {[0.062, -0.062].map((z) => (
          <RoundedBox key={z} args={[0.056, 0.020, 0.046]} radius={0.009} smoothness={4} position={[0.058, 0.090, z]} rotation={[0, 0, 0.18]} castShadow>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </RoundedBox>
        ))}
        {/* fosas nasales */}
        {[0.028, -0.028].map((z) => (
          <mesh key={z} position={[0.170, 0.016, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 0.012, 10]} />
            <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2d2a34" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
