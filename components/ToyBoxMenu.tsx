'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { play } from '@/lib/sound';

export interface MenuItem { id: string; label: string; hint: string; color: string; }

export const MENU: MenuItem[] = [
  { id: 'collection', label: 'JUGUETES', hint: 'La colección',    color: '#FF4433' },
  { id: 'colors',     label: 'MUNDOS',   hint: 'Cámbialo todo',    color: '#2B2BFF' },
  { id: 'characters', label: 'NOSOTROS', hint: 'Conoce a la banda', color: '#58E3B4' },
  { id: 'story',      label: 'HISTORIA', hint: 'Por qué jugamos',  color: '#FFCE00' },
  { id: 'footer',     label: 'CONTACTO', hint: 'Escríbenos',       color: '#FF7FC4' },
];

/** Each menu entry is a different physical object, not a text link. */
function MenuIcon({ id }: { id: string }) {
  switch (id) {
    case 'collection': // a block
      return (
        <svg viewBox="0 0 100 100" className="mi">
          <rect x="14" y="30" width="72" height="52" rx="12" fill="var(--mi-a)" />
          <rect x="14" y="30" width="72" height="52" rx="12" fill="url(#mi-sheen)" />
          <ellipse cx="34" cy="30" rx="12" ry="6" fill="var(--mi-b)" />
          <ellipse cx="66" cy="30" rx="12" ry="6" fill="var(--mi-b)" />
          <rect x="26" y="46" width="48" height="9" rx="4.5" fill="rgba(255,255,255,.45)" />
        </svg>
      );
    case 'colors': // a planet
      return (
        <svg viewBox="0 0 100 100" className="mi">
          <circle cx="50" cy="50" r="30" fill="var(--mi-a)" />
          <path d="M28 38q22 12 44 0" stroke="var(--mi-b)" strokeWidth="7" fill="none" strokeLinecap="round" />
          <circle cx="62" cy="62" r="8" fill="var(--mi-b)" />
          <ellipse cx="50" cy="52" rx="46" ry="12" fill="none" stroke="var(--mi-b)" strokeWidth="6" transform="rotate(-16 50 52)" />
        </svg>
      );
    case 'characters': // a little friend
      return (
        <svg viewBox="0 0 100 100" className="mi">
          <path d="M50 16c18 0 30 13 30 30 0 20-14 26-14 34 0 5-7 6-16 6s-16-1-16-6c0-8-14-14-14-34 0-17 12-30 30-30z" fill="var(--mi-a)" />
          <circle cx="40" cy="46" r="7" fill="#fff" /><circle cx="41" cy="47" r="3.4" fill="#100C14" />
          <circle cx="62" cy="46" r="7" fill="#fff" /><circle cx="63" cy="47" r="3.4" fill="#100C14" />
          <path d="M42 64q9 8 18 0" stroke="var(--mi-b)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'story': // a comic page
      return (
        <svg viewBox="0 0 100 100" className="mi">
          <rect x="20" y="16" width="60" height="72" rx="9" fill="var(--mi-a)" />
          <rect x="28" y="24" width="20" height="20" rx="5" fill="var(--mi-b)" />
          <rect x="52" y="24" width="20" height="20" rx="5" fill="rgba(255,255,255,.55)" />
          <rect x="28" y="50" width="44" height="14" rx="5" fill="rgba(255,255,255,.55)" />
          <rect x="28" y="70" width="30" height="8" rx="4" fill="var(--mi-b)" />
        </svg>
      );
    default: // a toy phone
      return (
        <svg viewBox="0 0 100 100" className="mi">
          <rect x="22" y="34" width="56" height="48" rx="12" fill="var(--mi-a)" />
          <circle cx="50" cy="58" r="14" fill="rgba(255,255,255,.6)" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx="50" cy="47" r="3" fill="var(--mi-b)" transform={`rotate(${a} 50 58)`} />
          ))}
          <rect x="30" y="18" width="40" height="12" rx="6" fill="var(--mi-b)" />
          <path d="M30 24q20 -16 40 0" stroke="var(--mi-b)" strokeWidth="6" fill="none" />
        </svg>
      );
  }
}

export default function ToyBoxMenu({
  open, onClose, onNavigate,
}: { open: boolean; onClose: () => void; onNavigate: (id: string) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true })
        .set('.tb', { display: 'block' })
        .fromTo('.tb-crate', { yPercent: 100 }, { yPercent: 0, duration: .5, ease: 'power4.out' })
        .fromTo('.tb-lid', { yPercent: 0, rotate: 0 },
          { yPercent: -128, rotate: -7, duration: .6, ease: 'back.out(1.4)' }, '-=.38')
        .fromTo('.tb-item', { y: 90, opacity: 0, rotate: -14, scale: .6 },
          { y: 0, opacity: 1, rotate: 0, scale: 1, duration: .5, ease: 'back.out(2.2)', stagger: .07 }, '-=.34')
        .fromTo('.tb-foot', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .3 }, '-=.2');
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) { t.play(); play('clack'); }
    else {
      t.reverse();
      gsap.delayedCall(0.62, () => {
        if (root.current) gsap.set(root.current.querySelector('.tb'), { display: 'none' });
      });
    }
  }, [open]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  return (
    <div ref={root}>
      <div className="tb" style={{ display: 'none' }} aria-hidden={!open}>
        <div className="tb-crate">
          {/* the rim stays; the lid lifts off it */}
          <div className="tb-rim"><span>LA CAJA</span></div>
          <div className="tb-lid" aria-hidden><span>WOBBL</span></div>

          <nav className="tb-grid" aria-label="Principal">
            {MENU.map((m) => (
              <button
                key={m.id}
                className="tb-item"
                data-cursor="open"
                /* the secondary colour has to read on the dark crate, so it is cream, not ink */
                style={{ ['--mi-a' as string]: m.color, ['--mi-b' as string]: '#FFF4E4' }}
                onClick={() => { play('snap'); onNavigate(m.id); }}
                onPointerEnter={() => play('click')}
                type="button"
              >
                <span className="tb-obj"><MenuIcon id={m.id} /></span>
                <span className="tb-item-text">
                  <span className="tb-label">{m.label}</span>
                  <span className="tb-hint">{m.hint}</span>
                </span>
              </button>
            ))}
          </nav>

          <div className="tb-foot">
            <span>WOBBL JUGUETES · HECHOS EN UNA FÁBRICA DE VERDAD</span>
            <button className="tb-close" onClick={onClose} data-cursor="press" type="button">CERRAR LA CAJA ✕</button>
          </div>
        </div>
      </div>
      <svg width="0" height="0" aria-hidden style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="mi-sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity=".38" />
            <stop offset="60%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
