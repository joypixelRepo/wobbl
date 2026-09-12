'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { RUBBER, CHROME, PLASTIC } from './materials';

/* ------------------------------------------------------------------ *
 * Piezas comunes. Lo que separa un render de juguete de una maqueta de
 * cubos es el bisel: ninguna arista de un objeto moldeado es viva,
 * porque el molde no podría desmoldearla. Todo lo de aquí lleva su
 * radio, por pequeño que sea, para que la luz pinte esa línea fina de
 * brillo en cada canto.
 * ------------------------------------------------------------------ */

/** Perfil de revolución de un cilindro con los dos cantos redondeados. */
function roundedCylinderPoints(radius: number, height: number, bevel: number, seg = 5) {
  const b = Math.min(bevel, radius * 0.9, height * 0.45);
  const pts: THREE.Vector2[] = [];
  const h = height / 2;
  pts.push(new THREE.Vector2(0, -h));
  pts.push(new THREE.Vector2(radius - b, -h));
  for (let i = 1; i <= seg; i++) {
    const a = (i / seg) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - b + Math.sin(a) * b, -h + (1 - Math.cos(a)) * b));
  }
  pts.push(new THREE.Vector2(radius, h - b));
  for (let i = 1; i <= seg; i++) {
    const a = (i / seg) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - (1 - Math.cos(a)) * b, h - b + Math.sin(a) * b));
  }
  pts.push(new THREE.Vector2(0, h));
  return pts;
}

export function RoundedCylinder({
  radius = 0.1, height = 0.1, bevel = 0.012, radial = 48, children, ...props
}: { radius?: number; height?: number; bevel?: number; radial?: number; children?: React.ReactNode } & React.ComponentProps<'mesh'>) {
  const geo = useMemo(() => {
    const g = new THREE.LatheGeometry(roundedCylinderPoints(radius, height, bevel), radial);
    g.computeVertexNormals();
    return g;
  }, [radius, height, bevel, radial]);
  return <mesh geometry={geo} castShadow receiveShadow {...props}>{children}</mesh>;
}

/** Perfil de un neumático: hombros redondos y pared interior recta. */
function tyrePoints(outer: number, inner: number, width: number, seg = 6) {
  const b = Math.min(width * 0.42, (outer - inner) * 0.5);
  const w = width / 2;
  const pts: THREE.Vector2[] = [];
  pts.push(new THREE.Vector2(inner, -w));
  pts.push(new THREE.Vector2(outer - b, -w));
  for (let i = 1; i <= seg; i++) {
    const a = (i / seg) * (Math.PI / 2);
    pts.push(new THREE.Vector2(outer - b + Math.sin(a) * b, -w + (1 - Math.cos(a)) * b));
  }
  for (let i = 1; i <= seg; i++) {
    const a = (i / seg) * (Math.PI / 2);
    pts.push(new THREE.Vector2(outer - (1 - Math.cos(a)) * b, w - b + Math.sin(a) * b));
  }
  pts.push(new THREE.Vector2(inner, w));
  return pts;
}

/**
 * Rueda completa: goma, llanta de color y tapacubos cromado.
 *
 * La orientación va en un grupo interior propio y el giro se pide con
 * `roll`, nunca con `rotation`. La versión anterior mezclaba los dos en
 * el mismo grupo que recibía las props de fuera: como el spread iba
 * después, cualquier llamada con `rotation` borraba la orientación y
 * dejaba la rueda tumbada, de canto contra el suelo.
 *
 * El torno gira el perfil alrededor de Y, así que el eje nace vertical;
 * el giro de 90° sobre X lo tumba a lo ancho del vehículo, que es donde
 * va el eje de cualquier rueda. Rodar es girar sobre ese mismo eje, y
 * por eso `roll` entra como rotación en Y *antes* de tumbarlo.
 */
