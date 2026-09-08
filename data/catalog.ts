export interface Product {
  id: string;
  name: string;
  sub: string;
  kind: ToyKind;
  price: number;
  ages: string;
  pieces: string;
  palette: string;      // el mundo cromático al que pertenece este juguete
  colorways: { name: string; body: string; accent: string; extra: string }[];
  blurb: string;
}

export type ToyKind =
  | 'bot' | 'spring' | 'stack' | 'blob' | 'racer'
  | 'roller' | 'planet' | 'noise';

export const PRODUCTS: Product[] = [
  {
    id: 'wobbl-bot',
    name: 'WOBBL BOT',
    sub: 'Compañero modular',
    kind: 'bot',
    price: 89,
    ages: '6+',
    pieces: '24 piezas',
    palette: 'electric',
    colorways: [
      { name: 'Señal', body: '#FF4433', accent: '#FFCE00', extra: '#2B2BFF' },
      { name: 'Azul Hondo', body: '#2B2BFF', accent: '#58E3B4', extra: '#FFF4E4' },
      { name: 'Día Libre', body: '#FFF4E4', accent: '#FF7FC4', extra: '#100C14' },
    ],
    blurb: 'Veinticuatro piezas que encajan a presión. La cabeza se cambia, los brazos giran, las piernas se alargan. Monta un amigo, rómpelo, monta uno mejor.',
  },
  {
    id: 'boing',
    name: 'BOING',
    sub: 'Muelle con carácter',
    kind: 'spring',
    price: 54,
    ages: '4+',
    pieces: '1 muelle, 2 humores',
    palette: 'bubble',
    colorways: [
      { name: 'Caramelo', body: '#FF7FC4', accent: '#FFCE00', extra: '#2B2BFF' },
      { name: 'Ácido', body: '#B7F04A', accent: '#E5007D', extra: '#100C14' },
      { name: 'Nube', body: '#6FD0FF', accent: '#FFF4E4', extra: '#FF4433' },
    ],
    blurb: 'Una espiral de acero dentro de una carcasa de silicona blanda. Aplástalo del todo, suéltalo y míralo llegar al techo.',
  },
  {
    id: 'stack',
    name: 'SUPERTORRE',
    sub: 'Sistema de equilibrio',
    kind: 'stack',
    price: 72,
    ages: '3+',
    pieces: '18 bloques',
    palette: 'lemon',
    colorways: [
      { name: 'Primarios', body: '#FFCE00', accent: '#FF4433', extra: '#2B2BFF' },
      { name: 'Sorbete', body: '#FF7FC4', accent: '#58E3B4', extra: '#FFF4E4' },
      { name: 'Grafito', body: '#100C14', accent: '#B7F04A', extra: '#FFF4E4' },
    ],
    blurb: 'Bloques de haya con peso y caras imantadas. Encajan con un clic. También se caen de una forma preciosa.',
  },
  {
    id: 'blob',
    name: 'BLOB',
    sub: 'Criatura blandita',
    kind: 'blob',
    price: 39,
    ages: '3+',
    pieces: 'Un cuerpo muy blando',
    palette: 'mint',
    colorways: [
      { name: 'Slime', body: '#58E3B4', accent: '#100C14', extra: '#FFCE00' },
      { name: 'Uva', body: '#7B3FE4', accent: '#FFF4E4', extra: '#FF7FC4' },
      { name: 'Melocotón', body: '#FF7A1A', accent: '#2A1000', extra: '#FFF4E4' },
    ],
    blurb: 'Silicona apta para uso alimentario con núcleo de retorno lento. Apriétalo y tardará tres segundos enteros en perdonarte.',
  },
  {
    id: 'zip-racer',
    name: 'ZIP VELOZ',
    sub: 'Bólido de cuerda',
    kind: 'racer',
    price: 64,
    ages: '5+',
    pieces: 'Chasis de zamak',
    palette: 'tomato',
    colorways: [
      { name: 'Vuelta Rápida', body: '#FF4433', accent: '#FFF4E4', extra: '#FFCE00' },
      { name: 'Nocturno', body: '#100C14', accent: '#FF7A1A', extra: '#6FD0FF' },
      { name: 'Equipo Menta', body: '#58E3B4', accent: '#2B2BFF', extra: '#FFF4E4' },
    ],
    blurb: 'Tira de él cuatro centímetros, suéltalo y piérdelo debajo del sofá. Nueve metros sobre suelo duro.',
  },
  {
    id: 'moon-roller',
    name: 'RUEDA LUNA',
    sub: 'Rueda cinética',
    kind: 'roller',
    price: 58,
    ages: '6+',
    pieces: 'Núcleo giroscópico',
    palette: 'sky',
    colorways: [
      { name: 'Órbita', body: '#6FD0FF', accent: '#FFCE00', extra: '#2B2BFF' },
      { name: 'Eclipse', body: '#7B3FE4', accent: '#FFF4E4', extra: '#FF7FC4' },
      { name: 'Polvo', body: '#FFF4E4', accent: '#FF4433', extra: '#100C14' },
    ],
    blurb: 'Un volante de inercia que se niega a caerse. Dale una vuelta y aguantará más que tú.',
  },
  {
    id: 'puzzle-planet',
    name: 'PLANETA PUZLE',
    sub: 'Puzle esférico',
    kind: 'planet',
    price: 95,
    ages: '8+',
    pieces: '32 segmentos',
    palette: 'grape',
    colorways: [
      { name: 'Nebulosa', body: '#7B3FE4', accent: '#B7F04A', extra: '#FFCE00' },
      { name: 'Amanecer', body: '#FF7A1A', accent: '#2B2BFF', extra: '#FFF4E4' },
      { name: 'Abismo', body: '#2B2BFF', accent: '#6FD0FF', extra: '#FF7FC4' },
    ],
    blurb: 'Treinta y dos segmentos curvos que solo cierran de una manera. Hay 4.200 millones de respuestas equivocadas.',
  },
  {
    id: 'noise-maker',
    name: 'CAJA DE RUIDO',
    sub: 'Máquina de sonido',
    kind: 'noise',
    price: 44,
    ages: '4+',
    pieces: '6 voces',
    palette: 'lime',
    colorways: [
      { name: 'Bocina', body: '#B7F04A', accent: '#E5007D', extra: '#100C14' },
      { name: 'Sirena', body: '#FF4433', accent: '#FFCE00', extra: '#FFF4E4' },
      { name: 'Silencio', body: '#FFF4E4', accent: '#7B3FE4', extra: '#58E3B4' },
    ],
    blurb: 'Seis voces mecánicas y un límite de volumen muy considerado. Padres y madres: hemos pensado en vosotros. Un momento.',
  },
];

