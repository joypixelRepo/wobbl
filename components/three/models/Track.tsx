'use client';

import { RoundedBox } from '@react-three/drei';
import { RoundedCylinder, Wheel } from '../parts';
import { PLASTIC, CAR_PAINT, SOFT_PLASTIC, TINTED, CHROME } from '../materials';
import type { ModelProps } from './types';

/* ------------------------------------------------------------------ *
 * PISTA DE COCHES — 3,4 m de pista y rizo de 32 cm.
 *
 * El coche recorre el rizo de verdad: su posición sale del mismo
 * ángulo que dibuja la curva, así que siempre pisa la pista en vez de
 * flotar cerca de ella.
 * ------------------------------------------------------------------ */
export default function Track({ body, accent, extra, spin = 0 }: ModelProps) {
  const R = 0.180;          // radio del rizo
  const loopY = R + 0.055;
  const t = spin * 0.03;
  const carA = t % (Math.PI * 2);
  const carX = -0.060 + Math.cos(carA - Math.PI / 2) * (R - 0.022);
  const carY = loopY + Math.sin(carA - Math.PI / 2) * (R - 0.022);

  return (
    <group>
      {/* recta */}
      <RoundedBox args={[0.700, 0.030, 0.190]} radius={0.012} smoothness={4} position={[0.040, 0.040, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color={body} />
      </RoundedBox>
      {/* quitamiedos */}
      {[0.104, -0.104].map((z) => (
        <RoundedBox key={z} args={[0.700, 0.040, 0.018]} radius={0.008} smoothness={4} position={[0.040, 0.056, z]} castShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
        </RoundedBox>
      ))}
      {/* línea discontinua del centro */}
      {Array.from({ length: 9 }, (_, i) => (
        <RoundedBox key={i} args={[0.048, 0.006, 0.014]} radius={0.003} smoothness={3} position={[-0.280 + i * 0.078, 0.056, 0]}>
          <meshPhysicalMaterial {...PLASTIC} color="#f5f1e8" />
        </RoundedBox>
      ))}

      {/* rizo: dos carriles y el piso entre ellos */}
      {[0.082, -0.082].map((z) => (
        <mesh key={z} position={[-0.060, loopY, z]} castShadow receiveShadow>
          <torusGeometry args={[R, 0.016, 16, 80]} />
          <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
        </mesh>
      ))}
      <mesh position={[-0.060, loopY, 0]} castShadow receiveShadow>
        <torusGeometry args={[R, 0.012, 4, 80]} />
        <meshPhysicalMaterial {...SOFT_PLASTIC} color={body} />
      </mesh>
      {/* soportes del rizo */}
      {[0.082, -0.082].map((z) => (
        <RoundedBox key={z} args={[0.022, loopY, 0.022]} radius={0.008} smoothness={4} position={[-0.060 - R * 0.72, loopY / 2 + 0.030, z]} rotation={[0, 0, 0.3]} castShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
        </RoundedBox>
      ))}

      {/* rampa de entrada */}
      <RoundedBox args={[0.180, 0.024, 0.190]} radius={0.010} smoothness={4} position={[0.086, 0.088, 0]} rotation={[0, 0, -0.42]} castShadow>
        <meshPhysicalMaterial {...SOFT_PLASTIC} color={body} />
      </RoundedBox>

      {/* el coche que hace el rizo */}
      <group position={[carX, carY, 0]} rotation={[0, 0, carA]}>
        <RoundedBox args={[0.115, 0.034, 0.072]} radius={0.014} smoothness={6} castShadow receiveShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
        </RoundedBox>
        <RoundedBox args={[0.062, 0.028, 0.058]} radius={0.014} smoothness={6} position={[-0.008, 0.026, 0]} castShadow>
          <meshPhysicalMaterial {...TINTED} color="#2f3a52" opacity={0.75} />
        </RoundedBox>
        {([[0.036, 0.042], [0.036, -0.042], [-0.036, 0.042], [-0.036, -0.042]] as const).map(([x, z]) => (
          <Wheel key={`${x}:${z}`} radius={0.024} width={0.016} hub={accent} position={[x, -0.018, z]} roll={t * 6} tread={false} />
        ))}
      </group>

      {/* pórtico de salida con semáforo */}
      <group position={[0.330, 0, 0]}>
        {[0.104, -0.104].map((z) => (
          <RoundedBox key={z} args={[0.022, 0.230, 0.022]} radius={0.008} smoothness={4} position={[0, 0.145, z]} castShadow>
            <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
          </RoundedBox>
        ))}
        <RoundedBox args={[0.030, 0.062, 0.250]} radius={0.012} smoothness={5} position={[0, 0.290, 0]} castShadow>
          <meshPhysicalMaterial {...CAR_PAINT} color={extra} />
        </RoundedBox>
        {[0.060, 0, -0.060].map((z, i) => (
          <RoundedCylinder key={z} radius={0.020} height={0.014} bevel={0.005} position={[-0.018, 0.290, z]} rotation={[0, 0, Math.PI / 2]}>
            <meshPhysicalMaterial
              {...TINTED}
              color={['#ff4433', '#ffce00', '#58e3b4'][i]}
              opacity={0.95}
              emissive={['#ff4433', '#ffce00', '#58e3b4'][i]}
              emissiveIntensity={Math.abs(Math.sin(t * 0.6 - i * 1.1)) * 0.8}
            />
          </RoundedCylinder>
        ))}
        {/* damero de meta */}
        {Array.from({ length: 8 }, (_, i) => (
          <RoundedBox key={i} args={[0.006, 0.026, 0.030]} radius={0.002} smoothness={2} position={[0.010, 0.244 + (i % 2) * 0.026, -0.090 + Math.floor(i / 2) * 0.060]}>
            <meshPhysicalMaterial color={i % 2 ? '#15131a' : '#f5f1e8'} roughness={0.5} />
          </RoundedBox>
        ))}
      </group>

      {/* caja de mecánico */}
      <RoundedBox args={[0.090, 0.060, 0.090]} radius={0.012} smoothness={5} position={[-0.330, 0.030, 0.150]} castShadow receiveShadow>
        <meshPhysicalMaterial {...CAR_PAINT} color={accent} />
      </RoundedBox>
      <RoundedCylinder radius={0.030} height={0.014} bevel={0.005} position={[-0.330, 0.066, 0.150]}>
        <meshPhysicalMaterial {...CHROME} roughness={0.3} />
      </RoundedCylinder>
    </group>
  );
}
