/* ------------------------------------------------------------------ *
 * El catálogo. Marca ficticia, juguetes ficticios — pero juguetes de
 * los de verdad: coches, cohetes, dinosaurios, casas de muñecas. Cada
 * producto apunta a un dibujo de components/toys/ a través de `kind`.
 * ------------------------------------------------------------------ */

export type ToyKind =
  /* clásicos */
  | 'bot' | 'spring' | 'stack' | 'blob' | 'racer' | 'planet' | 'noise'
  /* vehículos */
  | 'plane' | 'rocket' | 'digger' | 'train' | 'ufo'
  | 'firetruck' | 'tractor' | 'boat' | 'heli' | 'sub' | 'bus'
  /* criaturas */
  | 'dino' | 'unicorn' | 'dragon' | 'bear'
  /* mundos */
  | 'dollhouse' | 'castle' | 'kitchen' | 'ferris' | 'lab' | 'track';

export type CategoryId = 'rueda' | 'criaturas' | 'mundos' | 'clasicos';

export interface Category {
  id: CategoryId;
  name: string;
  line: string;
}

export const CATEGORIES: Category[] = [
  { id: 'rueda',     name: 'SOBRE RUEDAS', line: 'Todo lo que corre, vuela, excava o se sumerge. Quieto, y en vidrio.' },
  { id: 'criaturas', name: 'CRIATURAS',    line: 'Tienen nombre, tienen carácter y no parpadean nunca.' },
  { id: 'mundos',    name: 'MUNDOS',       line: 'No son una pieza: son un sitio entero, en miniatura.' },
  { id: 'clasicos',  name: 'CLÁSICOS',     line: 'Las formas de siempre, sopladas donde no tocaba.' },
];

export interface Colorway { name: string; body: string; accent: string; extra: string }

