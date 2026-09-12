'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Wheel, Screw, RoundedCylinder } from '../parts';
import { PLASTIC, TINTED, CHROME, CAR_PAINT } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * COCHE DE CARRERAS — monoplaza de ruedas descubiertas.
 *
 * Ruedas fuera de la carrocería a propósito: un coche cerrado necesita
 * pasos de rueda, y un paso de rueda no sale de una extrusión recta.
 * Así además se ve el neumático entero, que es la pieza que más dice
 * "esto es un objeto físico".
 * ------------------------------------------------------------------ */
export default function Racer({ body, accent, extra, spin = 0 }: ModelProps) {
  const shell = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.285, 0.038);
    s.lineTo(0.215, 0.038);
    s.quadraticCurveTo(0.300, 0.040, 0.302, 0.055);   // morro
    s.quadraticCurveTo(0.302, 0.070, 0.225, 0.080);
    s.lineTo(0.070, 0.092);                            // capó hasta la bañera
    s.lineTo(0.008, 0.092);                            // hueco del piloto
    s.quadraticCurveTo(-0.045, 0.094, -0.062, 0.152);  // arco antivuelco
    s.quadraticCurveTo(-0.120, 0.146, -0.215, 0.128);  // tapa del motor
    s.quadraticCurveTo(-0.272, 0.118, -0.288, 0.090);
    s.lineTo(-0.285, 0.038);

    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.155,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.017,
      bevelSegments: 5,
      curveSegments: 28,
    });
    g.translate(0, 0, -0.0775);
    g.computeVertexNormals();
    return g;
  }, []);

  const roll = spin * 0.035;

  return (
    <group>
      {/* chasis */}
      <mesh geometry={shell} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </mesh>

      {/* franja central y dorsal */}
      <RoundedBox args={[0.30, 0.008, 0.042]} radius={0.003} smoothness={3} position={[0.13, 0.092, 0]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedBox>
      <RoundedCylinder radius={0.033} height={0.006} bevel={0.002} position={[-0.165, 0.140, 0.055]} rotation={[0.16, 0, 0]}>
        <meshPhysicalMaterial {...PLASTIC} color="#f4f1ea" />
      </RoundedCylinder>

      {/* pontones laterales */}
      {[-0.104, 0.104].map((z) => (
        <RoundedBox key={z} args={[0.205, 0.072, 0.062]} radius={0.026} smoothness={5} position={[-0.055, 0.076, z]} castShadow receiveShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
      ))}
      {/* boca de refrigeración */}
      {[-0.107, 0.107].map((z) => (
        <RoundedBox key={z} args={[0.016, 0.044, 0.040]} radius={0.012} smoothness={4} position={[0.042, 0.078, z]}>
          <meshPhysicalMaterial color="#141219" roughness={0.55} metalness={0.1} />
        </RoundedBox>
      ))}

      {/* bañera del piloto: casco y parabrisas */}
      <mesh position={[-0.012, 0.112, 0]} castShadow>
        <sphereGeometry args={[0.040, 32, 24]} />
        <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
      </mesh>
      <mesh position={[-0.004, 0.108, 0]} rotation={[0, 0, -0.18]} castShadow>
        <sphereGeometry args={[0.0405, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
        <meshPhysicalMaterial color="#15131a" roughness={0.25} metalness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.030, 0.098, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.042, 0.007, 12, 28, Math.PI]} />
        <meshPhysicalMaterial {...TINTED} color={extra} />
      </mesh>

      {/* alerón delantero */}
      <RoundedBox args={[0.072, 0.011, 0.285]} radius={0.005} smoothness={4} position={[0.300, 0.036, 0]} rotation={[0, 0, -0.08]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedBox>
      {[-0.140, 0.140].map((z) => (
        <RoundedBox key={z} args={[0.060, 0.038, 0.010]} radius={0.004} smoothness={3} position={[0.300, 0.052, z]} castShadow>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedBox>
      ))}

      {/* alerón trasero: un plano, dos derivas y un pilón central */}
      <RoundedBox args={[0.092, 0.014, 0.235]} radius={0.006} smoothness={4} position={[-0.298, 0.178, 0]} rotation={[0, 0, 0.20]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedBox>
      {[-0.118, 0.118].map((z) => (
        <RoundedBox key={z} args={[0.098, 0.070, 0.011]} radius={0.006} smoothness={4} position={[-0.296, 0.162, z]} castShadow>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.030, 0.070, 0.024]} radius={0.008} smoothness={4} position={[-0.286, 0.146, 0]} castShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </RoundedBox>

      {/* escape */}
      <RoundedCylinder radius={0.013} height={0.048} bevel={0.004} position={[-0.300, 0.106, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshPhysicalMaterial {...CHROME} roughness={0.3} />
      </RoundedCylinder>

      {/* ejes a la vista */}
      {([0.215, -0.200] as const).map((x) => (
        <mesh key={x} position={[x, x > 0 ? 0.078 : 0.096, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.011, 0.011, 0.30, 16]} />
          <meshPhysicalMaterial {...CHROME} />
        </mesh>
      ))}

      {/* ruedas: traseras más grandes, como en un monoplaza */}
      {([0.148, -0.148] as const).map((z) => (
        <Wheel key={`f${z}`} radius={0.078} width={0.058} hub={accent} position={[0.215, 0.078, z]} roll={roll * 1.2} />
      ))}
      {([0.152, -0.152] as const).map((z) => (
        <Wheel key={`r${z}`} radius={0.096} width={0.076} hub={accent} position={[-0.200, 0.096, z]} roll={roll} />
      ))}

      {/* tornillos de los bajos */}
      {([0.14, -0.14] as const).map((x) => (
        <Screw key={x} position={[x, 0.034, 0]} rotation={[Math.PI, 0, 0]} />
      ))}
    </group>
  );
}
