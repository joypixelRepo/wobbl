'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { Extruded, Wheel, RoundedCylinder } from '../parts';
import { PLASTIC, TINTED, CAR_PAINT, SOFT_PLASTIC, CHROME } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * CAMIÓN DE BOMBEROS — escala extensible y giratoria.
 *
 * Cabina y caja son la misma silueta extruida, con el escalón entre
 * las dos dentro del propio contorno: partirlo en dos piezas dejaría
 * una junta que en un camión de una pieza no está.
 * ------------------------------------------------------------------ */
export default function Firetruck({ body, accent, extra, spin = 0 }: ModelProps) {
  const D = 0.225;
  const side = D / 2 + 0.016;
  const roll = spin * 0.04;

  const shell = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.340, 0.058);
    s.lineTo(0.296, 0.058);
    s.quadraticCurveTo(0.344, 0.060, 0.346, 0.100);
    s.lineTo(0.346, 0.268);
    s.quadraticCurveTo(0.342, 0.312, 0.300, 0.318);  // techo de cabina
    s.lineTo(0.108, 0.318);
    s.lineTo(0.108, 0.232);                           // escalón a la caja
    s.lineTo(-0.330, 0.232);
    s.quadraticCurveTo(-0.348, 0.230, -0.346, 0.198);
    s.lineTo(-0.340, 0.058);
    return s;
  }, []);

  return (
    <group>
      <Extruded shape={shell} depth={D} bevel={0.018} curveSegments={26}>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </Extruded>

      {/* parabrisas y ventanilla */}
      <RoundedBox args={[0.014, 0.096, 0.186]} radius={0.022} smoothness={6} position={[0.342, 0.250, 0]} castShadow>
        <meshPhysicalMaterial {...TINTED} color={extra} />
      </RoundedBox>
      {[side, -side].map((z) => (
        <RoundedBox key={z} args={[0.110, 0.086, 0.012]} radius={0.020} smoothness={5} position={[0.252, 0.252, z]} castShadow>
          <meshPhysicalMaterial {...TINTED} color={extra} />
        </RoundedBox>
      ))}

      {/* persianas de los cofres laterales */}
      {[side + 0.001, -side - 0.001].map((z) => (
        <group key={z}>
          {[-0.230, -0.090].map((x) => (
            <RoundedBox key={x} args={[0.120, 0.110, 0.008]} radius={0.014} smoothness={4} position={[x, 0.146, z]} castShadow>
              <meshPhysicalMaterial {...PLASTIC} color="#e9e4da" roughness={0.42} />
            </RoundedBox>
          ))}
        </group>
      ))}

      {/* franja reflectante */}
      {[side + 0.002, -side - 0.002].map((z) => (
        <RoundedBox key={z} args={[0.660, 0.026, 0.006]} radius={0.003} smoothness={3} position={[0, 0.084, z]} castShadow>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedBox>
      ))}

      {/* plataforma giratoria y escala */}
      <RoundedCylinder radius={0.070} height={0.022} bevel={0.008} position={[-0.140, 0.244, 0]}>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2e2b35" />
      </RoundedCylinder>
      <group position={[-0.140, 0.262, 0]} rotation={[0, spin * 0.006, -0.10]}>
        {[0.052, -0.052].map((z) => (
          <RoundedBox key={z} args={[0.520, 0.018, 0.018]} radius={0.008} smoothness={4} position={[0.150, 0.020, z]} castShadow>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </RoundedBox>
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <RoundedCylinder key={i} radius={0.007} height={0.104} bevel={0.003} position={[-0.080 + i * 0.058, 0.020, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshPhysicalMaterial {...CHROME} roughness={0.3} />
          </RoundedCylinder>
        ))}
        {/* segundo tramo, encajado sobre el primero */}
        {[0.036, -0.036].map((z) => (
          <RoundedBox key={z} args={[0.360, 0.014, 0.014]} radius={0.006} smoothness={4} position={[0.250, 0.040, z]} castShadow>
            <meshPhysicalMaterial {...PLASTIC} color="#e9e4da" />
          </RoundedBox>
        ))}
      </group>

      {/* puente de luces */}
      <RoundedBox args={[0.052, 0.026, 0.180]} radius={0.011} smoothness={4} position={[0.256, 0.332, 0]} castShadow>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2e2b35" />
      </RoundedBox>
      {[0.060, -0.060].map((z) => (
        <RoundedBox key={z} args={[0.040, 0.022, 0.048]} radius={0.010} smoothness={4} position={[0.256, 0.340, z]} castShadow>
          <meshPhysicalMaterial {...TINTED} color="#ff4a33" opacity={0.9} emissive="#ff2d12" emissiveIntensity={0.5} />
        </RoundedBox>
      ))}

      {/* carrete de manguera */}
      <group position={[-0.260, 0.180, 0]} rotation={[0, 0, Math.PI / 2]}>
        <RoundedCylinder radius={0.062} height={0.130} bevel={0.010}>
          <meshPhysicalMaterial {...PLASTIC} color="#c9c2b6" roughness={0.5} />
        </RoundedCylinder>
        <RoundedCylinder radius={0.070} height={0.024} bevel={0.008} position={[0, 0.064, 0]}>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedCylinder>
        <RoundedCylinder radius={0.070} height={0.024} bevel={0.008} position={[0, -0.064, 0]}>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedCylinder>
      </group>

      {/* parachoques y faros */}
      <RoundedBox args={[0.026, 0.042, 0.240]} radius={0.012} smoothness={4} position={[0.352, 0.078, 0]} castShadow>
        <meshPhysicalMaterial {...CHROME} roughness={0.28} />
      </RoundedBox>
      {[0.078, -0.078].map((z) => (
        <RoundedBox key={z} args={[0.014, 0.032, 0.046]} radius={0.013} smoothness={5} position={[0.350, 0.136, z]} castShadow>
          <meshPhysicalMaterial {...TINTED} color="#fff3da" opacity={0.9} emissive="#ffeec2" emissiveIntensity={0.3} />
        </RoundedBox>
      ))}

      {/* ruedas */}
      {([[0.230, 0.150], [0.230, -0.150], [-0.198, 0.150], [-0.198, -0.150]] as const).map(([x, z]) => (
        <Wheel key={`${x}:${z}`} radius={0.076} width={0.046} hub={accent} position={[x, 0.076, z]} roll={roll} />
      ))}
    </group>
  );
}
