'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Extruded, RoundedCylinder } from '../parts';
import { PLASTIC, TINTED, CAR_PAINT, SOFT_PLASTIC, RUBBER, CHROME } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * EXCAVADORA — orugas de goma y brazo articulado.
 *
 * La oruga es una extrusión con agujero: el contorno exterior menos el
 * interior, para que sea un aro de goma real por el que asoman las
 * ruedas motrices. Un bloque macizo se lee como un zapato.
 * ------------------------------------------------------------------ */
export default function Digger({ body, accent, extra, spin = 0 }: ModelProps) {
  const track = useMemo(() => {
    const outer = (w: number, h: number, r: number) => {
      const p = new THREE.Path();
      p.absarc(-w, 0, h, Math.PI / 2, -Math.PI / 2, true);
      p.absarc(w, 0, r, -Math.PI / 2, Math.PI / 2, true);
      return p;
    };
    const s = new THREE.Shape(outer(0.150, 0.082, 0.082).getPoints(40));
    const hole = new THREE.Path(outer(0.150, 0.046, 0.046).getPoints(40));
    s.holes.push(hole);
    return s;
  }, []);

  const bucket = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.090);
    s.lineTo(0.108, 0.090);
    s.quadraticCurveTo(0.118, 0.020, 0.070, -0.034);
    s.quadraticCurveTo(0.020, -0.070, -0.020, -0.040);
    s.quadraticCurveTo(-0.024, 0.030, 0, 0.090);
    return s;
  }, []);

  const swing = Math.sin(spin * 0.02) * 0.12;

  return (
    <group>
      {/* orugas */}
      {[0.128, -0.128].map((z) => (
        <group key={z} position={[0, 0.085, z]}>
          <Extruded shape={track} depth={0.070} bevel={0.012} curveSegments={20}>
            <meshPhysicalMaterial {...RUBBER} />
          </Extruded>
          {/* tacos */}
          {Array.from({ length: 14 }, (_, i) => (
            <RoundedBox key={i} args={[0.024, 0.012, 0.078]} radius={0.004} smoothness={3} position={[-0.150 + i * 0.023, 0.084, 0]} castShadow>
              <meshPhysicalMaterial {...RUBBER} roughness={0.95} />
            </RoundedBox>
          ))}
          {/* ruedas motrices asomando por el aro */}
          {[0.150, -0.150].map((x) => (
            <RoundedCylinder key={x} radius={0.044} height={0.058} bevel={0.010} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <meshPhysicalMaterial {...PLASTIC} color={accent} />
            </RoundedCylinder>
          ))}
        </group>
      ))}
      {/* travesaño entre orugas */}
      <RoundedBox args={[0.210, 0.052, 0.200]} radius={0.014} smoothness={4} position={[0, 0.085, 0]} castShadow>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2c2932" />
      </RoundedBox>

      {/* corona de giro */}
      <RoundedCylinder radius={0.108} height={0.034} bevel={0.010} position={[0, 0.158, 0]}>
        <meshPhysicalMaterial {...CHROME} color="#3f3b46" roughness={0.4} />
      </RoundedCylinder>

      {/* superestructura, que gira sobre la corona */}
      <group position={[0, 0.176, 0]} rotation={[0, swing, 0]}>
        {/* contrapeso y carrocería */}
        <RoundedBox args={[0.300, 0.120, 0.220]} radius={0.028} smoothness={6} position={[-0.060, 0.062, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
        {/* cabina */}
        <RoundedBox args={[0.150, 0.170, 0.150]} radius={0.026} smoothness={6} position={[0.055, 0.100, 0.038]} castShadow receiveShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
        <RoundedBox args={[0.158, 0.112, 0.158]} radius={0.028} smoothness={6} position={[0.055, 0.116, 0.038]} castShadow>
          <meshPhysicalMaterial {...TINTED} color={extra} />
        </RoundedBox>
        <RoundedBox args={[0.164, 0.018, 0.164]} radius={0.008} smoothness={4} position={[0.055, 0.180, 0.038]} castShadow>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedBox>
        {/* escape */}
        <RoundedCylinder radius={0.014} height={0.070} bevel={0.005} position={[-0.020, 0.150, -0.070]}>
          <meshPhysicalMaterial {...CHROME} roughness={0.35} />
        </RoundedCylinder>

        {/* pluma */}
        <group position={[0.118, 0.040, -0.048]} rotation={[0, 0, 0.62]}>
          <RoundedBox args={[0.310, 0.060, 0.062]} radius={0.020} smoothness={5} position={[0.140, 0, 0]} castShadow>
            <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
          </RoundedBox>
          <RoundedCylinder radius={0.026} height={0.070} bevel={0.008} rotation={[Math.PI / 2, 0, 0]}>
            <meshPhysicalMaterial {...CHROME} color="#4a4550" roughness={0.4} />
          </RoundedCylinder>
          {/* cilindro hidráulico */}
          <RoundedCylinder radius={0.016} height={0.150} bevel={0.005} position={[0.100, -0.052, 0.046]} rotation={[0, 0, Math.PI / 2 - 0.25]}>
            <meshPhysicalMaterial {...CHROME} roughness={0.22} />
          </RoundedCylinder>

          {/* balancín */}
          <group position={[0.296, 0.008, 0]} rotation={[0, 0, -1.32]}>
            <RoundedBox args={[0.230, 0.048, 0.052]} radius={0.017} smoothness={5} position={[0.100, 0, 0]} castShadow>
              <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
            </RoundedBox>
            <RoundedCylinder radius={0.022} height={0.060} bevel={0.007} rotation={[Math.PI / 2, 0, 0]}>
              <meshPhysicalMaterial {...CHROME} color="#4a4550" roughness={0.4} />
            </RoundedCylinder>

            {/* cazo */}
            <group position={[0.212, 0, 0]} rotation={[0, 0, -0.55]}>
              <Extruded shape={bucket} depth={0.130} bevel={0.010} curveSegments={18}>
                <meshPhysicalMaterial {...CAR_PAINT} color={body} />
              </Extruded>
              {[-0.045, 0, 0.045].map((z) => (
                <mesh key={z} position={[0.080, -0.062, z]} rotation={[0, 0, 0.4]} castShadow>
                  <coneGeometry args={[0.014, 0.044, 4]} />
                  <meshPhysicalMaterial {...CHROME} color="#5b5560" roughness={0.45} />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