export interface Product {
  id: string;
  name: string;
  sub: string;
  kind: ToyKind;
  category: CategoryId;
  price: number;
  /** altura de la pieza; el vidrio se cataloga por tamaño, no por edad */
  size: string;
  /** cómo está hecha */
  pieces: string;
  palette: string;      // el mundo cromático al que pertenece esta pieza
  colorways: Colorway[];
  blurb: string;
  /** sale a la habitación de la sección 02 */
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  /* ------------------------- SOBRE RUEDAS ------------------------- */
  {
    id: 'coche-de-carreras', name: 'COCHE DE CARRERAS', sub: 'Vidrio macizo', kind: 'racer', category: 'rueda',
    price: 64, size: '9 cm', pieces: 'Soplado en molde', palette: 'tomato', featured: true,
    colorways: [
      { name: 'Vuelta Rápida', body: '#FF4433', accent: '#FFF4E4', extra: '#FFCE00' },
      { name: 'Nocturno', body: '#100C14', accent: '#FF7A1A', extra: '#6FD0FF' },
      { name: 'Equipo Menta', body: '#58E3B4', accent: '#2B2BFF', extra: '#FFF4E4' },
    ],
    blurb: 'Macizo de parte a parte: pesa el triple de lo que aparenta. Las cuatro ruedas se aplican en caliente de una en una, así que ninguna queda exactamente igual que su pareja.',
  },
  {
    id: 'avioneta', name: 'AVIONETA', sub: 'Alas estiradas a mano', kind: 'plane', category: 'rueda',
    price: 69, size: '11 cm', pieces: 'Al soplete', palette: 'sky', featured: true,
    colorways: [
      { name: 'Vuelo Corto', body: '#6FD0FF', accent: '#FF4433', extra: '#FFF4E4' },
      { name: 'Correo Aéreo', body: '#FFCE00', accent: '#2B2BFF', extra: '#FFF4E4' },
      { name: 'Acrobática', body: '#E5007D', accent: '#B7F04A', extra: '#100C14' },
    ],
    blurb: 'Las alas se estiran con la pieza al rojo y se cortan a ojo. La hélice es un hilo de vidrio girado en caliente: lo único que se mueve aquí es la luz que la atraviesa.',
  },
  {
    id: 'cohete', name: 'COHETE ESPACIAL', sub: 'Burbuja atrapada en el morro', kind: 'rocket', category: 'rueda',
    price: 74, size: '16 cm', pieces: 'Soplado a caña', palette: 'electric', featured: true,
    colorways: [
      { name: 'Despegue', body: '#FFF4E4', accent: '#FF4433', extra: '#2B2BFF' },
      { name: 'Órbita Baja', body: '#2B2BFF', accent: '#FFCE00', extra: '#6FD0FF' },
      { name: 'Cara Oculta', body: '#7B3FE4', accent: '#B7F04A', extra: '#FF7FC4' },
    ],
    blurb: 'Lleva una burbuja de aire encerrada en el morro, puesta ahí a propósito. Ponlo delante de una ventana y el interior entero se enciende.',
  },
  {
    id: 'excavadora', name: 'EXCAVADORA', sub: 'Brazo unido en frío', kind: 'digger', category: 'rueda',
    price: 79, size: '10 cm', pieces: 'Vidrio macizo', palette: 'lemon',
    colorways: [
      { name: 'Obra', body: '#FFCE00', accent: '#FF4433', extra: '#100C14' },
      { name: 'Cantera', body: '#FF7A1A', accent: '#2B2BFF', extra: '#FFF4E4' },
      { name: 'Nocturna', body: '#100C14', accent: '#B7F04A', extra: '#FFCE00' },
    ],
    blurb: 'El brazo se sopla aparte y se une en frío con un punto de resina óptica que no se ve. La cuchara es lo único esmerilado de toda la pieza.',
  },
  {
    id: 'tren-de-vapor', name: 'TREN DE VAPOR', sub: 'Enganche imantado', kind: 'train', category: 'rueda',
    price: 99, size: '18 cm', pieces: 'Soplado en molde', palette: 'mint', featured: true,
    colorways: [
      { name: 'Correo', body: '#58E3B4', accent: '#FF4433', extra: '#FFF4E4' },
      { name: 'Exprés', body: '#FF4433', accent: '#FFCE00', extra: '#100C14' },
      { name: 'Montaña', body: '#2B2BFF', accent: '#FF7FC4', extra: '#FFF4E4' },
    ],
    blurb: 'Locomotora y dos vagones, cada uno en su molde y doce horas de recocido. Llevan un imán embutido en la base: se enganchan entre ellos y se quedan quietos en el raíl de cristal esmerilado que viene con el juego.',
  },
  {
    id: 'nave-espacial', name: 'NAVE ESPACIAL', sub: 'Cúpula de cristal óptico', kind: 'ufo', category: 'rueda',
    price: 62, size: '12 cm ⌀', pieces: 'Doble capa', palette: 'grape',
    colorways: [
      { name: 'Visita', body: '#7B3FE4', accent: '#B7F04A', extra: '#6FD0FF' },
      { name: 'Sigilo', body: '#100C14', accent: '#58E3B4', extra: '#FFCE00' },
      { name: 'Turista', body: '#FF7FC4', accent: '#FFCE00', extra: '#FFF4E4' },
    ],
    blurb: 'Cúpula de cristal óptico sobre un disco de color. La lente aumenta lo que hay debajo, así que las luces se ven del doble de grandes de lo que son.',
  },
  {
    id: 'camion-de-bomberos', name: 'CAMIÓN DE BOMBEROS', sub: 'Rojo de selenio', kind: 'firetruck', category: 'rueda',
    price: 84, size: '13 cm', pieces: 'Color en caliente', palette: 'tomato',
    colorways: [
      { name: 'Alarma', body: '#FF4433', accent: '#FFCE00', extra: '#FFF4E4' },
      { name: 'Aeropuerto', body: '#B7F04A', accent: '#FF4433', extra: '#100C14' },
      { name: 'Ciudad', body: '#FFF4E4', accent: '#FF4433', extra: '#2B2BFF' },
    ],
    blurb: 'El rojo es de selenio: el pigmento más caro del taller y el único que no vira a naranja al recocer. La escala va pulida a la rueda, tramo a tramo.',
  },
  {
    id: 'autobus-escolar', name: 'AUTOBÚS ESCOLAR', sub: 'Ventanillas esmeriladas', kind: 'bus', category: 'rueda',
    price: 86, size: '15 cm', pieces: 'Soplado en molde', palette: 'lemon', featured: true,
    colorways: [
      { name: 'Ruta 12', body: '#FFCE00', accent: '#FF4433', extra: '#100C14' },
      { name: 'Excursión', body: '#FF7A1A', accent: '#FFF4E4', extra: '#2B2BFF' },
      { name: 'Urbano', body: '#6FD0FF', accent: '#2B2BFF', extra: '#FFF4E4' },
    ],
    blurb: 'Doce ventanillas esmeriladas una a una con arena a presión. Por dentro va hueco: a contraluz se le ve el aire.',
  },
  {
    id: 'tractor', name: 'TRACTOR', sub: 'Ruedas macizas', kind: 'tractor', category: 'rueda',
    price: 72, size: '10 cm', pieces: 'Vidrio macizo', palette: 'mint',
    colorways: [
      { name: 'Campo', body: '#B7F04A', accent: '#FF4433', extra: '#FFF4E4' },
      { name: 'Barbecho', body: '#FF7A1A', accent: '#100C14', extra: '#FFCE00' },
      { name: 'Rocío', body: '#58E3B4', accent: '#FFCE00', extra: '#2B2BFF' },
    ],
    blurb: 'Las dos ruedas traseras son discos macizos, y son las que hacen que la pieza se sostenga de pie. Pesa 640 gramos. No la dejes en el borde de la mesa.',
  },
  {
    id: 'barco-remolcador', name: 'BARCO REMOLCADOR', sub: 'Casco de dos capas', kind: 'boat', category: 'rueda',
    price: 58, size: '12 cm', pieces: 'Sobrecapa', palette: 'sky',
    colorways: [
      { name: 'Puerto', body: '#2B2BFF', accent: '#FF4433', extra: '#FFF4E4' },
      { name: 'Faro', body: '#FFF4E4', accent: '#FF4433', extra: '#6FD0FF' },
      { name: 'Alta Mar', body: '#100C14', accent: '#FFCE00', extra: '#58E3B4' },
    ],
    blurb: 'El color va por fuera y el interior se queda transparente, así que la línea de flotación se sigue viendo desde dentro del cristal.',
  },
  {
    id: 'helicoptero', name: 'HELICÓPTERO', sub: 'Rotor de hilo estirado', kind: 'heli', category: 'rueda',
    price: 76, size: '11 cm', pieces: 'Al soplete', palette: 'orange',
    colorways: [
      { name: 'Rescate', body: '#FF7A1A', accent: '#2B2BFF', extra: '#FFF4E4' },
      { name: 'Costa', body: '#FFCE00', accent: '#FF4433', extra: '#6FD0FF' },
      { name: 'Montaña', body: '#58E3B4', accent: '#100C14', extra: '#FFF4E4' },
    ],
    blurb: 'El rotor es un hilo de vidrio estirado por debajo de los dos milímetros y curvado con la llama. Es la parte más frágil del catálogo y la que más nos gusta.',
  },
  {
    id: 'submarino', name: 'SUBMARINO', sub: 'Ojos de buey pulidos', kind: 'sub', category: 'rueda',
    price: 66, size: '13 cm', pieces: 'Vidrio macizo', palette: 'electric',
    colorways: [
      { name: 'Abisal', body: '#2B2BFF', accent: '#FFCE00', extra: '#6FD0FF' },
      { name: 'Arrecife', body: '#58E3B4', accent: '#FF7A1A', extra: '#FFF4E4' },
      { name: 'Investigación', body: '#FFF4E4', accent: '#E5007D', extra: '#2B2BFF' },
    ],
    blurb: 'Macizo entero, con los ojos de buey pulidos a la rueda hasta dejarlos como lentes. Contra la luz, el casco se llena de reflejos que no están ahí.',
  },

