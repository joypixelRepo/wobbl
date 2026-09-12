'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Extruded, RoundedCylinder } from '../parts';
import { PLASTIC, CAR_PAINT, TINTED, SOFT_PLASTIC } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * DRAGÓN — alas plegables y llama de goma.
 *
 * Las alas salen bien separadas del cuerpo y con membrana festoneada:
 * pegadas al lomo, un dragón se lee como un dinosaurio con bultos.
 * ------------------------------------------------------------------ */
export default function Dragon({ body, accent, extra, spin = 0 }: ModelProps) {
  const flap = Math.sin(spin * 0.025) * 0.22;

  const torso = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.390, 0.130);
    s.quadraticCurveTo(-0.245, 0.155, -0.140, 0.250);
    s.quadraticCurveTo(-0.060, 0.336, -0.020, 0.436);
    s.quadraticCurveTo(0.012, 0.512, 0.078, 0.528);
    s.quadraticCurveTo(0.134, 0.520, 0.132, 0.436);
    s.quadraticCurveTo(0.124, 0.334, 0.102, 0.254);
    s.quadraticCurveTo(0.074, 0.172, -0.008, 0.156);
    s.quadraticCurveTo(-0.150, 0.134, -0.268, 0.104);
    s.quadraticCurveTo(-0.346, 0.096, -0.390, 0.130);
    return s;
  }, []);

  // Membrana con tres festones y tres dedos.
  const wing = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.070, 0.280);                              // brazo
    s.quadraticCurveTo(0.150, 0.330, 0.244, 0.306);      // borde de ataque
    s.quadraticCurveTo(0.212, 0.250, 0.196, 0.196);      // festón
    s.quadraticCurveTo(0.168, 0.232, 0.128, 0.190);
    s.quadraticCurveTo(0.110, 0.140, 0.086, 0.098);
    s.quadraticCurveTo(0.060, 0.130, 0.028, 0.088);
    s.quadraticCurveTo(0.014, 0.044, 0, 0);
    return s;
  }, []);

  const spike = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.026, 0);
    s.lineTo(0, 0.072);
    s.lineTo(0.026, 0);
    s.quadraticCurveTo(0, -0.010, -0.026, 0);
    return s;
  }, []);

  return (
    <group rotation={[0, -0.18, 0]}>
      {/* Alas: placas planas en el plano del ala, abiertas hacia atrás.
          Antes las extruía girando el grupo sobre X y quedaban de canto,
          como dos aletas horizontales. */}
      {[1, -1].map((s) => (
        <group
          key={s}
          position={[-0.070, 0.352, s * 0.098]}
          rotation={[0, s * (1.32 + flap * 0.4), -0.10 + flap * s * 0.1]}
        >
          <Extruded shape={wing} depth={0.018} bevel={0.006} curveSegments={22} scale={[1.7, 1.7, 1]}>
            <meshPhysicalMaterial {...CAR_PAINT} color={accent} side={THREE.DoubleSide} />
          </Extruded>
          {/* nervios de la membrana */}
          {[0.35, 0.62].map((t) => (
            <mesh key={t} position={[0.075 + t * 0.22, 0.125 + t * 0.28, 0.014]} rotation={[0, 0, 0.95 - t * 0.5]} castShadow>
              <capsuleGeometry args={[0.011, 0.210 - t * 0.07, 5, 10]} />
              <meshPhysicalMaterial {...PLASTIC} color={body} />
            </mesh>
          ))}
        </group>
      ))}

      {/* tronco y cola */}
      <Extruded shape={torso} depth={0.170} bevel={0.034} curveSegments={32}>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </Extruded>
      <mesh position={[0.044, 0.306, 0]} scale={[0.72, 1.05, 0.98]} castShadow>
        <sphereGeometry args={[0.112, 32, 24]} />
        <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
      </mesh>

      {/* púas del lomo y de la cola */}
      {[[-0.300, 0.140], [-0.230, 0.176], [-0.160, 0.236], [-0.086, 0.324], [-0.020, 0.432]].map(([x, y], i) => (
        <Extruded key={i} shape={spike} depth={0.024} bevel={0.006} position={[x, y, 0]} scale={[1, 0.7 + i * 0.14, 1]} rotation={[0, 0, -0.6 + i * 0.14]}>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </Extruded>
      ))}
      {/* punta de flecha de la cola */}
      <mesh position={[-0.412, 0.126, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <coneGeometry args={[0.048, 0.090, 4]} />
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </mesh>

      {/* patas */}
      {[0.090, -0.090].map((z) => (
        <group key={z}>
          <mesh position={[-0.012, 0.234, z]} scale={[0.85, 1.12, 1]} castShadow receiveShadow>
            <sphereGeometry args={[0.094, 30, 22]} />
            <meshPhysicalMaterial {...CAR_PAINT} color={body} />
          </mesh>
          <RoundedCylinder radius={0.050} height={0.148} bevel={0.022} position={[0.012, 0.110, z]}>
            <meshPhysicalMaterial {...CAR_PAINT} color={body} />
          </RoundedCylinder>
          <RoundedBox args={[0.160, 0.054, 0.106]} radius={0.026} smoothness={6} position={[0.046, 0.027, z]} castShadow receiveShadow>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </RoundedBox>
          {[-0.030, 0, 0.030].map((dz) => (
            <mesh key={dz} position={[0.118, 0.026, z + dz]} rotation={[0, 0, -Math.PI / 2]} castShadow>
              <coneGeometry args={[0.012, 0.030, 12]} />
              <meshPhysicalMaterial {...PLASTIC} color="#f7f3e9" />
            </mesh>
          ))}
        </group>
      ))}

      {/* bracitos */}
      {[0.076, -0.076].map((z) => (
        <RoundedCylinder key={z} radius={0.024} height={0.084} bevel={0.014} position={[0.114, 0.352, z]} rotation={[0, 0, -0.85]}>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedCylinder>
      ))}

      {/* cabeza */}
      <group position={[0.116, 0.578, 0]} rotation={[0, 0, -0.10]}>
        <RoundedBox args={[0.210, 0.136, 0.150]} radius={0.050} smoothness={8} castShadow receiveShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
        {/* hocico alargado */}
        <RoundedBox args={[0.150, 0.082, 0.116]} radius={0.032} smoothness={7} position={[0.140, -0.016, 0]} castShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
        {/* cuernos hacia atrás */}
        {[0.054, -0.054].map((z) => (
          <mesh key={z} position={[-0.088, 0.082, z]} rotation={[0, 0, 1.05]} castShadow>
            <coneGeometry args={[0.022, 0.106, 12]} />
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </mesh>
        ))}
        {/* ojos */}
        {[0.060, -0.060].map((z) => (
          <group key={z} position={[0.056, 0.052, z]}>
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
        {/* dientes que asoman */}
        {[0.046, -0.046].map((z) => (
          <mesh key={z} position={[0.176, -0.046, z]} rotation={[Math.PI, 0, 0]} castShadow>
            <coneGeometry args={[0.013, 0.036, 10]} />
            <meshPhysicalMaterial {...PLASTIC} color="#f8f5ec" />
          </mesh>
        ))}
        {/* fosas nasales humeantes */}
        {[0.030, -0.030].map((z) => (
          <mesh key={z} position={[0.208, 0.006, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 0.012, 10]} />
            <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2d2a34" />
          </mesh>
        ))}
        {/* Llama de goma, desmontable. Va despegada del hocico y corta:
            pegada y larga se leía como un pico y convertía al dragón en
            un pájaro. */}
        <mesh position={[0.300, -0.010, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <coneGeometry args={[0.034, 0.082, 14]} />
          <meshPhysicalMaterial {...TINTED} color="#ff7a1a" opacity={0.82} emissive="#ff5a00" emissiveIntensity={0.45} />
        </mesh>
        <mesh position={[0.282, -0.010, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <coneGeometry args={[0.020, 0.046, 12]} />
          <meshPhysicalMaterial {...TINTED} color="#ffe9a8" opacity={0.9} emissive="#ffd166" emissiveIntensity={0.7} />
        </mesh>
      </group>
    </group>
  );
}
