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
 * El fondo del plató: blanco liso.
 *
 * Tiene que ser un fondo de escena OPACO, y eso no es un capricho de
 * estilo. `transmission` no inventa lo que hay detrás del vidrio:
 * MUESTREA la escena. Con el lienzo en `alpha: true` y sin fondo, lo
 * que se muestrea es transparente, la `transmissionAlpha` cae a cero y
 * la pieza se convierte en un agujero en el lienzo — ese era el motivo
 * por el que los juguetes de vidrio desaparecían del todo.
 *
 * El volumen no lo da el fondo, lo da el entorno: el cubo de luz tiene
 * base oscura y tiras claras, y son esos reflejos los que dibujan el
 * canto y el grosor del vidrio sobre blanco.
 */

export function StudioRig({ shadows = true, bg = '#ffffff' }: { shadows?: boolean; bg?: string }) {
  return (
    <>
      <color attach="background" args={[bg]} />
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
          opacity={0.58}
          scale={2.0}
          blur={2.0}
          far={0.6}
          resolution={1024}
          color="#2a2230"
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
