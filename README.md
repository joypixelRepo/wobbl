# WOBBL — *la web es un juguete*

Marca ficticia de juguetes de diseño, montada como una experiencia interactiva
continua en lugar de una tienda al uso. Todo reacciona: la tipografía, el cursor,
el fondo, los juguetes y la maquinaria.

**Arrancar**

```bash
npm install
npm run dev     # http://localhost:3210
```

```bash
npm run build && npm run start
```

---

## La idea

No hay hero + tres columnas + tarjetas. La página es un único scroll continuo por
una serie de *mundos*, cada uno con su paleta y con algo que se puede tocar.
**Ninguna zona jugable obliga a adivinar**: todas llevan sus pasos numerados y
marcan en cuál estás.

| Sección | Qué se puede hacer |
| --- | --- |
| **Preloader** | Cae una caja, vibra, salta la tapa y explota en color. Se puede saltar. |
| **Hero** — *Jugar no tiene reglas* | Robot modular gigante que sigue al cursor. Cada pieza (cabeza, pecho, brazos, piernas) reacciona y grita al pulsarla. |
| **Construye tu mundo** | Siete piezas y siete huecos. Al arrastrar una, su hueco se ilumina y avisa cuando ya encaja. Si la sueltas donde no toca, vuelve rebotando. Terminarlo es opcional. |
| **Statement** | El respiro: un objeto, una frase, mucho aire. |
| **Aquí viven todos** | Una habitación que se recorre en horizontal, anclada y guiada por el scroll con parallax de profundidad. Salen los juguetes destacados del catálogo; al tocar uno la cámara se acerca y se puede girar 360° arrastrando. |
| **Cambia el mundo** | Once mundos de color. Al pulsar una ficha se repinta el documento entero: fondo, tipografía, formas, sombras y todos los juguetes. |
| **La fábrica de juguetes** | Máquina real de cuatro pasos: enciende, elige molde, elige pintura y dale al botón verde. El bloque entra por la cinta, la prensa lo estampa, la cabina lo pinta y cae en la bandeja de salida. Los juguetes fabricados se pueden guardar en la caja. |
| **Arma jaleo** | Caja de física de verdad: coge, lanza, choca, apila. Explica cómo se juega antes de que toques nada y se quita de en medio en cuanto empiezas. |
| **La pandilla** | ROBO, BLOB, ZIP y BOOM te miran, parpadean a su ritmo, se apartan si te acercas demasiado y reaccionan al tocarlos. |
| **Por qué jugamos** | Cinco viñetas de cómic dirigidas por el scroll. |
| **Llévate uno a casa** | Los 28 artículos del catálogo, filtrables por tipo. Packaging, no tarjetas: se levanta la tapa y el juguete sale de la caja. |
| **Ficha de producto** | Se abre pulsando *cualquier* juguete de la web. Dentro, el producto en 3D real sobre fondo blanco, girable con la mano. |
| **Tu caja (carrito)** | El juguete vuela físicamente hasta el botón de la caja, que acusa el golpe. |
| **Nunca dejes de jugar** | `PÚLSAME` suelta todos los juguetes de la web por la pantalla. |

## Easter eggs

- Tres clics en el logo.
- La estrella tenue del hero → **MODO CAOS** durante seis segundos.
- Hacer scroll muy rápido en el hero.
- Mantener pulsado cualquier botón grueso.
- Acercar el cursor mucho a un personaje.
- Soltar una pieza de construcción en el sitio equivocado.

## Sonido

Todos los sonidos se **sintetizan en tiempo real** con la WebAudio API — clic,
encaje, boing, pop, golpe, campanilla — así que no hay ni un archivo de audio que
descargar. El audio nunca arranca solo: el interruptor `SONIDO` del HUD es lo
único que crea el contexto de audio, y la elección se recuerda.

## El catálogo

