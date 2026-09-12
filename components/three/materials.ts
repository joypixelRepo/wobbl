'use client';

/* ------------------------------------------------------------------ *
 * Los materiales del catálogo. Todo lo que se fabrica en WOBBL sale de
 * esta lista: si un juguete inventa su propio acabado, dentro de la
 * misma estantería se nota.
 *
 * La clave del plástico de juguete es el clearcoat: una capa de barniz
 * sobre el color que recoge los reflejos del plató. Sin ella el color
 * se lee como pintura mate y el objeto parece de papel.
 * ------------------------------------------------------------------ */

export const PLASTIC = {
  metalness: 0,
  roughness: 0.24,
  clearcoat: 0.9,
  clearcoatRoughness: 0.14,
  envMapIntensity: 1.15,
} as const;

/** Plástico de tacto suave: mandos, agarraderas, piezas grandes. */
export const SOFT_PLASTIC = {
  metalness: 0,
  roughness: 0.62,
  clearcoat: 0.25,
  clearcoatRoughness: 0.45,
  envMapIntensity: 0.9,
} as const;

/** Goma de neumático y orugas. Nunca negro puro: se traga la forma. */
export const RUBBER = {
  color: '#1b191f',
  metalness: 0,
  roughness: 0.88,
  clearcoat: 0.1,
  clearcoatRoughness: 0.7,
  envMapIntensity: 0.55,
} as const;

/** Cromado de ejes, tornillos y embellecedores. */
export const CHROME = {
  color: '#e8eaf0',
  metalness: 1,
  roughness: 0.16,
  envMapIntensity: 1.5,
} as const;

/** Metal pintado, para chasis de zamak y piezas de fundición. */
export const PAINTED_METAL = {
  metalness: 0.35,
  roughness: 0.3,
  clearcoat: 0.7,
  clearcoatRoughness: 0.2,
  envMapIntensity: 1.2,
} as const;

/** Haya barnizada de los bloques y los muebles. */
export const WOOD = {
  color: '#e3b887',
  metalness: 0,
  roughness: 0.55,
  clearcoat: 0.35,
  clearcoatRoughness: 0.4,
  envMapIntensity: 0.8,
} as const;

/**
 * Metacrilato tintado de parabrisas y cúpulas. Es opacidad, no
 * `transmission`: la refracción real obliga a three a repintar la
 * escena por cada objeto y en una estantería entera no sale a cuenta.
 */
export const TINTED = {
  metalness: 0,
  roughness: 0.06,
  clearcoat: 1,
  clearcoatRoughness: 0.04,
  transparent: true,
  opacity: 0.46,
  envMapIntensity: 2.2,
} as const;

/** Peluche: sin brillo y con sheen, que es lo que hace la pelusa. */
export const PLUSH = {
  metalness: 0,
  roughness: 0.98,
  sheen: 1,
  sheenRoughness: 0.7,
  sheenColor: '#ffffff',
  clearcoat: 0,
  envMapIntensity: 0.7,
} as const;

/**
 * Pintura de automoción de los coches de fundición: capa de color muy
 * lisa bajo un barniz duro. Metalness a cero — subirla apaga el color
 * y lo deja gris, que es el error clásico al pintar un coche en PBR.
 */
export const CAR_PAINT = {
  metalness: 0,
  roughness: 0.17,
  clearcoat: 1,
  clearcoatRoughness: 0.045,
  envMapIntensity: 1.35,
} as const;
