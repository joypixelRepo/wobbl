'use client';

import { RoundedBox } from '@react-three/drei';
import { RoundedCylinder, Screw } from '../parts';
import { PLASTIC, TINTED, CHROME, CAR_PAINT, SOFT_PLASTIC } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * ROBOT MODULAR — 24 piezas que se montan y desmontan.
 *
 * Todo son cajas redondeadas, pero con radios distintos por pieza: el
 * torso muy suave, las manos casi esféricas, las juntas apretadas. Un
 * robot con el mismo radio en todo se lee como un montón de pastillas.
 * ------------------------------------------------------------------ */
export default function Bot({ body, accent, extra, spin = 0 }: ModelProps) {
  const sway = Math.sin(spin * 0.02) * 0.10;

  return (
    <group position={[0, 0.016, 0]}>
      {/* pies */}
      {[0.078, -0.078].map((z) => (
        <RoundedBox key={z} args={[0.140, 0.052, 0.108]} radius={0.022} smoothness={5} position={[0.014, 0.026, z]} castShadow receiveShadow>
          <meshPhysicalMaterial {...PLASTIC} color={accent} />
        </RoundedBox>
      ))}
      {/* piernas */}
      {[0.070, -0.070].map((z) => (
        <RoundedCylinder key={z} radius={0.040} height={0.130} bevel={0.016} position={[0, 0.112, z]}>
          <meshPhysicalMaterial {...PLASTIC} color={extra} />
        </RoundedCylinder>
      ))}
      {/* caderas */}
      <RoundedBox args={[0.170, 0.048, 0.190]} radius={0.020} smoothness={5} position={[0, 0.188, 0]} castShadow>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color="#33303b" />
      </RoundedBox>

      {/* torso */}
      <RoundedBox args={[0.250, 0.240, 0.190]} radius={0.062} smoothness={8} position={[0, 0.330, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </RoundedBox>
      {/* pecho: aro y botón que se ilumina */}
      <group position={[0, 0.340, 0.100]} rotation={[Math.PI / 2, 0, 0]}>
        <RoundedCylinder radius={0.062} height={0.020} bevel={0.008}>
          <meshPhysicalMaterial {...PLASTIC} color={extra} />
        </RoundedCylinder>
        <RoundedCylinder radius={0.042} height={0.030} bevel={0.010}>
          <meshPhysicalMaterial {...TINTED} color={accent} opacity={0.95} emissive={accent} emissiveIntensity={0.45} />
        </RoundedCylinder>
      </group>
      {/* rejilla lateral */}
      {[0.128, -0.128].map((z) => (
        <RoundedBox key={z} args={[0.120, 0.030, 0.012]} radius={0.006} smoothness={4} position={[0, 0.250, z]} castShadow>
          <meshPhysicalMaterial {...SOFT_PLASTIC} color="#2b2833" />
        </RoundedBox>
      ))}
      {/* tornillos del torso: la pista de que se desmonta */}
      {([[0.100, 0.240], [-0.100, 0.240], [0.100, 0.420], [-0.100, 0.420]] as const).map(([x, y]) => (
        <Screw key={`${x}:${y}`} r={0.013} position={[x, y, 0.098]} rotation={[Math.PI / 2, 0, 0]} />
      ))}

      {/* hombros y brazos */}
      {[1, -1].map((s) => (
        <group key={s} position={[0, 0.400, s * 0.140]} rotation={[s * sway, 0, 0]}>
          <RoundedCylinder radius={0.042} height={0.048} bevel={0.014} rotation={[Math.PI / 2, 0, 0]}>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </RoundedCylinder>
          <RoundedCylinder radius={0.034} height={0.170} bevel={0.014} position={[0, -0.100, s * 0.012]}>
            <meshPhysicalMaterial {...PLASTIC} color={extra} />
          </RoundedCylinder>
          <mesh position={[0, -0.198, s * 0.012]} castShadow>
            <sphereGeometry args={[0.046, 28, 20]} />
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </mesh>
        </group>
      ))}

      {/* cuello */}
      <RoundedCylinder radius={0.038} height={0.040} bevel={0.012} position={[0, 0.468, 0]}>
        <meshPhysicalMaterial {...CHROME} color="#4a4652" roughness={0.35} />
      </RoundedCylinder>

      {/* cabeza */}
      <RoundedBox args={[0.230, 0.170, 0.190]} radius={0.058} smoothness={8} position={[0, 0.570, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
      </RoundedBox>
      {/* visor */}
      <RoundedBox args={[0.170, 0.092, 0.196]} radius={0.040} smoothness={7} position={[0.020, 0.572, 0]} castShadow>
        <meshPhysicalMaterial color="#16141c" roughness={0.12} metalness={0.25} clearcoat={1} clearcoatRoughness={0.05} />
      </RoundedBox>
      {/* ojos dentro del visor */}
      {[0.042, -0.042].map((z) => (
        <mesh key={z} position={[0.106, 0.574, z]} castShadow>
          <sphereGeometry args={[0.024, 24, 18]} />
          <meshPhysicalMaterial {...TINTED} color={extra} opacity={0.98} emissive={extra} emissiveIntensity={0.75} />
        </mesh>
      ))}
      {/* orejeras */}
      {[0.106, -0.106].map((z) => (
        <RoundedCylinder key={z} radius={0.030} height={0.026} bevel={0.010} position={[-0.010, 0.570, z]} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial {...PLASTIC} color={extra} />
        </RoundedCylinder>
      ))}
      {/* antena */}
      <RoundedCylinder radius={0.008} height={0.070} bevel={0.003} position={[-0.040, 0.680, 0]}>
        <meshPhysicalMaterial {...CHROME} roughness={0.3} />
      </RoundedCylinder>
      <mesh position={[-0.040, 0.722, 0]} castShadow>
        <sphereGeometry args={[0.026, 24, 18]} />
        <meshPhysicalMaterial {...TINTED} color={body} opacity={0.95} emissive={body} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}
