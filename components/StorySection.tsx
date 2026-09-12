'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductShot from '@/components/ProductShot';
import { SplitHeading, Sticker } from '@/components/ui';
import { STORY, byKind } from '@/data/catalog';
import { play } from '@/lib/sound';
import { useShop } from '@/lib/store';

const PANEL_COLORS = [
  { bg: '#100C14', fg: '#FFF4E4', a: '#FFCE00', b: '#2B2BFF', c: '#FF4433' },
  { bg: '#FFCE00', fg: '#241A00', a: '#FF4433', b: '#7B3FE4', c: '#2B2BFF' },
  { bg: '#2B2BFF', fg: '#EFF0FF', a: '#FFCE00', b: '#FF7FC4', c: '#58E3B4' },
  { bg: '#FF7FC4', fg: '#2A0016', a: '#FFCE00', b: '#2B2BFF', c: '#B7F04A' },
  { bg: '#58E3B4', fg: '#00291D', a: '#FF4433', b: '#7B3FE4', c: '#FFCE00' },
];

export default function StorySection() {
  const root = useRef<HTMLDivElement>(null);
  const { openSheet } = useShop();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.st-panel').forEach((panel, i) => {
        const dir = i % 2 ? 1 : -1;
        gsap.fromTo(
          panel.querySelector('.st-art'),
          { x: 120 * dir, rotate: 14 * dir, scale: .74, opacity: 0 },
          {
            x: 0, rotate: 0, scale: 1, opacity: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 82%', end: 'top 38%', scrub: .7 },
          },
        );
        gsap.fromTo(
          panel.querySelectorAll('.st-text > *'),
          { y: 46, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: .08, ease: 'power2.out',
            scrollTrigger: { trigger: panel, start: 'top 78%', end: 'top 44%', scrub: .7 },
          },
        );
        gsap.fromTo(
          panel,
          { clipPath: 'inset(12% 6% 12% 6% round 40px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 40px)',
            ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top 88%', end: 'top 46%', scrub: .6 },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => { ScrollTrigger.refresh(); }, []);

  return (
    <section id="story" className="story" ref={root} data-palette="cream">
      <div className="st-head scene">
        <div className="st-head-text">
          <Sticker rotate={-4} tone="a">SECCIÓN 07 — LA VERSIÓN LARGA</Sticker>
          <SplitHeading text="POR QUÉ" className="t-mega" />
          <SplitHeading text="JUGAMOS." className="t-mega st-h2" sticker />
          <p className="body-copy st-copy">
            Esto no es una declaración de intenciones. Son cinco viñetas, en orden, sobre cómo
            un caballito de cristal roto acabó siendo once personas y un horno encendido.
          </p>
        </div>

        <div className="st-contact" aria-hidden>
          {STORY.map((s2, i) => {
            const c = PANEL_COLORS[i % PANEL_COLORS.length];
            return (
              <span key={s2.year} style={{ background: c.bg }} data-cursor="view" onClick={() => openSheet(s2.kind)}>
                <ProductShot product={byKind(s2.kind)!} sizes="60px" />
              </span>
            );
          })}
          <span style={{ background: 'var(--fg)', color: 'var(--bg)', fontSize: '.54rem', letterSpacing: '.16em', fontWeight: 700 }}>1998→</span>
        </div>
      </div>

      {STORY.map((s, i) => {
        const c = PANEL_COLORS[i % PANEL_COLORS.length];
        return (
          <article
            key={s.year}
            className={`st-panel ${i % 2 ? 'flip' : ''}`}
            style={{ background: c.bg, color: c.fg }}
          >
            <div className="st-art" data-cursor="view" onPointerDown={() => play('boing')} onClick={() => openSheet(s.kind)}>
              <span className="st-blob" style={{ background: c.a }} aria-hidden />
              <ProductShot product={byKind(s.kind)!} sizes="(max-width: 860px) 62vw, 280px" />
              <span className="st-frame-no" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
            </div>

            <div className="st-text">
              <span className="st-year" style={{ background: c.a, color: c.bg }}>{s.year}</span>
              <h3 className="t-big st-title">{s.title}</h3>
              <p className="body-copy st-body">{s.text}</p>
            </div>

            <span className="st-doodle" aria-hidden style={{ borderColor: c.a }} />
          </article>
        );
      })}
    </section>
  );
}
