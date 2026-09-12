'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Extruded, Wheel } from '../parts';
import { PLASTIC, TINTED, CAR_PAINT, SOFT_PLASTIC } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * AUTOBÚS ESCOLAR — puerta de dos hojas.
 *
 * Las ventanillas van montadas un pelo por fuera de la chapa en vez de
 * hundidas: hundirlas obligaría a abrir huecos en la extrusión, y a
 * este tamaño el marco saliente se lee igual de bien.
 * ------------------------------------------------------------------ */
export default function Bus({ body, accent, extra, spin = 0 }: ModelProps) {
  const D = 0.235;
  const side = D / 2 + 0.016;

  const shell = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.330, 0.062);
    s.lineTo(0.286, 0.062);
    s.quadraticCurveTo(0.334, 0.064, 0.336, 0.105);  // morro
    s.lineTo(0.336, 0.268);
    s.quadraticCurveTo(0.330, 0.320, 0.286, 0.330);  // techo delantero
    s.lineTo(-0.296, 0.330);
    s.quadraticCurveTo(-0.332, 0.326, -0.332, 0.288);
    s.lineTo(-0.330, 0.062);
    return s;
  }, []);

  const roll = spin * 0.04;

  return (
    <group>
      {/* chapa */}
      <Extruded shape={shell} depth={D} bevel={0.018} curveSegments={28}>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </Extruded>

      {/* franja corrida, la que hace que se lea como autobús escolar */}
      {[side + 0.001, -side - 0.001].map((z) => (
        <RoundedBox key={z} args={[0.650, 0.034, 0.006]} radius={0.003} smoothness={3} position={[0.002, 0.128, z]} castShadow>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedBox>
      ))}

      {/* ventanillas laterales */}
      {[side, -side].map((z) => (
        <group key={z}>
          {[-0.228, -0.108, 0.012, 0.132].map((x) => (
            <group key={x}>
              <RoundedBox args={[0.100, 0.108, 0.012]} radius={0.022} smoothness={5} position={[x, 0.232, z]} castShadow>
                <meshPhysicalMaterial {...TINTED} color={extra} />
              </RoundedBox>
              <RoundedBox args={[0.112, 0.120, 0.008]} radius={0.026} smoothness={5} position={[x, 0.232, z - Math.sign(z) * 0.003]}>
                <meshPhysicalMaterial {...PLASTIC} color={accent} />
              </RoundedBox>
            </group>
          ))}
        </group>
      ))}

      {/* parabrisas y luna trasera, enrasados con la chapa: sobresalidos
          se leían como dos placas colgando del morro */}
      <RoundedBox args={[0.014, 0.116, 0.190]} radius={0.024} smoothness={6} position={[0.331, 0.230, 0]} castShadow>
        <meshPhysicalMaterial {...TINTED} color={extra} />
      </RoundedBox>
      <RoundedBox args={[0.012, 0.098, 0.166]} radius={0.022} smoothness={5} position={[-0.328, 0.232, 0]} castShadow>
        <meshPhysicalMaterial {...TINTED} color={extra} />
      </RoundedBox>

      {/* techo */}
      <RoundedBox args={[0.560, 0.022, 0.180]} radius={0.010} smoothness={4} position={[0, 0.336, 0]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedBox>
      {[0.180, -0.180].map((x) => (
        <RoundedBox key={x} args={[0.044, 0.020, 0.044]} radius={0.009} smoothness={4} position={[x, 0.350, 0.048]} castShadow>
          <meshPhysicalMaterial {...PLASTIC} color="#ff5c46" emissive="#ff3a20" emissiveIntensity={0.25} />
        </RoundedBox>
      ))}

      {/* puerta de dos hojas */}
      {[0.196, 0.256].map((x) => (
        <RoundedBox key={x} args={[0.056, 0.176, 0.012]} radius={0.012} smoothness={5} position={[x, 0.156, side]} castShadow>
          <meshPhysicalMaterial {...TINTED} color={extra} />
        </RoundedBox>
      ))}

      {/* señal de stop abatible */}
      <group position={[-0.150, 0.170, -side]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.036, 10]} />
          <meshPhysicalMaterial {...SOFT_PLASTIC} color="#26232c" />
        </mesh>
        <mesh position={[0, 0, -0.026]} rotation={[0, 0, Math.PI / 8]} castShadow>
          <cylinderGeometry args={[0.052, 0.052, 0.010, 8]} />
          <meshPhysicalMaterial {...PLASTIC} color="#e3201a" />
        </mesh>
      </group>

      {/* parachoques y faros */}
      {[0.344, -0.340].map((x) => (
        <RoundedBox key={x} args={[0.024, 0.040, 0.244]} radius={0.011} smoothness={4} position={[x, 0.082, 0]} castShadow>
          <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2c2933" />
        </RoundedBox>
      ))}
      {[0.082, -0.082].map((z) => (
        <RoundedBox key={z} args={[0.016, 0.034, 0.050]} radius={0.014} smoothness={5} position={[0.344, 0.140, z]} castShadow>
          <meshPhysicalMaterial {...TINTED} color="#fff3da" opacity={0.9} emissive="#ffeec2" emissiveIntensity={0.3} />
        </RoundedBox>
      ))}

      {/* ruedas */}
      {([[0.214, 0.158], [0.214, -0.158], [-0.212, 0.158], [-0.212, -0.158]] as const).map(([x, z]) => (
        <Wheel key={`${x}:${z}`} radius={0.078} width={0.048} hub={accent} position={[x, 0.078, z]} roll={roll} />
      ))}
    </group>
  );
}
