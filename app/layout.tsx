import type { Metadata, Viewport } from 'next';
import { Fredoka, Space_Grotesk } from 'next/font/google';
import './globals.css';

const display = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const ui = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WOBBL — Jugar no tiene reglas',
  description:
    'WOBBL fabrica juguetes de diseño para gente que nunca dejó de desmontar cosas. Abre la caja.',
  openGraph: {
    title: 'WOBBL — Jugar no tiene reglas',
    description: 'Una web con la que se juega. Juguetes de diseño, hechos para desmontarse.',
    type: 'website',
  },
  // WOBBL es una marca inventada: sus productos, precios, dirección y empresa
  // no existen. Fuera de los buscadores hasta que se decida lo contrario.
  // Para publicarla, cambiar los dos `false` por `true` y borrar la cabecera
  // X-Robots-Tag de next.config.mjs.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export const viewport: Viewport = {
  themeColor: '#FFF4E4',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${ui.variable}`}>
      <body>{children}</body>
    </html>
  );
}
