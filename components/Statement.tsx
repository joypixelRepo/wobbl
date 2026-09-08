'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Toy from '@/components/Toy';
import { SplitHeading } from '@/components/ui';
import type { ToyKind } from '@/data/catalog';

/**
 * The quiet beat. After a loud, interactive section the page needs to stop
 * moving for a moment — one object, one sentence, a lot of air.
 */
export default function Statement({
  id, line1, line2, copy, kind, palette, body, accent, extra,
}: {
  id: string; line1: string; line2: string; copy: string;
  kind: ToyKind; palette: string; body: string; accent: string; extra: string;
}) {
  const root = useRef<HTMLElement>(null);

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
        <div className="stm-toy"><Toy kind={kind} body={body} accent={accent} extra={extra} look={{ x: 0, y: 0 }} /></div>
        <SplitHeading text={line2} className="t-mega stm-l2" sticker />
      </div>
      <p className="body-copy stm-copy">{copy}</p>
    </section>
  );
}
