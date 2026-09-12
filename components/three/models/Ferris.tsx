'use client';

import { RoundedBox } from '@react-three/drei';
import { RoundedCylinder } from '../parts';
import { PLASTIC, TINTED, CAR_PAINT, CHROME, SOFT_PLASTIC } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * NORIA — ocho cabinas y manivela.
 *
 * Las cabinas cuelgan de un pasador y se contrarrestan el giro de la
 * rueda, así que quedan horizontales pase lo que pase. Es el detalle
 * que separa una noria de una rueda con cajas pegadas.
 * ------------------------------------------------------------------ */
export default function Ferris({ body, accent, extra, spin = 0 }: ModelProps) {
  const turn = spin * 0.014;
  const R = 0.285;
  const cars = 8;
  const hubY = 0.420;

  return (
    <group>
      {/* base */}
      <RoundedBox args={[0.560, 0.030, 0.300]} radius={0.012} smoothness={4} position={[0, 0.015, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color={extra} />
      </RoundedBox>

      {/* patas en A, a los dos lados */}
      {[0.110, -0.110].map((z) => (
        [1, -1].map((s) => (
          <RoundedBox
            key={`${z}:${s}`}
            args={[0.028, 0.470, 0.028]}
            radius={0.010}
            smoothness={4}
            position={[s * 0.115, hubY / 2 + 0.020, z]}
            rotation={[0, 0, s * 0.255]}
            castShadow
          >
            <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
          </RoundedBox>
        ))
      ))}
      {/* eje */}
      <RoundedCylinder radius={0.020} height={0.280} bevel={0.007} position={[0, hubY, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial {...CHROME} roughness={0.3} />
      </RoundedCylinder>

      {/* rueda: dos aros con radios */}
      {[0.072, -0.072].map((z) => (
        <group key={z} position={[0, hubY, z]} rotation={[0, 0, turn]}>
          <mesh castShadow receiveShadow>
            <torusGeometry args={[R, 0.017, 14, 72]} />
            <meshPhysicalMaterial {...CAR_PAINT} color={body} />
          </mesh>
          <mesh castShadow>
            <torusGeometry args={[R * 0.60, 0.012, 12, 56]} />
            <meshPhysicalMaterial {...CAR_PAINT} color={body} />
          </mesh>
          {Array.from({ length: cars }, (_, i) => (
            <RoundedBox
              key={i}
              args={[0.014, R * 2 - 0.020, 0.014]}
              radius={0.005}
              smoothness={3}
              rotation={[0, 0, (i / cars) * Math.PI]}
              castShadow
            >
              <meshPhysicalMaterial {...CAR_PAINT} color={body} />
            </RoundedBox>
          ))}
          <RoundedCylinder radius={0.048} height={0.024} bevel={0.008} rotation={[Math.PI / 2, 0, 0]}>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </RoundedCylinder>
        </group>
      ))}

      {/* cabinas: cuelgan y se mantienen horizontales */}
      {Array.from({ length: cars }, (_, i) => {
        const a = (i / cars) * Math.PI * 2 + turn;
        const x = Math.cos(a) * R;
        const y = hubY + Math.sin(a) * R;
        return (
          <group key={i} position={[x, y, 0]}>
            <RoundedCylinder radius={0.009} height={0.018} bevel={0.003} rotation={[Math.PI / 2, 0, 0]}>
              <meshPhysicalMaterial {...CHROME} roughness={0.32} />
            </RoundedCylinder>
            <group position={[0, -0.052, 0]}>
              <RoundedBox args={[0.082, 0.070, 0.120]} radius={0.022} smoothness={6} castShadow receiveShadow>
                <meshPhysicalMaterial {...CAR_PAINT} color={i % 2 ? accent : extra} />
              </RoundedBox>
              <RoundedBox args={[0.090, 0.034, 0.128]} radius={0.016} smoothness={5} position={[0, 0.014, 0]} castShadow>
                <meshPhysicalMaterial {...TINTED} color="#cfe8ff" opacity={0.55} />
              </RoundedBox>
              <RoundedBox args={[0.094, 0.014, 0.132]} radius={0.006} smoothness={4} position={[0, 0.040, 0]} castShadow>
                <meshPhysicalMaterial {...PLASTIC} color={body} />
              </RoundedBox>
            </group>
          </group>
        );
      })}

      {/* taquilla */}
      <group position={[0.230, 0.020, 0.060]}>
        <RoundedBox args={[0.120, 0.120, 0.100]} radius={0.016} smoothness={5} position={[0, 0.060, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
        <RoundedBox args={[0.080, 0.050, 0.014]} radius={0.012} smoothness={5} position={[0, 0.072, 0.050]} castShadow>
          <meshPhysicalMaterial {...TINTED} color="#cfe8ff" opacity={0.6} />
        </RoundedBox>
        <mesh position={[0, 0.142, 0]} castShadow>
          <coneGeometry args={[0.100, 0.062, 4, 1, false, Math.PI / 4]} />
          <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
        </mesh>
      </group>

      {/* manivela */}
      <group position={[0.148, hubY, -0.150]} rotation={[0, 0, turn * 3]}>
        <RoundedCylinder radius={0.010} height={0.032} bevel={0.004} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial {...CHROME} roughness={0.3} />
        </RoundedCylinder>
        <RoundedCylinder radius={0.007} height={0.056} bevel={0.003} position={[0.026, 0.026, -0.014]}>
          <meshPhysicalMaterial {...CHROME} roughness={0.3} />
        </RoundedCylinder>
        <mesh position={[0.026, 0.058, -0.014]} castShadow>
          <sphereGeometry args={[0.020, 20, 14]} />
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </mesh>
      </group>
    </group>
  );
}
