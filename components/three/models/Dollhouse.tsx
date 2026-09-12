'use client';

import { RoundedBox } from '@react-three/drei';
import { RoundedCylinder } from '../parts';
import { PLASTIC, TINTED, WOOD, CAR_PAINT, SOFT_PLASTIC } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * CASA DE MUÑECAS — dos plantas y frente abierto.
 *
 * Se modela solo la mitad de atrás: la gracia de una casa de muñecas
 * es que le falta la fachada, y el hueco es lo que invita a meter la
 * mano. Una caja cerrada con ventanas pintadas no es una casa de
 * muñecas, es una caja.
 * ------------------------------------------------------------------ */
export default function Dollhouse({ body, accent, extra }: ModelProps) {
  const W = 0.520;   // ancho
  const D = 0.230;   // fondo
  const wall = 0.022;

  return (
    <group>
      {/* suelo de planta baja */}
      <RoundedBox args={[W, 0.026, D]} radius={0.008} smoothness={4} position={[0, 0.013, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...WOOD} />
      </RoundedBox>
      {/* forjado intermedio */}
      <RoundedBox args={[W, 0.020, D]} radius={0.007} smoothness={4} position={[0, 0.200, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...WOOD} />
      </RoundedBox>

      {/* trasera y laterales */}
      <RoundedBox args={[W, 0.390, wall]} radius={0.008} smoothness={4} position={[0, 0.195, -D / 2 + wall / 2]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </RoundedBox>
      {[W / 2 - wall / 2, -W / 2 + wall / 2].map((x) => (
        <RoundedBox key={x} args={[wall, 0.390, D]} radius={0.008} smoothness={4} position={[x, 0.195, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={body} />
        </RoundedBox>
      ))}
      {/* tabique de la planta baja */}
      <RoundedBox args={[wall, 0.175, D * 0.9]} radius={0.006} smoothness={4} position={[0.060, 0.100, 0.008]} castShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
      </RoundedBox>

      {/* tejado a dos aguas */}
      {[1, -1].map((s) => (
        <RoundedBox
          key={s}
          args={[W * 0.56, 0.024, D + 0.050]}
          radius={0.009}
          smoothness={4}
          position={[s * W * 0.135, 0.468, 0]}
          rotation={[0, 0, s * -0.62]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
        </RoundedBox>
      ))}
      {/* hastial */}
      <mesh position={[0, 0.470, -D / 2 + wall / 2]} rotation={[0, 0, Math.PI]} castShadow>
        <coneGeometry args={[W * 0.372, 0.152, 3]} />
        <meshPhysicalMaterial {...CAR_PAINT} color={body} />
      </mesh>
      {/* chimenea */}
      <RoundedBox args={[0.052, 0.110, 0.052]} radius={0.010} smoothness={4} position={[-0.168, 0.500, -0.020]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={extra} />
      </RoundedBox>

      {/* ventanas en la trasera */}
      {([[-0.150, 0.300], [0.150, 0.300], [-0.150, 0.098]] as const).map(([x, y]) => (
        <group key={`${x}:${y}`}>
          <RoundedBox args={[0.110, 0.100, 0.012]} radius={0.014} smoothness={5} position={[x, y, -D / 2 + wall + 0.004]} castShadow>
            <meshPhysicalMaterial {...TINTED} color="#cfe8ff" opacity={0.6} />
          </RoundedBox>
          <RoundedBox args={[0.124, 0.114, 0.008]} radius={0.012} smoothness={4} position={[x, y, -D / 2 + wall + 0.002]}>
            <meshPhysicalMaterial {...PLASTIC} color={accent} />
          </RoundedBox>
        </group>
      ))}

      {/* puerta */}
      <RoundedBox args={[0.104, 0.160, 0.014]} radius={0.012} smoothness={5} position={[0.150, 0.098, -D / 2 + wall + 0.004]} castShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
      </RoundedBox>
      <mesh position={[0.192, 0.098, -D / 2 + wall + 0.014]} castShadow>
        <sphereGeometry args={[0.010, 16, 12]} />
        <meshPhysicalMaterial color="#e8c56a" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* muebles: cama arriba, mesa y alfombra abajo */}
      <RoundedBox args={[0.150, 0.038, 0.098]} radius={0.012} smoothness={4} position={[-0.140, 0.238, 0.010]} castShadow receiveShadow>
        <meshPhysicalMaterial {...PLASTIC} color={extra} />
      </RoundedBox>
      <RoundedBox args={[0.032, 0.062, 0.098]} radius={0.010} smoothness={4} position={[-0.208, 0.250, 0.010]} castShadow>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedBox>
      <RoundedBox args={[0.120, 0.014, 0.084]} radius={0.006} smoothness={4} position={[0.150, 0.300, 0.020]} castShadow>
        <meshPhysicalMaterial {...WOOD} />
      </RoundedBox>
      {([[0.106, -0.014], [0.194, -0.014], [0.106, 0.054], [0.194, 0.054]] as const).map(([x, z]) => (
        <RoundedCylinder key={`${x}:${z}`} radius={0.007} height={0.070} bevel={0.003} position={[x, 0.258, z + 0.020]}>
          <meshPhysicalMaterial {...WOOD} />
        </RoundedCylinder>
      ))}
      <RoundedCylinder radius={0.072} height={0.008} bevel={0.003} position={[-0.140, 0.030, 0.030]}>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color={accent} />
      </RoundedCylinder>
      {/* planta */}
      <RoundedCylinder radius={0.024} height={0.044} bevel={0.008} position={[0.186, 0.048, 0.060]}>
        <meshPhysicalMaterial {...PLASTIC} color={accent} />
      </RoundedCylinder>
      <mesh position={[0.186, 0.092, 0.060]} castShadow>
        <sphereGeometry args={[0.036, 24, 18]} />
        <meshPhysicalMaterial {...PLASTIC} color="#5fc46b" roughness={0.5} />
      </mesh>
    </group>
  );
}
