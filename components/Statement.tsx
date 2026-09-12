'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ProductShot from '@/components/ProductShot';
import { SplitHeading } from '@/components/ui';
import { useShop } from '@/lib/store';

/**
 * The quiet beat. After a loud, interactive section the page needs to stop
 * moving for a moment — one object, one sentence, a lot of air.
 */
export default function Statement({
  id, line1, line2, copy, product, colorway = 0, palette,
}: {
  id: string; line1: string; line2: string; copy: string;
  /** id de producto del catálogo: sale con su ficha 3D horneada */
  product: string; colorway?: number; palette: string;
}) {
  const root = useRef<HTMLElement>(null);
  const { openSheet } = useShop();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.stm-toy', {
        yPercent: -28, rotate: 12, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: .8 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id={id} className="scene statement" data-palette={palette} ref={root}>
      <div className="stm-inner">
        <SplitHeading text={line1} className="t-mega stm-l1" />
        <div className="stm-toy" data-cursor="view" onClick={() => openSheet(product)}>
          <ProductShot product={product} colorway={colorway} sizes="(max-width: 860px) 62vw, 260px" />
        </div>
        <SplitHeading text={line2} className="t-mega stm-l2" sticker />
      </div>
      <p className="body-copy stm-copy">{copy}</p>
    </section>
  );
}