  /* --------------------------- CRIATURAS -------------------------- */
  {
    id: 'robot-modular', name: 'ROBOT MODULAR', sub: 'Cuatro cuerpos imantados', kind: 'bot', category: 'criaturas',
    price: 89, size: '17 cm', pieces: 'Soplado en molde', palette: 'electric', featured: true,
    colorways: [
      { name: 'Señal', body: '#FF4433', accent: '#FFCE00', extra: '#2B2BFF' },
      { name: 'Azul Hondo', body: '#2B2BFF', accent: '#58E3B4', extra: '#FFF4E4' },
      { name: 'Día Libre', body: '#FFF4E4', accent: '#FF7FC4', extra: '#100C14' },
    ],
    blurb: 'Cuatro cuerpos soplados por separado que se apilan sin pegamento: los sujeta un imán embutido en cada base. Se pueden apilar en otro orden. Se pueden apilar mal.',
  },
  {
    id: 'dinosaurio', name: 'DINOSAURIO', sub: 'Placas aplicadas en caliente', kind: 'dino', category: 'criaturas',
    price: 88, size: '14 cm', pieces: 'Al soplete', palette: 'lemon', featured: true,
    colorways: [
      { name: 'Jungla', body: '#B7F04A', accent: '#FF4433', extra: '#FFCE00' },
      { name: 'Volcán', body: '#FF7A1A', accent: '#100C14', extra: '#FFCE00' },
      { name: 'Fósil', body: '#FFF4E4', accent: '#7B3FE4', extra: '#58E3B4' },
    ],
    blurb: 'Las placas del lomo se aplican de una en una con la pieza todavía blanda, y por eso no hay dos filas iguales. Los dientes son hilo blanco opaco, cortado a pinza.',
  },
  {
    id: 'unicornio', name: 'UNICORNIO', sub: 'Crin de cañas fundidas', kind: 'unicorn', category: 'criaturas',
    price: 68, size: '15 cm', pieces: 'Murrina', palette: 'bubble', featured: true,
    colorways: [
      { name: 'Merengue', body: '#FFF4E4', accent: '#FF7FC4', extra: '#6FD0FF' },
      { name: 'Atardecer', body: '#FF7FC4', accent: '#FFCE00', extra: '#7B3FE4' },
      { name: 'Medianoche', body: '#7B3FE4', accent: '#58E3B4', extra: '#FFF4E4' },
    ],
    blurb: 'La crin son cañas de color fundidas y estiradas juntas: el dibujo se repite a lo largo de todo el mechón, como en los caramelos. El cuerno lleva pan de oro.',
  },
  {
    id: 'dragon', name: 'DRAGÓN', sub: 'Alas de vidrio estirado', kind: 'dragon', category: 'criaturas',
    price: 92, size: '16 cm', pieces: 'Al soplete', palette: 'magenta',
    colorways: [
      { name: 'Brasa', body: '#E5007D', accent: '#FFCE00', extra: '#FF7A1A' },
      { name: 'Esmeralda', body: '#58E3B4', accent: '#FF4433', extra: '#FFCE00' },
      { name: 'Tormenta', body: '#2B2BFF', accent: '#B7F04A', extra: '#FFF4E4' },
    ],
    blurb: 'Las alas se estiran hasta dejarlas casi transparentes y los nervios se marcan con la punta de la pinza. La llama es ámbar sobre naranja, aplicada en caliente.',
  },
  {
    id: 'oso-de-peluche', name: 'OSO', sub: 'Esmerilado entero', kind: 'bear', category: 'criaturas',
    price: 46, size: '12 cm', pieces: 'Vidrio satinado', palette: 'cream',
    colorways: [
      { name: 'Tostado', body: '#FF7A1A', accent: '#FF4433', extra: '#FFF4E4' },
      { name: 'Nube', body: '#FFF4E4', accent: '#FF7FC4', extra: '#6FD0FF' },
      { name: 'Musgo', body: '#58E3B4', accent: '#FFCE00', extra: '#FFF4E4' },
    ],
    blurb: 'Chorro de arena por toda la superficie: pierde el brillo y gana un tacto de terciopelo que engaña a la mano. Es el único de la casa que no refleja nada.',
  },
  {
    id: 'muneco-blandito', name: 'MUÑECO', sub: 'Una sola gota', kind: 'blob', category: 'criaturas',
    price: 39, size: '9 cm', pieces: 'Vidrio macizo', palette: 'mint',
    colorways: [
      { name: 'Slime', body: '#58E3B4', accent: '#100C14', extra: '#FFCE00' },
      { name: 'Uva', body: '#7B3FE4', accent: '#FFF4E4', extra: '#FF7FC4' },
      { name: 'Melocotón', body: '#FF7A1A', accent: '#2A1000', extra: '#FFF4E4' },
    ],
    blurb: 'Una gota de vidrio dejada caer y detenida a mitad de camino. Los ojos son dos puntos de negro puestos con la punta de la caña, antes de que enfríe.',
  },

