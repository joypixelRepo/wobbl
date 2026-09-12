'use client';

import Image from 'next/image';
import Toy from '@/components/Toy';
import { has3D } from '@/components/three/models';
import { byProductId, type Product, type ToyKind } from '@/data/catalog';

/**
 * La ficha del producto, tal cual sale del plató 3D.
 *
 * Es el MISMO modelo que se gira en la ficha de producto, solo que
 * horneado a imagen una vez (`/bake` → `public/productos/`). Va como
 * imagen y no como lienzo vivo por una razón medida: el navegador corta
 * alrededor de dieciséis contextos WebGL y la estantería sola tiene
 * veintiocho tarjetas. Así además pesa cero en ejecución y se ve igual
 * en un móvil.
 *
 * Si una pieza no tuviera modelo, cae al dibujo vectorial y no se rompe
 * nada.
 */
export default function ProductShot({
  product, colorway = 0, className, priority = false, sizes = '(max-width: 700px) 60vw, 300px',
}: {
  product: Product | ToyKind | string;
  colorway?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const p = typeof product === 'string' ? byProductId(product) : product;
  if (!p) return null;
  const cw = p.colorways[colorway] ?? p.colorways[0];
  const idx = p.colorways[colorway] ? colorway : 0;

  if (!has3D(p.kind)) {
    return (
      <Toy
        kind={p.kind}
        body={cw.body}
        accent={cw.accent}
        extra={cw.extra}
        shadow={false}
        className={className}
      />
    );
  }

  return (
    <Image
      src={`/productos/${p.id}-${idx}.png`}
      alt={`${p.name} en ${cw.name}`}
      width={512}
      height={512}
      sizes={sizes}
      priority={priority}
      className={`product-shot ${className ?? ''}`}
      draggable={false}
    />
  );
}
