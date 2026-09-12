'use client';

import { RoundedBox } from '@react-three/drei';
import { RoundedCylinder, Lathe } from '../parts';
import { PLASTIC, TINTED, CAR_PAINT, CHROME, SOFT_PLASTIC, WOOD } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * COCINITA DE JUGUETE — horno que se abre y mandos con clic.
 *
 * El fregadero es un hueco de verdad hundido en la encimera, no un
 * disco pintado: el borde con sombra propia es lo que hace que parezca
 * que se puede meter algo dentro.
 * ------------------------------------------------------------------ */
export default function Kitchen({ body, accent, extra, spin = 0 }: ModelProps) {
  const oven = Math.max(0, Math.sin(spin * 0.02)) * 1.25;

  return (
    <group>
      {/* cuerpo del mueble */}
      <RoundedBox args={[0.520, 0.320, 0.230]} radius={0.026} smoothness={6} position={[0, 0.160, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </RoundedBox>
      {/* patas */}
      {([[0.225, 0.088], [-0.225, 0.088], [0.225, -0.088], [-0.225, -0.088]] as const).map(([x, z]) => (
        <RoundedCylinder key={`${x}:${z}`} radius={0.016} height={0.030} bevel={0.006} position={[x, 0.015, z]}>
          <meshPhysicalMaterial {...CHROME} roughness={0.35} />
        </RoundedCylinder>
      ))}

      {/* encimera */}
      <RoundedBox args={[0.552, 0.030, 0.256]} radius={0.012} smoothness={5} position={[0, 0.335, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...WOOD} />
      </RoundedBox>

      {/* fuegos */}
      {([[-0.160, 0.046], [-0.160, -0.052], [-0.048, 0.046]] as const).map(([x, z]) => (
        <group key={`${x}:${z}`}>
          <RoundedCylinder radius={0.044} height={0.010} bevel={0.004} position={[x, 0.352, z]}>
            <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2b2833" />
          </RoundedCylinder>
          <RoundedCylinder radius={0.028} height={0.014} bevel={0.005} position={[x, 0.356, z]}>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </RoundedCylinder>
        </group>
      ))}
      {/* sartén sobre un fuego */}
      <Lathe
        profile={[[0, 0], [0.062, 0], [0.066, 0.006], [0.070, 0.034], [0.066, 0.036], [0.060, 0.010], [0, 0.010]]}
        position={[-0.048, -0.052 * 0 + 0.360, -0.052]}
      >
        <meshPhysicalMaterial {...CHROME} color="#403b46" roughness={0.38} />
      </Lathe>
      <RoundedCylinder radius={0.011} height={0.096} bevel={0.004} position={[0.050, 0.372, -0.052]} rotation={[0, 0, Math.PI / 2]}>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2b2833" />
      </RoundedCylinder>

      {/* fregadero hundido y grifo */}
      <RoundedBox args={[0.150, 0.052, 0.140]} radius={0.020} smoothness={6} position={[0.150, 0.334, 0]} castShadow>
        <meshPhysicalMaterial {...CHROME} color="#cfd3da" roughness={0.24} />
      </RoundedBox>
      <RoundedBox args={[0.120, 0.040, 0.110]} radius={0.016} smoothness={6} position={[0.150, 0.340, 0]}>
        <meshPhysicalMaterial {...CHROME} color="#8e929b" roughness={0.32} />
      </RoundedBox>
      <RoundedCylinder radius={0.010} height={0.110} bevel={0.004} position={[0.214, 0.402, -0.070]}>
        <meshPhysicalMaterial {...CHROME} roughness={0.22} />
      </RoundedCylinder>
      <mesh position={[0.196, 0.452, -0.048]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.030, 0.010, 12, 24, Math.PI]} />
        <meshPhysicalMaterial {...CHROME} roughness={0.22} />
      </mesh>

      {/* puerta del horno, con ventana */}
      <group position={[-0.100, 0.190, 0.116]} rotation={[oven, 0, 0]}>
        <RoundedBox args={[0.250, 0.200, 0.020]} radius={0.018} smoothness={6} position={[0, -0.090, 0.010]} castShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
        </RoundedBox>
        <RoundedBox args={[0.180, 0.120, 0.014]} radius={0.020} smoothness={6} position={[0, -0.090, 0.024]} castShadow>
          <meshPhysicalMaterial {...TINTED} color={extra} />
        </RoundedBox>
        <RoundedCylinder radius={0.011} height={0.230} bevel={0.004} position={[0, 0.004, 0.030]} rotation={[0, 0, Math.PI / 2]}>
          <meshPhysicalMaterial {...CHROME} roughness={0.24} />
        </RoundedCylinder>
      </group>

      {/* mandos: giran con la pieza */}
      {[0.086, 0.150, 0.214].map((x, i) => (
        <group key={x} position={[x, 0.268, 0.122]}>
          <RoundedCylinder radius={0.024} height={0.022} bevel={0.008} rotation={[Math.PI / 2, 0, 0]}>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </RoundedCylinder>
          <RoundedBox args={[0.007, 0.020, 0.026]} radius={0.003} smoothness={3} position={[0, 0.011, 0.006]} rotation={[0, 0, spin * 0.03 * (i + 1)]}>
            <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2b2833" />
          </RoundedBox>
        </group>
      ))}

      {/* campana extractora */}
      <RoundedBox args={[0.300, 0.020, 0.180]} radius={0.008} smoothness={4} position={[-0.110, 0.660, -0.030]} castShadow>
        <meshPhysicalMaterial {...CHROME} color="#c9ccd4" roughness={0.28} />
      </RoundedBox>
      <mesh position={[-0.110, 0.600, -0.030]} castShadow receiveShadow>
        <cylinderGeometry args={[0.058, 0.150, 0.120, 4, 1, false, Math.PI / 4]} />
        <meshPhysicalMaterial {...CHROME} color="#c9ccd4" roughness={0.28} />
      </mesh>
      <RoundedCylinder radius={0.040} height={0.090} bevel={0.010} position={[-0.110, 0.700, -0.030]}>
        <meshPhysicalMaterial {...CHROME} color="#a9adb6" roughness={0.3} />
      </RoundedCylinder>

      {/* trasera con alicatado */}
      <RoundedBox args={[0.552, 0.300, 0.018]} radius={0.010} smoothness={4} position={[0, 0.500, -0.120]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
      </RoundedBox>
      {Array.from({ length: 5 }, (_, c) =>
        Array.from({ length: 2 }, (_, r) => (
          <RoundedBox key={`${c}-${r}`} args={[0.084, 0.084, 0.008]} radius={0.010} smoothness={4} position={[-0.216 + c * 0.108, 0.436 + r * 0.104, -0.108]}>
            <meshPhysicalMaterial {...PLASTIC} color="#f6f2ea" roughness={0.35} />
          </RoundedBox>
        )),
      )}
    </group>
  );
}