  /* ----------------------------- MUNDOS --------------------------- */
  {
    id: 'casa-de-munecas', name: 'CASA DE MUÑECAS', sub: 'Fachada abierta', kind: 'dollhouse', category: 'mundos',
    price: 189, size: '19 cm', pieces: 'Placas fundidas', palette: 'bubble', featured: true,
    colorways: [
      { name: 'Barrio', body: '#FFF4E4', accent: '#FF4433', extra: '#6FD0FF' },
      { name: 'Costa', body: '#6FD0FF', accent: '#FFF4E4', extra: '#FFCE00' },
      { name: 'Ciudad', body: '#FF7FC4', accent: '#7B3FE4', extra: '#FFCE00' },
    ],
    blurb: 'Seis placas fundidas en horno y montadas a inglete. Los muebles van sueltos dentro: se sacan con dos dedos y no se pegan a nada.',
  },
  {
    id: 'castillo', name: 'CASTILLO MEDIEVAL', sub: 'Torres sopladas aparte', kind: 'castle', category: 'mundos',
    price: 149, size: '21 cm', pieces: 'Soplado a caña', palette: 'grape', featured: true,
    colorways: [
      { name: 'Piedra', body: '#FFF4E4', accent: '#FF4433', extra: '#2B2BFF' },
      { name: 'Asedio', body: '#7B3FE4', accent: '#FFCE00', extra: '#B7F04A' },
      { name: 'Bosque', body: '#58E3B4', accent: '#E5007D', extra: '#FFF4E4' },
    ],
    blurb: 'Dos torres sopladas aparte y unidas al cuerpo en caliente, con la junta a la vista porque nos gusta que se vea. Las almenas se cortan a tijera con el vidrio blando.',
  },
  {
    id: 'cocinita', name: 'COCINA', sub: 'Encimera maciza', kind: 'kitchen', category: 'mundos',
    price: 129, size: '18 cm', pieces: 'Placas fundidas', palette: 'lemon', featured: true,
    colorways: [
      { name: 'Mantequilla', body: '#FFF4E4', accent: '#FF4433', extra: '#58E3B4' },
      { name: 'Bistró', body: '#2B2BFF', accent: '#FFCE00', extra: '#FFF4E4' },
      { name: 'Pistacho', body: '#B7F04A', accent: '#FF7A1A', extra: '#FFF4E4' },
    ],
    blurb: 'La encimera es una placa maciza de dos centímetros que pesa más que todo lo demás junto. Los fuegos son cuatro discos de rojo aplicados en caliente.',
  },
  {
    id: 'noria', name: 'NORIA', sub: 'Aro de una sola pieza', kind: 'ferris', category: 'mundos',
    price: 139, size: '22 cm', pieces: 'Soplado a caña', palette: 'magenta',
    colorways: [
      { name: 'Verbena', body: '#E5007D', accent: '#FFCE00', extra: '#6FD0FF' },
      { name: 'Domingo', body: '#FFCE00', accent: '#FF4433', extra: '#FFF4E4' },
      { name: 'Noche', body: '#100C14', accent: '#FF7FC4', extra: '#58E3B4' },
    ],
    blurb: 'El aro se sopla entero y se cierra en caliente: no tiene junta por ningún lado. Las ocho cabinas cuelgan de hilo de vidrio y se mueven si pasas cerca.',
  },
  {
    id: 'laboratorio', name: 'LABORATORIO DE CIENCIA', sub: 'Matraz soplado a caña', kind: 'lab', category: 'mundos',
    price: 96, size: '17 cm', pieces: 'Borosilicato', palette: 'mint',
    colorways: [
      { name: 'Reactivo', body: '#58E3B4', accent: '#E5007D', extra: '#FFF4E4' },
      { name: 'Turno Noche', body: '#100C14', accent: '#B7F04A', extra: '#6FD0FF' },
      { name: 'Aula', body: '#FFF4E4', accent: '#2B2BFF', extra: '#FFCE00' },
    ],
    blurb: 'Borosilicato del mismo que usan los laboratorios de verdad, soplado pieza por pieza. El líquido de dentro es vidrio de color: sólido, y para siempre.',
  },
  {
    id: 'pista-de-coches', name: 'PISTA DE COCHES', sub: 'Rizo de una sola caña', kind: 'track', category: 'mundos',
    price: 112, size: '24 cm', pieces: 'Vidrio estirado', palette: 'tomato', featured: true,
    colorways: [
      { name: 'Circuito', body: '#100C14', accent: '#FF4433', extra: '#FFCE00' },
      { name: 'Neón', body: '#2B2BFF', accent: '#B7F04A', extra: '#FF7FC4' },
      { name: 'Arcilla', body: '#FF7A1A', accent: '#FFF4E4', extra: '#2B2BFF' },
    ],
    blurb: 'El rizo es una caña estirada y curvada en caliente sobre una plantilla de grafito. El coche va suelto y no rueda: se posa donde tú lo dejes.',
  },

