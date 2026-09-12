'use client';

import { useRef, useState } from 'react';
import Toy from '@/components/Toy';
import { SplitHeading, Sticker, ToyButton, Marquee } from '@/components/ui';
import { PRODUCTS } from '@/data/catalog';
import { play, fanfare } from '@/lib/sound';
import { rand, pick } from '@/lib/hooks';
import { useShop } from '@/lib/store';

interface Runner { id: number; kind: (typeof PRODUCTS)[number]['kind']; body: string; accent: string; extra: string; top: number; size: number; dur: number; dir: 1 | -1; delay: number; }
let rid = 1;

export default function Footer({ onTop }: { onTop: () => void }) {
  const { openSheet } = useShop();
  const [runners, setRunners] = useState<Runner[]>([]);
  const [sent, setSent] = useState(false);
  const email = useRef<HTMLInputElement>(null);

  function release() {
    fanfare();
    const batch: Runner[] = Array.from({ length: 26 }, () => {
      const p = pick(PRODUCTS);
      const c = pick(p.colorways);
      return {
        id: rid++,
        kind: p.kind,
        body: c.body, accent: c.accent, extra: c.extra,
        top: rand(2, 90),
        size: rand(60, 190),
        dur: rand(2.4, 5),
        dir: Math.random() > .5 ? 1 : -1,
        delay: rand(0, 1.1),
      };
    });
    setRunners(batch);
    window.setTimeout(() => setRunners([]), 6400);
  }

  return (
    <footer id="footer" className="footer" data-palette="ink">
      <Marquee
        items={['NUNCA DEJES DE JUGAR', 'NO ES SOLO UN JUGUETE', 'IMAGINACIÓN ENORME', 'HECHO PARA ROMPERSE', 'JUGAR NO TIENE REGLAS']}
        speed={44}
        className="footer-mq"
      />

      <div className="footer-main scene">
        <div className="footer-hero">
          <Sticker rotate={-4} tone="c">EL FINAL. O EL PRINCIPIO.</Sticker>
          <SplitHeading text="NUNCA DEJES" className="t-mega" />
          <SplitHeading text="DE JUGAR." className="t-mega footer-h2" sticker />
        </div>

        <div className="footer-press">
          <ToyButton size="lg" tone="a" shape="blob" onClick={release} cursor="press">
            PÚLSAME
          </ToyButton>
          <span className="footer-press-hint label">VENGA. NO PASA NADA MALO.</span>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <span className="label footer-col-h">NEWSLETTER</span>
            <p className="footer-copy">Un email al mes. Novedades, fotos de la fábrica y nada de ruido.</p>
            <form
              className="footer-form"
              onSubmit={(e) => { e.preventDefault(); if (email.current?.value) { play('snap'); setSent(true); } }}
            >
              <input ref={email} type="email" required placeholder="tu@email.com" aria-label="Correo electrónico" />
              <button type="submit" data-cursor="press">{sent ? '¡DENTRO! ✓' : 'APÚNTAME'}</button>
            </form>
          </div>

          <div className="footer-col">
            <span className="label footer-col-h">TIENDA</span>
            <ul className="footer-list">
              {PRODUCTS.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <button type="button" onPointerEnter={() => play('click')} onClick={() => openSheet(p.id)} data-cursor="view">
                    {p.name} <i>{p.price} €</i>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <span className="label footer-col-h">LA MARCA</span>
            <ul className="footer-list">
              {['Por qué jugamos', 'La fábrica', 'Recambios', 'Seguridad y materiales', 'Puntos de venta'].map((t) => (
                <li key={t}><a href="#story" onPointerEnter={() => play('click')} data-cursor="play">{t}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <span className="label footer-col-h">ESCRÍBENOS</span>
            <a className="footer-mail" href="mailto:hola@wobbl.toys" data-cursor="play">hola@wobbl.toys</a>
            <p className="footer-copy">Carrer del Joc 12<br />08013 Barcelona</p>
            <div className="footer-social">
              {['IG', 'TT', 'YT', 'PT'].map((s) => (
                <a key={s} href="#footer" className="footer-soc" data-cursor="press" onPointerEnter={() => play('click')}>{s}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-mark">
            <span className="footer-logo">WOBBL<i>.</i></span>
            <span className="footer-legal">© {new Date().getFullYear()} WOBBL JUGUETES SL · Marca ficticia, hecha como patio de juegos.</span>
          </div>
          <ToyButton size="sm" tone="surface" onClick={onTop} cursor="press">VOLVER ARRIBA ↑</ToyButton>
        </div>
      </div>

      {/* the parade */}
      {runners.length > 0 && (
        <div className="parade">
          {runners.map((r) => (
            <span
              key={r.id}
              className={`parade-toy ${r.dir === 1 ? 'ltr' : 'rtl'}`}
              style={{ top: `${r.top}%`, width: r.size, animationDuration: `${r.dur}s`, animationDelay: `${r.delay}s` }}
              data-cursor="view"
              onClick={() => openSheet(r.kind)}
            >
              <Toy kind={r.kind} body={r.body} accent={r.accent} extra={r.extra} shadow={false} />
            </span>
          ))}
        </div>
      )}
    </footer>
  );
}
