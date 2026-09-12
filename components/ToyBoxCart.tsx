'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Toy from '@/components/Toy';
import { useShop } from '@/lib/store';
import { play, fanfare } from '@/lib/sound';

export default function ToyBoxCart() {
  const { lines, total, count, boxOpen, setBoxOpen, remove, setQty, clear, flights } = useShop();
  const panel = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState(false);

  // GSAP reads transforms back from the computed matrix, where a percentage
  // translate has already been resolved to pixels — so the resting offset has
  // to be declared in GSAP's own units before the first tween runs.
  useEffect(() => {
    if (panel.current) gsap.set(panel.current, { x: 0, xPercent: 106 });
  }, []);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    gsap.to(el, {
      xPercent: boxOpen ? 0 : 106,
      duration: .62,
      ease: boxOpen ? 'power4.out' : 'power3.in',
    });
    if (boxOpen) {
      gsap.fromTo('.tbc-lid', { rotateX: 0 }, { rotateX: -74, duration: .5, ease: 'back.out(1.7)', delay: .12 });
      gsap.fromTo('.tbc-line', { y: -120, opacity: 0, rotate: -10 },
        { y: 0, opacity: 1, rotate: 0, duration: .6, ease: 'bounce.out', stagger: .08, delay: .2 });
    }
  }, [boxOpen, lines.length]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setBoxOpen(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [setBoxOpen]);

  function checkout() {
    if (!count) return;
    fanfare();
    setChecked(true);
    window.setTimeout(() => { setChecked(false); clear(); setBoxOpen(false); }, 2600);
  }

  return (
    <>
      {/* toys flying from the shelf into the box */}
      <div className="flights" aria-hidden>
        {flights.map((f) => (
          <FlyingToy key={f.id} flight={f} />
        ))}
      </div>

      <div className={`tbc-scrim ${boxOpen ? 'on' : ''}`} onClick={() => setBoxOpen(false)} aria-hidden />

      <aside ref={panel} className="tbc" aria-label="Tu caja de juguetes" aria-hidden={!boxOpen}>
        <div className="tbc-lid"><span>TU CAJA</span></div>

        <div className="tbc-head">
          <h3 className="t-mid">TU<br />CAJA</h3>
          <button className="tbc-x" onClick={() => { play('click'); setBoxOpen(false); }} data-cursor="press" type="button" aria-label="Cerrar">✕</button>
        </div>

        <div className="tbc-body">
          {lines.length === 0 && (
            <div className="tbc-empty">
              <div className="tbc-empty-art">
                <Toy kind="blob" body="var(--a)" accent="var(--fg)" extra="var(--c)" look={{ x: 0, y: .2 }} />
              </div>
              <p className="label">LA CAJA ESTÁ VACÍA</p>
              <p className="body-copy" style={{ fontSize: '.95rem' }}>
                Aquí dentro todavía no suena nada. Ve a coger algo de la estantería.
              </p>
              <button className="tbc-go" onClick={() => { setBoxOpen(false); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }} data-cursor="play" type="button">
                LLÉVAME A LA ESTANTERÍA
              </button>
            </div>
          )}

          {lines.map((l) => {
            const cw = l.product.colorways[l.colorway];
            return (
              <div className="tbc-line" key={l.key}>
                {/* Fondo blanco, igual que la ficha: el color lo pone el juguete. */}
                <div className="tbc-thumb" style={{ background: '#ffffff' }}>
                  <Toy kind={l.product.kind} body={cw.body} accent={cw.accent} extra={cw.extra} shadow={false} />
                </div>
                <div className="tbc-info">
                  <strong>{l.product.name}</strong>
                  <span className="tbc-cw">{cw.name} · {l.product.size}</span>
                  <div className="tbc-qty">
                    <button onClick={() => setQty(l.key, l.qty - 1)} data-cursor="press" type="button" aria-label="Uno menos">–</button>
                    <b>{l.qty}</b>
                    <button onClick={() => setQty(l.key, l.qty + 1)} data-cursor="press" type="button" aria-label="Uno más">+</button>
                  </div>
                </div>
                <div className="tbc-price">
                  <span>{l.product.price * l.qty} €</span>
                  <button onClick={() => remove(l.key)} data-cursor="press" type="button">QUITAR</button>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="tbc-foot">
          <div className="tbc-total">
            <span className="label">TOTAL</span>
            <strong>{total} €</strong>
          </div>
          <p className="tbc-note">Envío gratis desde 70 € · 30 días para devolver sin preguntas</p>
          <button className={`tbc-checkout ${checked ? 'done' : ''}`} onClick={checkout} disabled={!count} data-cursor="press" type="button">
            {checked ? '¡EMPAQUETADO! 🎉' : `PAGAR · ${total} €`}
          </button>
        </footer>
      </aside>
    </>
  );
}

function FlyingToy({ flight }: { flight: import('@/lib/store').Flight }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Aim at the real toy-box button, wherever the layout has put it, so the
    // toy visibly lands in the cart instead of drifting off the edge.
    const btn = document.querySelector<HTMLElement>('.hud-cart .hud-cart-box')
      ?? document.querySelector<HTMLElement>('.hud-cart');
    const r = btn?.getBoundingClientRect();
    const targetX = r ? r.left + r.width / 2 : window.innerWidth - 110;
    const targetY = r ? r.top + r.height / 2 : 44;

    const peak = Math.min(flight.from.y, targetY) - 150;

    gsap.timeline({
      onComplete: () => {
        // the box takes the hit
        const cart = document.querySelector('.hud-cart');
        if (cart) {
          gsap.fromTo(cart,
            { scale: 1 },
            { scale: 1.24, duration: .16, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' });
        }
      },
    })
      .set(el, { x: flight.from.x, y: flight.from.y, scale: 1, opacity: 1, rotate: 0 })
      // one clean arc: up, across, down into the box
      .to(el, { x: targetX, duration: .85, ease: 'power1.inOut' }, 0)
      .to(el, { y: peak, duration: .34, ease: 'power2.out' }, 0)
      .to(el, { y: targetY, duration: .51, ease: 'power2.in' }, .34)
      .to(el, { scale: .12, rotate: 400, duration: .85, ease: 'power2.in' }, 0)
      .to(el, { opacity: 0, duration: .1 }, .8);
  }, [flight]);
  const cw = flight.product.colorways[flight.colorway];
  return (
    <div ref={ref} className="flight" style={{ width: flight.from.size, height: flight.from.size }}>
      <Toy kind={flight.product.kind} body={cw.body} accent={cw.accent} extra={cw.extra} shadow={false} />
    </div>
  );
}
