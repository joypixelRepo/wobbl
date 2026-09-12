'use client';

import ProductDetail from '@/components/ProductDetail';
import { useShop } from '@/lib/store';

/**
 * La ficha vive una sola vez, arriba del todo del árbol. Antes cada
 * sección tenía la suya, así que un juguete solo abría ficha si estaba
 * dentro de la estantería o de la habitación; ahora la abre cualquiera,
 * esté donde esté en la página.
 */
export default function ProductSheet() {
  const { sheet, closeSheet } = useShop();
  if (!sheet) return null;
  return <ProductDetail product={sheet} onClose={closeSheet} />;
}