export function Wheel({
  radius = 0.11, width = 0.07, hub = '#ffffff', tread = true, roll = 0, ...props
}: { radius?: number; width?: number; hub?: string; tread?: boolean; roll?: number } & React.ComponentProps<'group'>) {
  const rim = radius * 0.58;
  const tyre = useMemo(() => {
    const g = new THREE.LatheGeometry(tyrePoints(radius, rim * 0.92, width), 56);
    g.computeVertexNormals();
    return g;
  }, [radius, rim, width]);

  return (
    <group {...props}>
      <group rotation={[Math.PI / 2, roll, 0]}>
      <mesh geometry={tyre} castShadow receiveShadow>
        <meshPhysicalMaterial {...RUBBER} />
      </mesh>
      {/* taco: anillos finos en el flanco, que es lo que delata una goma */}
      {tread && Array.from({ length: 16 }, (_, i) => (
        <mesh key={i} position={[0, 0, 0]} rotation={[0, (i / 16) * Math.PI * 2, 0]} castShadow>
          <boxGeometry args={[radius * 0.055, width * 1.01, radius * 0.16]} />
          <meshPhysicalMaterial {...RUBBER} roughness={0.95} />
        </mesh>
      ))}
      {/* llanta */}
      <RoundedCylinder radius={rim} height={width * 0.82} bevel={width * 0.14}>
        <meshPhysicalMaterial {...PLASTIC} color={hub} />
      </RoundedCylinder>
      {/* tuerca central cromada */}
      <RoundedCylinder radius={rim * 0.24} height={width * 0.95} bevel={rim * 0.06}>
        <meshPhysicalMaterial {...CHROME} />
      </RoundedCylinder>
      </group>
    </group>
  );
}

/** Tornillo avellanado: el detalle que dice "esto se abre con destornillador". */
export function Screw({ r = 0.011, ...props }: { r?: number } & React.ComponentProps<'group'>) {
  return (
    <group {...props}>
      <mesh>
        <cylinderGeometry args={[r, r * 0.8, r * 0.5, 16]} />
        <meshPhysicalMaterial color="#2a2730" roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0, r * 0.2, 0]}>
        <boxGeometry args={[r * 1.2, r * 0.12, r * 0.22]} />
        <meshPhysicalMaterial color="#15131a" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  );
}

/** Junta de molde: la línea fina donde cierran las dos mitades. */
export function Seam({
  radius = 0.2, thickness = 0.0016, ...props
}: { radius?: number; thickness?: number } & React.ComponentProps<'mesh'>) {
  return (
    <mesh {...props}>
      <torusGeometry args={[radius, thickness, 6, 80]} />
      <meshPhysicalMaterial color="#000000" transparent opacity={0.22} roughness={0.9} />
    </mesh>
  );
}

/**
 * Superficie de revolución a partir de un perfil `[radio, altura]`. Es
 * la forma honesta de hacer cualquier pieza torneada —morros, calderas,
 * toberas, chimeneas— en vez de apilar cilindros de distinto grosor y
 * dejar escalones que en un objeto real no existirían.
 */
export function Lathe({
  profile, segments = 56, children, ...props
}: { profile: [number, number][]; segments?: number; children?: React.ReactNode } & React.ComponentProps<'mesh'>) {
  const geo = useMemo(() => {
    const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.0001), y)), segments);
    g.computeVertexNormals();
    return g;
  }, [profile, segments]);
  return <mesh geometry={geo} castShadow receiveShadow {...props}>{children}</mesh>;
}

/**
 * Silueta de perfil extruida a lo ancho, con bisel en todo el canto.
 * Es la técnica que usa casi todo el catálogo con ruedas: una sola
 * pieza continua, como saldría de un molde.
 */
export function Extruded({
  shape, depth, bevel = 0.016, curveSegments = 24, children, ...props
}: { shape: THREE.Shape; depth: number; bevel?: number; curveSegments?: number; children?: React.ReactNode } & React.ComponentProps<'mesh'>) {
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel * 0.9,
      bevelSize: bevel,
      bevelSegments: 5,
      curveSegments,
    });
    g.translate(0, 0, -depth / 2);
    g.computeVertexNormals();
    return g;
  }, [shape, depth, bevel, curveSegments]);
  return <mesh geometry={geo} castShadow receiveShadow {...props}>{children}</mesh>;
}

/** Perfil de un morro/ojiva: radio que decae como un coseno. */
export function noseProfile(radius: number, from: number, to: number, steps = 10): [number, number][] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return [radius * Math.cos((t * Math.PI) / 2) ** 0.72, from + (to - from) * t] as [number, number];
  });
}
