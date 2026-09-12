'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { play } from '@/lib/sound';

const CONFETTI = ['#FFCE00', '#FF4433', '#FF7A1A', '#FF7FC4', '#E5007D', '#2B2BFF', '#6FD0FF', '#B7F04A', '#58E3B4', '#7B3FE4'];
const SHAPES = ['circle', 'square', 'tri', 'bar', 'ring', 'star'] as const;

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [gone, setGone] = useState(false);

  // Deterministic scatter: the same layout on the server and in the browser,
  // so the very first paint never has to be thrown away.
  const pieces = useMemo(() => {
    let seed = 20260908;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    return Array.from({ length: 34 }, (_, i) => ({
      i,
      color: CONFETTI[i % CONFETTI.length],
      shape: SHAPES[i % SHAPES.length],
      size: Math.round(16 + rnd() * 34),
      angle: -140 + rnd() * 100,
      dist: 180 + rnd() * 460,
      rot: (rnd() - 0.5) * 900,
    }));
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { finish(true); return; }

    const ctx = gsap.context(() => {
      const t = gsap.timeline({ onComplete: () => finish(false) });
      tl.current = t;

      // 1 — the box lands
      t.fromTo('.pl-box', { y: -420, rotate: -18, scale: .7 },
        { y: 0, rotate: 0, scale: 1, duration: .62, ease: 'bounce.out' })
        .add(() => play('thud'), '<0.5')
        // 2 — it squashes on impact
        .to('.pl-box', { scaleY: .84, scaleX: 1.14, duration: .1, ease: 'power2.out' }, '-=.1')
        .to('.pl-box', { scaleY: 1, scaleX: 1, duration: .34, ease: 'elastic.out(1,.4)' })
        // 3 — something inside wants out
        .to('.pl-box', { x: '+=7', duration: .05, repeat: 7, yoyo: true, ease: 'none' }, '-=.2')
        .fromTo('.pl-click', { scale: 0, rotate: -14, opacity: 0 },
          { scale: 1, rotate: -8, opacity: 1, duration: .26, ease: 'back.out(3)' }, '-=.25')
        .add(() => play('click'))
        .to('.pl-click', { scale: 1.25, opacity: 0, duration: .26, ease: 'power2.in' }, '+=.12')
        // 4 — lid blows off
        .to('.pl-lid', { y: -300, rotate: -46, x: -70, duration: .6, ease: 'power2.out' }, '-=.3')
        .add(() => play('whoosh'), '<')
        // 5 — the toys escape
        .to('.pl-piece', {
          x: (i) => Math.cos((pieces[i].angle * Math.PI) / 180) * pieces[i].dist,
          y: (i) => Math.sin((pieces[i].angle * Math.PI) / 180) * pieces[i].dist,
          rotate: (i) => pieces[i].rot,
          scale: 1,
          opacity: 1,
          duration: 1.05,
          ease: 'power3.out',
          stagger: { amount: .18, from: 'center' },
        }, '-=.52')
        .add(() => play('pop'), '<0.05')
        .to('.pl-piece', { y: '+=900', rotate: '+=180', opacity: 0, duration: .8, ease: 'power2.in' }, '-=.35')
        // 6 — the colour explosion
        .to('.pl-wipe', {
          scaleY: 1,
          duration: .42,
          ease: 'power4.inOut',
          stagger: .045,
        }, '-=.85')
        .to('.pl-box', { opacity: 0, duration: .18 }, '<')
        .add(() => play('chime'), '<0.2')
        // 7 — the logo
        .fromTo('.pl-logo', { scale: .3, opacity: 0, rotate: -8 },
          { scale: 1, opacity: 1, rotate: 0, duration: .5, ease: 'back.out(2.4)' }, '-=.15')
        .fromTo('.pl-tag', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .3, ease: 'power2.out' }, '-=.2')
        .to({}, { duration: .35 });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish(instant: boolean) {
    if (gone) return;
    setGone(true);
    const el = root.current;
    if (!el) { onDone(); return; }
    gsap.to(el, {
      yPercent: -100,
      duration: instant ? 0 : .7,
      ease: 'power4.inOut',
      onComplete: () => onDone(),
    });
  }

  function skip() {
    play('click');
    tl.current?.progress(1).kill();
    finish(false);
  }

  return (
    <div ref={root} className="pl" role="status" aria-label="Sacando la pieza del horno">
      {/* colour explosion panels */}
      <div className="pl-wipes" aria-hidden>
        {['#FFCE00', '#FF7A1A', '#FF4433', '#FF7FC4', '#7B3FE4', '#2B2BFF', '#58E3B4', '#B7F04A'].map((c, i) => (
          <span key={c} className="pl-wipe" style={{ background: c, transformOrigin: i % 2 ? 'bottom' : 'top' }} />
        ))}
      </div>

      <div className="pl-stage">
        {/* pieces start hidden inside the box */}
        <div className="pl-pieces" aria-hidden>
          {pieces.map((p) => (
            <span
              key={p.i}
              className={`pl-piece pc-${p.shape}`}
              style={{ ['--pc' as string]: p.color, width: p.size, height: p.size }}
            />
          ))}
        </div>

        <div className="pl-box" aria-hidden>
          <div className="pl-lid">
            <span className="pl-lid-face">WOBBL</span>
          </div>
          <div className="pl-body">
            <span className="pl-body-label">CAJA Nº1</span>
          </div>
        </div>

        <span className="pl-click" aria-hidden>¡CLIC!</span>

        <div className="pl-logo" aria-hidden>
          WOBBL<span className="pl-dot">.</span>
        </div>
        <div className="pl-tag" aria-hidden>JUGAR NO TIENE REGLAS</div>
      </div>

      <button className="pl-skip" onClick={skip} type="button">
        SALTAR <span aria-hidden>→</span>
      </button>
    </div>
  );
}
