'use client';

/* ------------------------------------------------------------------ *
 * Los materiales del catálogo. Todo lo que sale del horno de WOBBL se
 * hace con esta lista, y son cuatro vidrios y dos metales: si una
 * pieza inventa su propio acabado, dentro de la misma vitrina se nota.
 *
 * Lo que hace que el vidrio parezca vidrio y no plástico brillante es
 * `transmission`: la luz lo ATRAVIESA en vez de rebotar. Con `ior` 1.5
 * —el índice de refracción del vidrio de verdad— y un `thickness` que
 * marque el grosor, la pieza deforma lo que tiene detrás, que es el
 * gesto que ningún plástico opaco puede fingir.
 *
 * Los nombres se conservan (CAR_PAINT, PLASTIC, RUBBER…) para que los
 * veintiocho modelos no tengan que cambiar ni una línea: lo que cambia
 * es de qué está hecho cada cosa, no dónde va.
 * ------------------------------------------------------------------ */

/**
 * Vidrio de color: el cuerpo de casi todas las piezas.
 *
 * La transmisión se queda baja a propósito. En `MeshPhysicalMaterial`
 * el color del volumen lo pone `attenuationColor`, no `color`, así que
 * al subirla el `color` que pasa cada modelo deja de pintar: con 0.92
 * las piezas se volvían literalmente invisibles —reflejaban el blanco
 * del plató y transmitían el gris del suelo, o sea, el fondo exacto—.
 * A 0.30 se ve el color, se ve a través por las partes finas y la
 * silueta se sigue entendiendo, que es lo que tiene que pasar en una
 * miniatura de doce centímetros.
 */
export const CAR_PAINT = {
  metalness: 0,
  roughness: 0.06,
  transmission: 0.64,
  thickness: 0.45,
  ior: 1.5,
  clearcoat: 1,
  clearcoatRoughness: 0.03,
  envMapIntensity: 1.15,
  specularIntensity: 1,
} as const;

/**
 * Vidrio opaco (lattimo): el vidrio lechoso de toda la vida. Va en las
 * piezas pequeñas —franjas, aletas, remates— porque si TODO transmite
 * la luz, la silueta se deshace y no se entiende qué es el objeto.
 */
export const PLASTIC = {
  metalness: 0,
  roughness: 0.10,
  transmission: 0.22,
  thickness: 0.14,
  ior: 1.5,
  clearcoat: 1,
  clearcoatRoughness: 0.04,
  envMapIntensity: 1.1,
} as const;

/** Vidrio satinado, esmerilado al chorro de arena. Sin reflejo nítido. */
export const SOFT_PLASTIC = {
  metalness: 0,
  roughness: 0.58,
  transmission: 0.42,
  thickness: 0.26,
  ior: 1.5,
  clearcoat: 0.25,
  clearcoatRoughness: 0.55,
  envMapIntensity: 0.9,
} as const;

/** Vidrio negro para ruedas y orugas: opaco, pero con brillo de vidrio. */
export const RUBBER = {
  color: '#16141b',
  metalness: 0,
  roughness: 0.14,
  transmission: 0,
  clearcoat: 1,
  clearcoatRoughness: 0.06,
  envMapIntensity: 1.1,
} as const;

/** Pan de plata: la lámina metálica que se aplica antes de soplar. */
export const CHROME = {
  color: '#e9ebf1',
  metalness: 1,
  roughness: 0.14,
  envMapIntensity: 1.6,
} as const;

/** Vidrio con inclusión metálica: cuerpos densos y muy reflectantes. */
export const PAINTED_METAL = {
  metalness: 0.2,
  roughness: 0.08,
  transmission: 0.48,
  thickness: 0.34,
  ior: 1.5,
  clearcoat: 1,
  clearcoatRoughness: 0.03,
  envMapIntensity: 1.2,
} as const;

/** Vidrio ámbar, cálido y denso. Donde antes había haya. */
export const WOOD = {
  color: '#d9a45f',
  metalness: 0,
  roughness: 0.07,
  transmission: 0.68,
  thickness: 0.40,
  ior: 1.5,
  clearcoat: 1,
  clearcoatRoughness: 0.03,
  envMapIntensity: 1.15,
} as const;

/** Cristal transparente sin apenas color: cúpulas, lunas y matraces. */
export const TINTED = {
  metalness: 0,
  roughness: 0.03,
  transmission: 0.95,
  thickness: 0.14,
  ior: 1.52,
  clearcoat: 1,
  clearcoatRoughness: 0.02,
  envMapIntensity: 1.4,
} as const;

/**
 * Vidrio satinado profundo, para el oso. Era el peluche del catálogo y
 * ahora es la única pieza esmerilada de arriba abajo: no refleja nada
 * y se queda en un blanco lechoso con tacto de terciopelo.
 */
export const PLUSH = {
  metalness: 0,
  roughness: 0.72,
  transmission: 0.46,
  thickness: 0.30,
  ior: 1.5,
  clearcoat: 0.15,
  clearcoatRoughness: 0.75,
  envMapIntensity: 0.85,
} as const;
