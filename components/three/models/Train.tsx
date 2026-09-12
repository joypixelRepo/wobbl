'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Lathe, Extruded, Wheel, RoundedCylinder } from '../parts';
import { PLASTIC, TINTED, CHROME, CAR_PAINT, SOFT_PLASTIC } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * TREN DE VAPOR — locomotora con enganche magnético.
 *
 * La caldera es una revolución tumbada sobre X, con las virolas
 * hundidas como anillos: una caldera hecha de cilindros de distinto
 * grosor deja escalones que en una pieza torneada no existen.
 * ------------------------------------------------------------------ */
export default function Train({ body, accent, extra, spin = 0 }: ModelProps) {
  const R = 0.105;
  const roll = spin * 0.05;

  const boiler = useMemo<[number, number][]>(() => [
    [0, -0.150],
    [R * 0.97, -0.150],
    [R, -0.138],
    [R, 0.200],
    [R * 1.06, 0.212],
    [R * 1.06, 0.244],
    [R * 0.98, 0.256],
    [0, 0.256],
  ], [R]);

  const cab = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.185, 0.010);
    s.lineTo(0.020, 0.010);
    s.lineTo(0.020, 0.190);
    s.quadraticCurveTo(0.016, 0.232, -0.030, 0.238);
    s.lineTo(-0.148, 0.238);
    s.quadraticCurveTo(-0.186, 0.234, -0.185, 0.196);
    s.lineTo(-0.185, 0.010);
    return s;
  }, []);

  const catcher = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.092);
    s.lineTo(0.088, 0.092);
    s.lineTo(0.114, -0.012);
    s.lineTo(0, -0.012);
    s.lineTo(0, 0.092);
    return s;
  }, []);

  return (
    <group>
      {/* bastidor */}
      <RoundedBox args={[0.620, 0.040, 0.200]} radius={0.014} smoothness={4} position={[0, 0.072, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2a2730" />
      </RoundedBox>

      {/* caldera, tumbada sobre X con el frente hacia +X */}
      <group rotation={[0, 0, -Math.PI / 2]} position={[0.052, 0.196, 0]}>
        <Lathe profile={boiler}>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </Lathe>
      </group>

      {/* puerta de la caja de humos */}
      <group position={[0.310, 0.196, 0]} rotation={[0, 0, Math.PI / 2]}>
        <RoundedCylinder radius={R * 0.80} height={0.018} bevel={0.006}>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedCylinder>
        <RoundedCylinder radius={R * 0.30} height={0.030} bevel={0.006}>
          <meshPhysicalMaterial {...CHROME} />
        </RoundedCylinder>
      </group>
      {/* faro */}
      <group position={[0.318, 0.290, 0]} rotation={[0, 0, Math.PI / 2]}>
        <RoundedCylinder radius={0.032} height={0.040} bevel={0.008}>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedCylinder>
        <RoundedCylinder radius={0.024} height={0.050} bevel={0.006}>
          <meshPhysicalMaterial {...TINTED} color="#fff4dc" opacity={0.92} emissive="#ffeec0" emissiveIntensity={0.4} />
        </RoundedCylinder>
      </group>

      {/* virolas hundidas */}
      {[0.070, 0.170].map((x) => (
        <mesh key={x} position={[x, 0.196, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[R * 0.99, 0.008, 10, 56]} />
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </mesh>
      ))}

      {/* chimenea y domo */}
      <Lathe
        profile={[[0.030, 0], [0.030, 0.070], [0.046, 0.082], [0.048, 0.100], [0.030, 0.100], [0, 0.100]]}
        position={[0.252, 0.290, 0]}
      >
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </Lathe>
      <Lathe
        profile={[[0.046, 0], [0.046, 0.030], [0.036, 0.048], [0, 0.052]]}
        position={[0.120, 0.292, 0]}
      >
        <meshPhysicalMaterial {...CHROME} color="#e0c98a" roughness={0.22} />
      </Lathe>

      {/* cabina */}
      <Extruded shape={cab} depth={0.215} bevel={0.016} position={[-0.190, 0.092, 0]}>
        <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
      </Extruded>
      {/* ventanas de la cabina */}
      {[0.112, -0.112].map((z) => (
        <RoundedBox key={z} args={[0.090, 0.078, 0.014]} radius={0.020} smoothness={5} position={[-0.270, 0.252, z]} castShadow>
          <meshPhysicalMaterial {...TINTED} color={extra} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.014, 0.070, 0.150]} radius={0.020} smoothness={5} position={[-0.172, 0.252, 0]} castShadow>
        <meshPhysicalMaterial {...TINTED} color={extra} />
      </RoundedBox>
      {/* techo volado */}
      <RoundedBox args={[0.245, 0.020, 0.245]} radius={0.010} smoothness={4} position={[-0.276, 0.346, 0]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={body} />
      </RoundedBox>

      {/* quitapiedras */}
      <Extruded shape={catcher} depth={0.190} bevel={0.010} position={[0.300, 0.060, 0]}>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </Extruded>

      {/* enganche trasero */}
      <RoundedCylinder radius={0.020} height={0.048} bevel={0.006} position={[-0.412, 0.086, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshPhysicalMaterial {...CHROME} />
      </RoundedCylinder>

      {/* ruedas: dos portadoras delante y dos motrices grandes detrás */}
      <Wheel radius={0.052} width={0.040} hub={accent} position={[0.236, 0.052, 0.118]} roll={roll * 1.7} />
      <Wheel radius={0.052} width={0.040} hub={accent} position={[0.236, 0.052, -0.118]} roll={roll * 1.7} />
      {[0.020, -0.160].map((x) => (
        <group key={x}>
          <Wheel radius={0.090} width={0.048} hub={accent} position={[x, 0.090, 0.118]} roll={roll} />
          <Wheel radius={0.090} width={0.048} hub={accent} position={[x, 0.090, -0.118]} roll={roll} />
        </group>
      ))}
      {/* biela: une las dos motrices y sube y baja con ellas */}
      {[0.126, -0.126].map((z) => (
        <RoundedBox
          key={z}
          args={[0.200, 0.016, 0.010]}
          radius={0.005}
          smoothness={3}
          position={[-0.070, 0.090 + Math.sin(roll) * 0.050, z * 1.16]}
          castShadow
        >
          <meshPhysicalMaterial {...CHROME} roughness={0.26} />
        </RoundedBox>
      ))}
    </group>
  );
}