Veintiocho juguetes reconocibles — coche de carreras, avioneta, cohete,
excavadora, tren, nave, camión de bomberos, tractor, barco, helicóptero,
submarino, robot, dinosaurio, unicornio, dragón, oso, casa de muñecas, castillo,
cocinita, noria, laboratorio, pista de coches, torre de bloques, muelle, puzle
esférico y caja musical — repartidos en cuatro familias (`SOBRE RUEDAS`,
`CRIATURAS`, `MUNDOS`, `CLÁSICOS`). Todo vive en `data/catalog.ts`: nombre,
precio, edad, contenido, tres gamas de color y el `kind` que lo enlaza con su
dibujo.

Marca ficticia, productos ficticios y **sin cobro**: el checkout es parte de la
demo, no cobra nada.

## Los productos, en 3D

Los veintiocho artículos están modelados en three.js y se pueden girar con la
mano dentro de su ficha. No hay ni un modelo descargado ni una foto: todo sale
de primitivas con bisel, materiales de fábrica y un plató de luz construido a
mano.

```
components/three/
  Studio.tsx        el plató: cubo de luz con Lightformers (sin HDRI externo),
                    direccional con sombra y sombra de contacto
  ProductStage.tsx  encuadre automático: centra la pieza y calcula la distancia
  ProductViewer.tsx el lienzo de la ficha, cargado solo al abrirla
  materials.ts      pintura de automoción, plástico, tacto suave, goma, cromo,
                    metacrilato, peluche y haya
  parts.tsx         rueda, torneado, extrusión de silueta, tornillo, tacos
  models/           un archivo por juguete + el registro `kind -> modelo`
```

Tres reglas que salieron de modelarlos:

- **Ninguna arista viva.** Una pieza moldeada no puede desmoldearse con canto
  vivo, así que todo lleva bisel. Es esa línea fina de brillo la que convierte
  un cubo en plástico inyectado.
- **Barniz sobre color** (`clearcoat`), o el color se lee como cartulina.
- **La orientación nunca se mezcla con las props de fuera.** La rueda lo hacía y
  cualquier llamada que pasara `rotation` para hacerla rodar le borraba el eje:
  salían tumbadas. Ahora la orientación vive en un grupo interior y el giro se
  pide con `roll`.

**Rendimiento.** Un solo lienzo WebGL a la vez, y solo mientras hay una ficha
abierta. El navegador corta alrededor de dieciséis contextos y no los libera al
navegar: con un lienzo por tarjeta, la estantería entera deja de pintar. Para
llevar el 3D a la rejilla hace falta un único `<Canvas>` con `View` de drei
recortando por tijera.

## Dirección de arte

Sin fotografía de stock y sin modelos 3D: los veintiocho juguetes son vector
hecho a mano en `components/toys/`, todos en la misma caja de 200×200, todos
sobre la misma sombra de suelo y todos compartiendo el kit de materiales de
`components/toys/kit.tsx` — luz clave arriba a la izquierda, rebote cálido y un
punto especular pequeño. Por eso un cohete y una casa de muñecas siguen
pareciendo salidos de la misma fábrica. Eso mantiene la página ligera y permite
recolorear cualquier juguete al instante desde el sistema de color.

Dos reglas que se aprendieron dibujando: **la silueta nunca se pinta con
`extra`** (es justo el color del fondo de la caja del producto, y la pieza
desaparece), y **todo añadido tiene que solaparse con el cuerpo** o se lee como
una pieza suelta flotando. El cristal y las cabinas llevan contorno propio para
leerse sobre cualquier fondo.

- **Display:** Fredoka — redondeada, geométrica, contemporánea.
- **Interfaz:** Space Grotesk — mantiene el tono editorial en lugar de infantil.
- **Paleta:** once mundos completos, servidos por custom properties de CSS en
  `:root` (`lib/theme.ts`). El scroll los cambia; el laboratorio de color deja
  que mande la persona que navega.

## Arquitectura