  /* ---------------------------- CLÁSICOS -------------------------- */
  {
    id: 'torre-de-bloques', name: 'TORRE DE AROS', sub: 'Aros con base imantada', kind: 'stack', category: 'clasicos',
    price: 72, size: '16 cm', pieces: 'Vidrio macizo', palette: 'lemon',
    colorways: [
      { name: 'Primarios', body: '#FFCE00', accent: '#FF4433', extra: '#2B2BFF' },
      { name: 'Sorbete', body: '#FF7FC4', accent: '#58E3B4', extra: '#FFF4E4' },
      { name: 'Grafito', body: '#100C14', accent: '#B7F04A', extra: '#FFF4E4' },
    ],
    blurb: 'Cinco aros macizos ensartados en un eje de cristal, cada uno con su imán en la cara de abajo para que la torre no se venga si rozas la mesa. Apilados, la luz atraviesa los cinco colores a la vez y pinta el suelo.',
  },
  {
    id: 'muelle-saltarin', name: 'ESPIRAL', sub: 'Siete vueltas sin molde', kind: 'spring', category: 'clasicos',
    price: 54, size: '14 cm', pieces: 'Al soplete', palette: 'bubble',
    colorways: [
      { name: 'Caramelo', body: '#FF7FC4', accent: '#FFCE00', extra: '#2B2BFF' },
      { name: 'Ácido', body: '#B7F04A', accent: '#E5007D', extra: '#100C14' },
      { name: 'Nube', body: '#6FD0FF', accent: '#FFF4E4', extra: '#FF4433' },
    ],
    blurb: 'Siete vueltas estiradas a la llama sobre un mandril, sin molde y sin plantilla. No salta, no se estira y no vuelve: solo se queda ahí, torciendo la luz.',
  },
  {
    id: 'puzle-esferico', name: 'PUZLE ESFÉRICO', sub: 'Gajos tallados a la rueda', kind: 'planet', category: 'clasicos',
    price: 95, size: '11 cm ⌀', pieces: 'Tallado en frío', palette: 'grape',
    colorways: [
      { name: 'Nebulosa', body: '#7B3FE4', accent: '#B7F04A', extra: '#FFCE00' },
      { name: 'Amanecer', body: '#FF7A1A', accent: '#2B2BFF', extra: '#FFF4E4' },
      { name: 'Abismo', body: '#2B2BFF', accent: '#6FD0FF', extra: '#FF7FC4' },
    ],
    blurb: 'Los gajos no están pintados: están tallados con rueda de diamante, uno a uno, sobre la esfera ya recocida. Cada surco son cuatro minutos.',
  },
  {
    id: 'caja-musical', name: 'ORGANILLO', sub: 'Bocina con pan de oro', kind: 'noise', category: 'clasicos',
    price: 44, size: '15 cm', pieces: 'Soplado en molde', palette: 'magenta',
    colorways: [
      { name: 'Bocina', body: '#B7F04A', accent: '#E5007D', extra: '#100C14' },
      { name: 'Sirena', body: '#FF4433', accent: '#FFCE00', extra: '#FFF4E4' },
      { name: 'Silencio', body: '#FFF4E4', accent: '#7B3FE4', extra: '#58E3B4' },
    ],
    blurb: 'No suena. La bocina se sopla en molde y se recubre de pan de oro por dentro, así que lo único que sale de ella es luz.',
  },
];