export const byProductId = (id: string) => PRODUCTS.find((p) => p.id === id);

export interface Character {
  id: string;
  name: string;
  role: string;
  trait: string;
  body: string;
  accent: string;
  line: string;
}

export const CHARACTERS: Character[] = [
  { id: 'robo',  name: 'ROBO', role: 'El curioso', trait: 'Hace 400 preguntas al día', body: '#2B2BFF', accent: '#FFCE00', line: '¿Y este botón qué hace?' },
  { id: 'blob',  name: 'BLOB', role: 'El gelatinoso', trait: 'Sin huesos y sin problemas', body: '#58E3B4', accent: '#100C14', line: 'Quepo en cualquier sitio. Literal.' },
  { id: 'zip',   name: 'ZIP',  role: 'El rápido', trait: 'Ya se ha ido', body: '#FF7A1A', accent: '#FFF4E4', line: 'He llegado antes. Dos veces.' },
  { id: 'boom',  name: 'BOOM', role: 'El caótico', trait: 'Vetado en la fábrica', body: '#E5007D', accent: '#B7F04A', line: 'Todo es un tambor.' },
];

export const STORY = [
  { year: '1998', title: 'UN JUGUETE ROTO', text: 'Nuestro fundador desmontó un coche teledirigido para ver qué lo hacía moverse. Nunca volvió a moverse. Pero algo más empezó a hacerlo.', kind: 'racer' as ToyKind, palette: 'ink' },
  { year: '2004', title: 'UNA CAJA DE PIEZAS', text: 'Un garaje. Dos mil componentes descabalados. La primera regla de la casa: si no encaja solo, rediseña el encaje.', kind: 'stack' as ToyKind, palette: 'lemon' },
  { year: '2011', title: 'EL PRIMER AMIGO', text: 'ROBO salió en una caja de cartón marrón con la cara dibujada a mano. Cuatrocientas unidades. Se agotaron en un fin de semana.', kind: 'bot' as ToyKind, palette: 'electric' },
  { year: '2019', title: 'COLOR, MUY ALTO', text: 'Dejamos de preguntarnos de qué color debía ser un juguete y empezamos a preguntarnos cuántos aguantaba.', kind: 'planet' as ToyKind, palette: 'bubble' },
  { year: 'HOY',  title: 'JUGAR NO TIENE REGLAS', text: 'Once personas, una fábrica y una cantidad poco razonable de prototipos. Seguimos desmontando cosas para ver qué las hace moverse.', kind: 'blob' as ToyKind, palette: 'mint' },
];