```
app/
  layout.tsx        fuentes, metadatos
  page.tsx          la narrativa completa, en orden
  globals.css       tokens + estilos de cada sección
components/
  Toy.tsx           el shell SVG + el registro kind -> dibujo
  toys/kit.tsx      materiales, ojos, ruedas y tacos compartidos
  toys/vehicles.tsx avión, cohete, excavadora, tren, nave, bomberos, tractor,
                    barco, helicóptero, submarino
  toys/creatures.tsx dinosaurio, unicornio, dragón, oso
  toys/worlds.tsx   casa de muñecas, castillo, cocinita, noria, laboratorio, pista
  toys/classics.tsx robot, muelle, torre, blandito, coche, puzle, caja musical
  Cursor.tsx        cursor propio: formas, palabras, estela de partículas
  HowTo.tsx         pasos numerados y avisos de "empieza por aquí"
  Preloader.tsx     la apertura de la caja
  Hud.tsx           logo, sonido, caja, menú
  ToyBoxMenu.tsx    el menú como una caja que se abre
  ToyBoxCart.tsx    el carrito como una caja donde caen cosas
  Transition.tsx    transición de piezas de puzle (~900 ms)
  <Seccion>.tsx     un archivo por mundo
lib/
  physics.ts        solver pequeño de círculos/AABB — rebote, inercia, colisiones
  sound.ts          sonidos de juguete procedurales con WebAudio
  theme.ts          paletas + repintado en vivo
  store.tsx         carrito, sonido, modo caos
  hooks.ts          un único ticker rAF para toda la página
data/catalog.ts     28 productos, categorías, colores, personajes, historia
```

**Rendimiento.** Un solo `requestAnimationFrame` mueve todos los subsistemas
animados (`lib/hooks.ts`) en vez de N temporizadores. La animación se limita a
`transform` y `opacity`. El trabajo de canvas está detrás de
`IntersectionObserver`, así que la caja de física no cuesta nada hasta que
aparece en pantalla, y el número de cuerpos está limitado. Lenis alimenta a
ScrollTrigger de GSAP para que todas las animaciones de scroll lean del mismo
reloj. La entrada de scroll nunca se bloquea.

**Responsive.** En escritorio hay hover, arrastre y cursor propio. En táctil hay
toque, deslizamiento y arrastre: la sala horizontal anclada pasa a lista
vertical, el juguete del hero se mueve solo en lugar de seguir un puntero, y al
darle a FABRICAR la máquina se centra en pantalla para que veas lo que acabas de
poner en marcha. La escala tipográfica se calcula contra el eje *corto* del
viewport, para que los titulares sigan siendo enormes sin echar fuera de pantalla
la parte jugable.

**Accesibilidad.** Enlace para saltar al contenido, foco visible independiente
del cursor propio, `Escape` cierra menú, carrito y ficha de producto, y
`prefers-reduced-motion` detiene marquesinas, flotaciones, giros y desfiles.

## Añadir un juguete

1. Dibújalo en el archivo de `components/toys/` que le toque, con la firma
   `SubProps` y dentro del `viewBox` de 200×200.
2. Añade su `kind` a la unión `ToyKind` de `data/catalog.ts` y regístralo en el
   mapa `TOYS` de `components/Toy.tsx`.
3. Dale ficha en `PRODUCTS`. Con `featured: true` sale también a la habitación.

La estantería, la fábrica, el pie y el carrito lo recogen solos: ninguno tiene el
número de productos escrito a mano.

## Convertirlo en tienda real

`lib/store.tsx` es la costura. Ya gestiona líneas, cantidades, totales y
persistencia en localStorage con una forma estable `{ productId, colorway, qty }`.
Cambia `data/catalog.ts` por un CMS o una API de comercio, apunta el checkout a
una sesión real y la interfaz que hay por encima no cambia.

*WOBBL es una marca ficticia hecha como patio de juegos.*
