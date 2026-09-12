'use client';

import * as THREE from 'three';
import { Environment, Lightformer, ContactShadows, PerspectiveCamera } from '@react-three/drei';

/* ------------------------------------------------------------------ *
 * El plató. Todo el catálogo se fotografía aquí: mismo objetivo, misma
 * luz y misma sombra de contacto, así que veintisiete productos
 * distintos siguen pareciendo el mismo catálogo.
 *
 * La iluminación no carga ningún HDRI de fuera: se construye con
 * Lightformers dentro de <Environment>, que three renderiza a un
 * cubemap. Son esos rectángulos los que se ven reflejados en el
 * plástico y los que hacen que se lea como brillante en vez de como
 * un color plano.
 * ------------------------------------------------------------------ */

/**
 * El ciclorama. Un objeto de vidrio sobre un fondo liso no se ve: la
 * gracia del vidrio es que DEFORMA lo que tiene detrás, y si detrás no
 * hay nada, no hay nada que deformar y la pieza se lee como plástico
 * brillante. Por eso el vidrio se fotografía siempre sobre un fondo
 * con suelo y horizonte, aunque el conjunto siga siendo blanco.
 */
export function Cove() {
  return (
    <group>
      {/* Suelo y fondo dejan una línea de horizonte justo detrás de la
          pieza: es esa línea, deformada al atravesar el vidrio, la que
          delata que el objeto es transparente y no pintado. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0.52]} receiveShadow>
        <planeGeometry args={[3.4, 2.5]} />
        <meshStandardMaterial color="#e4e0da" roughness={0.94} metalness={0} />
      </mesh>
      <mesh position={[0, 0.85, -0.73]} receiveShadow>
        <planeGeometry args={[3.4, 2.2]} />
        <meshStandardMaterial color="#fdfcfa" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

export function StudioRig({ shadows = true }: { shadows?: boolean }) {
  return (
    <>
      {/* Cubo de luz: una caja suave arriba (luz clave), dos paneles
          laterales de relleno y una tira estrecha detrás para el filo. */}
      <Environment resolution={256}>
        {/* Fondo del cubo: gris medio. Un entorno blanco entero deja el
            plástico lavado, sin ningún sitio oscuro que reflejar. */}
        <mesh scale={30}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshBasicMaterial color="#2e2c33" side={THREE.BackSide} />
        </mesh>
        {/* softbox cenital: la fuente principal, larga y estrecha, para
            que deje una banda de brillo y no un punto */}
        <Lightformer form="rect" intensity={2.6} position={[0, 6, 0.5]} scale={[7, 3.2, 1]} rotation={[Math.PI / 2, 0, 0]} />
        {/* relleno izquierda, frío */}
        <Lightformer form="rect" intensity={0.9} color="#dbe6ff" position={[-5, 1.2, 2]} scale={[3, 5, 1]} rotation={[0, Math.PI / 2, 0]} />
        {/* relleno derecha, cálido y más flojo: la luz nunca es simétrica */}
        <Lightformer form="rect" intensity={0.55} color="#ffeeda" position={[5, 0.6, 1]} scale={[3, 5, 1]} rotation={[0, -Math.PI / 2, 0]} />
        {/* tira de contraluz: dibuja el filo del contorno */}
        <Lightformer form="rect" intensity={1.6} position={[-1.2, 2.2, -5]} scale={[5, 1.4, 1]} />
        {/* rebote del suelo, muy suave */}
        <Lightformer form="rect" intensity={0.35} color="#fffaf2" position={[0, -3, 0]} scale={[8, 8, 1]} rotation={[-Math.PI / 2, 0, 0]} />
        {/* Cartones negros. Es LA técnica para fotografiar vidrio: sin
            algo oscuro que reflejar, una pieza transparente sobre fondo
            claro no tiene borde y desaparece. Estos dos paneles son los
            que le dibujan el contorno y el grosor. */}
        <Lightformer form="rect" intensity={0} color="#000000" position={[-3.2, 0.6, 2.2]} scale={[2.6, 4, 1]} rotation={[0, Math.PI / 2, 0]} />
        <Lightformer form="rect" intensity={0} color="#000000" position={[3.4, 0.4, 2.6]} scale={[2.2, 4, 1]} rotation={[0, -Math.PI / 2, 0]} />
      </Environment>

      {/* Una direccional con sombra propia: el entorno ilumina pero no
          proyecta, y sin sombra dura el objeto flota. */}
      <directionalLight
        castShadow={shadows}
        position={[2.6, 4.6, 2.4]}
        intensity={1.15}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-2, 2, 2, -2, 0.1, 14]} />
      </directionalLight>
      <ambientLight intensity={0.12} />

      {/* Sombra de contacto escalada al objeto, no a la escena. */}
      {shadows && (
        <ContactShadows
          position={[0, -0.001, 0]}
          opacity={0.78}
          scale={1.9}
          blur={1.7}
          far={0.55}
          resolution={1024}
          color="#151019"
        />
      )}
    </>
  );
}

/**
 * Objetivo largo y tres cuartos altos: es el encuadre de catálogo. De
 * frente o de perfil puro, un objeto se lee como un alzado técnico; en
 * tres cuartos se ven dos caras y una arista, y ahí aparece el volumen.
 */
export function ProductCamera({
  distance = 2.5, height = 0.62, yaw = 0.62,
}: { distance?: number; height?: number; yaw?: number }) {
  return (
    <PerspectiveCamera
      makeDefault
      fov={24}
      near={0.05}
      far={40}
      position={[Math.sin(yaw) * distance, height, Math.cos(yaw) * distance]}
    />
  );
}

export const GL_SETTINGS = {
  antialias: true,
  alpha: true,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 0.92,
  outputColorSpace: THREE.SRGBColorSpace,
} as const;