export const byProductId = (id: string) => PRODUCTS.find((p) => p.id === id);

/**
 * Qué producto representa un dibujo. Los juguetes sueltos que decoran
 * la página (los que flotan en el héroe, los del laboratorio de color,
 * los de la historia) se declaran por `kind`, no por id: esto es lo que
 * permite abrir su ficha al pulsarlos estén donde estén.
 */
export const byKind = (kind: ToyKind) => PRODUCTS.find((p) => p.kind === kind);

export const byCategory = (id: CategoryId) => PRODUCTS.filter((p) => p.category === id);

/** Los que salen a la habitación de la sección 02. */
export const FEATURED = PRODUCTS.filter((p) => p.featured);

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
  { year: '1998', title: 'UN JUGUETE ROTO', text: 'A nuestro fundador se le cayó al suelo un caballito de cristal de su abuela. Recogió los pedazos, los miró a contraluz y se le ocurrió que había que aprender a hacer otro.', kind: 'racer' as ToyKind, palette: 'ink' },
  { year: '2004', title: 'UNA CAJA DE PIEZAS', text: 'Un horno de segunda mano en un garaje y dos mil intentos fallidos. La primera regla de la casa: si se raja al enfriar, el fallo no es del vidrio, es tuyo.', kind: 'stack' as ToyKind, palette: 'lemon' },
  { year: '2011', title: 'EL PRIMER AMIGO', text: 'ROBO salió en una caja de cartón marrón con la cara puesta a mano, punto a punto. Cuatrocientas piezas. Se agotaron en un fin de semana.', kind: 'bot' as ToyKind, palette: 'electric' },
  { year: '2019', title: 'COLOR, MUY ALTO', text: 'Dejamos de preguntarnos de qué color debía ser una pieza y empezamos a preguntarnos cuántos colores aguanta el vidrio antes de enturbiarse.', kind: 'castle' as ToyKind, palette: 'bubble' },
  { year: 'HOY',  title: 'JUGAR NO TIENE REGLAS', text: 'Once personas, un horno encendido todo el año y una cantidad poco razonable de piezas que no llegaron a la estantería. Seguimos rompiendo cosas para ver por dónde rompen.', kind: 'dino' as ToyKind, palette: 'mint' },
];
