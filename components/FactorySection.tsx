'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Toy from '@/components/Toy';
import { SplitHeading, Sticker } from '@/components/ui';
import { HowTo, FirstHint } from '@/components/HowTo';
import { PRODUCTS, type Product } from '@/data/catalog';
import { play, fanfare } from '@/lib/sound';
import { useShop } from '@/lib/store';

const PAINTS = [
  { name: 'Tomate', hex: '#FF4433' },
  { name: 'Amarillo', hex: '#FFCE00' },
  { name: 'Eléctrico', hex: '#2B2BFF' },
  { name: 'Lima', hex: '#B7F04A' },
  { name: 'Chicle', hex: '#FF7FC4' },
  { name: 'Uva', hex: '#7B3FE4' },
  { name: 'Menta', hex: '#58E3B4' },
  { name: 'Naranja', hex: '#FF7A1A' },
];

interface Made {
  id: number;
  product: Product;
  body: string;
  accent: string;
  extra: string;
  paint: string;
}
let madeId = 1;

type Stage = 'off' | 'ready' | 'feeding' | 'pressing' | 'painting' | 'out';

const STAGE_TEXT: Record<Stage, string> = {
  off: 'HORNO FRÍO',
  ready: 'HORNO A 1.100°',
  feeding: 'SACANDO LA GOTA…',
  pressing: 'CERRANDO EL MOLDE…',
  painting: 'APLICANDO COLOR…',
  out: '¡AL RECOCIDO!',
};

export default function FactorySection() {
  const { add } = useShop();
  const [power, setPower] = useState(false);
  const [mould, setMould] = useState(0);
  const [paint, setPaint] = useState(0);
  const [stage, setStage] = useState<Stage>('off');
  const [crate, setCrate] = useState<Made[]>([]);
  const [stamped, setStamped] = useState(false);
  const [sparks, setSparks] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [touched, setTouched] = useState(false);

  const blank = useRef<HTMLDivElement>(null);
  const press = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const crateRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const product = PRODUCTS[mould % PRODUCTS.length];
  const cw = product.colorways[0];
  const paintColor = PAINTS[paint % PAINTS.length];
  const running = stage === 'feeding' || stage === 'pressing' || stage === 'painting' || stage === 'out';

  /* Which step should be glowing right now. */
  const step = !power ? 0 : !touched ? 1 : running ? 3 : 3;
  const doneSteps = [
    ...(power ? [0] : []),
    ...(touched ? [1, 2] : []),
    ...(crate.length ? [3] : []),
  ];

  const togglePower = () => {
    const next = !power;
    setPower(next);
    setStage(next ? 'ready' : 'off');
    play(next ? 'snap' : 'clack');
  };

  const cycleMould = (dir: number) => {
    if (running) return;
    setMould((m) => (m + dir + PRODUCTS.length) % PRODUCTS.length);
    setTouched(true);
    play('click');
  };

  const pickPaint = (i: number) => {
    if (running) return;
    setPaint(i);
    setTouched(true);
    play('pop');
  };

  const run = useCallback(() => {
    if (running) return;
    if (!power) {
      // Say why nothing happened instead of silently ignoring the click.
      setNudge(true);
      play('clack');
      window.setTimeout(() => setNudge(false), 1400);
      return;
    }
    setStamped(false);
    setStage('feeding');

    // On a phone the controls sit above the machine — bring the belt into view
    // so you actually watch the thing you just started.
    const el = line.current;
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * .72 || r.bottom < window.innerHeight * .28) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    const t = gsap.timeline({
      onComplete: () => {
        setStage('ready');
        setCrate((c) => [
          ...c.slice(-7),
          { id: madeId++, product, body: paintColor.hex, accent: cw.accent, extra: cw.extra, paint: paintColor.name },
        ]);
        fanfare();
      },
    });
    tl.current = t;

    t.set(blank.current, { xPercent: 0, yPercent: 0, opacity: 1, scale: 1, rotate: 0 })
      // 1 — the blank rides the belt to the press
      .to(blank.current, { xPercent: 210, duration: .9, ease: 'none' })
      .add(() => { setStage('pressing'); play('clack'); })
      // 2 — the press slams
      .to(press.current, { y: 74, duration: .17, ease: 'power3.in' })
      .add(() => { play('thud'); setStamped(true); setSparks(true); })
      .to(blank.current, { scaleY: .42, scaleX: 1.3, duration: .12 }, '<')
      .to(press.current, { y: 0, duration: .34, ease: 'back.out(2)' })
      .to(blank.current, { scaleY: 1, scaleX: 1, duration: .34, ease: 'elastic.out(1,.42)' }, '<')
      .add(() => { setSparks(false); setStage('painting'); })
      // 3 — through the paint booth
      .to(blank.current, { xPercent: 430, duration: .8, ease: 'none' })
      .add(() => { play('pop'); setStage('out'); }, '-=.3')
      // 4 — off the end, into the crate
      .to(blank.current, { xPercent: 520, yPercent: 120, rotate: 190, duration: .46, ease: 'power2.in' })
      .to(blank.current, { opacity: 0, duration: .1 });
  }, [power, running, product, cw, paintColor]);

  useEffect(() => () => { tl.current?.kill(); }, []);

  return (
    <section id="factory" className="scene factory" data-palette="ink">
      <div className="fac-head">
        <div className="fac-head-copy">
          <Sticker rotate={-3} tone="c">SECCIÓN 04 — EL HORNO</Sticker>
          <SplitHeading text="LA FÁBRICA" className="t-huge" />
          <SplitHeading text="DE CRISTAL." className="t-huge fac-h2" />
        </div>
        <div className="fac-head-side">
          <p className="body-copy fac-copy">
            Horno de verdad: enciéndelo, elige molde y color, y dale al botón verde.
            La gota sale al rojo, el molde la cierra, el color entra en caliente y la pieza
            se va al recocido. Luego puedes guardarla en tu caja.
          </p>
          <HowTo
            steps={['Enciende el horno', 'Elige molde', 'Elige color', 'Sopla']}
            active={step}
            done={doneSteps}
          />
        </div>
      </div>

      <div className="fac-machine">
        {/* ---------------- CONTROL PANEL ---------------- */}
        <div className="fac-panel">
          <div className="fac-ctrl">
            <span className="fac-ctrl-h"><b>1</b> ENCENDIDO</span>
            <button
              className={`fac-switch ${power ? 'on' : ''} ${nudge ? 'nudge' : ''}`}
              onClick={togglePower}
              data-cursor="press"
              aria-pressed={power}
              type="button"
            >
              <span className="fac-switch-track"><span className="fac-switch-knob" /></span>
              <em>{power ? 'ENCENDIDA' : 'APAGADA'}</em>
            </button>
            <FirstHint show={!power} label="Empieza por aquí" className="fh-power" />
          </div>

          <div className="fac-ctrl">
            <span className="fac-ctrl-h"><b>2</b> MOLDE</span>
            <div className="fac-mould">
              <button onClick={() => cycleMould(-1)} data-cursor="press" type="button" aria-label="Molde anterior">‹</button>
              <span className="fac-mould-view" style={{ background: cw.extra }}>
                <Toy kind={product.kind} body={cw.body} accent={cw.accent} extra={cw.extra} shadow={false} />
              </span>
              <button onClick={() => cycleMould(1)} data-cursor="press" type="button" aria-label="Molde siguiente">›</button>
            </div>
            <em className="fac-ctrl-val">{product.name}</em>
          </div>

          <div className="fac-ctrl">
            <span className="fac-ctrl-h"><b>3</b> COLOR</span>
            <div className="fac-paints">
              {PAINTS.map((p, i) => (
                <button
                  key={p.hex}
                  className={`fac-pot ${i === paint ? 'on' : ''}`}
                  style={{ ['--pot' as string]: p.hex }}
                  onClick={() => pickPaint(i)}
                  data-cursor="press"
                  title={p.name}
                  aria-label={`Color ${p.name}`}
                  type="button"
                />
              ))}
            </div>
            <em className="fac-ctrl-val">{paintColor.name}</em>
          </div>

          <div className="fac-ctrl">
            <span className="fac-ctrl-h"><b>4</b> FABRICAR</span>
            <button
              className={`fac-go ${running ? 'busy' : ''} ${!power ? 'dead' : 'live'}`}
              onClick={run}
              data-cursor="press"
              type="button"
            >
              {running ? 'SOPLANDO…' : 'SOPLAR UNA'}
            </button>
            {nudge && <span className="fac-nudge">Primero enciende el horno ↑</span>}
          </div>
        </div>

        {/* ---------------- THE LINE ---------------- */}
        <div className={`fac-line ${power ? 'live' : ''}`} ref={line}>
          <span className={`fac-status s-${stage}`}>
            <i /> {STAGE_TEXT[stage]}
          </span>

          <div className={`fac-hopper ${stage === 'feeding' ? 'hot' : ''}`} aria-hidden>
            <span className="fac-hopper-mouth" />
            <span className="fac-hopper-chute" />
            <span className="fac-hopper-pellets">
              {[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ ['--d' as string]: `${i * .3}s` }} />)}
            </span>
            <span className="fac-hopper-label">1 · MATERIAL</span>
          </div>

          <div className={`fac-press ${stage === 'pressing' ? 'hot' : ''}`} aria-hidden>
            <span className="fac-press-post fpp-l" />
            <span className="fac-press-post fpp-r" />
            <span className="fac-press-beam"><i /><i /><i /></span>
            <div className="fac-press-head" ref={press}>
              <span className="fac-press-face">PRENSA</span>
              <span className="fac-press-teeth" />
            </div>
            {sparks && (
              <span className="fac-sparks">
                {Array.from({ length: 9 }).map((_, i) => <i key={i} style={{ ['--a' as string]: `${i * 40}deg` }} />)}
              </span>
            )}
            <span className="fac-stage-label">2 · PRENSA</span>
          </div>

          <div
            className={`fac-booth ${stage === 'painting' ? 'hot' : ''}`}
            style={{ ['--paint' as string]: paintColor.hex }}
            aria-hidden
          >
            <span className="fac-booth-roof" />
            <span className="fac-booth-post bp-l" />
            <span className="fac-booth-post bp-r" />
            <span className="fac-booth-nozzle bn-1" />
            <span className="fac-booth-nozzle bn-2" />
            <span className="fac-booth-nozzle bn-3" />
            <span className="fac-booth-mist" />
            <span className="fac-booth-label">3 · COLOR</span>
          </div>

          <div className="fac-blank" ref={blank} aria-hidden>
            {stamped
              ? <Toy kind={product.kind} body={paintColor.hex} accent={cw.accent} extra={cw.extra} shadow={false} />
              : <span className="fac-lump" />}
          </div>

          <div className="fac-belt" aria-hidden>
            <span className="fac-belt-surface" />
            <span className="fac-roller r1" /><span className="fac-roller r2" />
            <span className="fac-roller r3" /><span className="fac-roller r4" />
          </div>

          <div className={`fac-bot ${running ? 'busy' : ''}`} aria-hidden>
            <Toy kind="bot" body="#FFCE00" accent="#FF4433" extra="#2B2BFF" look={{ x: running ? .8 : 0, y: 0 }} shadow={false} />
          </div>
        </div>

        {/* ---------------- OUTPUT ---------------- */}
        <div className="fac-crate" ref={crateRef}>
          <span className="fac-crate-label">SALIDA</span>
          <div className="fac-crate-inner">
            {crate.length === 0 && <span className="fac-crate-empty">TODAVÍA<br />NADA</span>}
            {crate.map((m) => (
              <button
                key={m.id}
                className="fac-made"
                title={`${m.product.name} en ${m.paint} · añadir a mi caja`}
                data-cursor="grab"
                type="button"
                onClick={(e) => {
                  add(m.product, 0, (e.currentTarget as HTMLElement).getBoundingClientRect());
                }}
              >
                <Toy kind={m.product.kind} body={m.body} accent={m.accent} extra={m.extra} shadow={false} />
                <span className="fac-made-add">+</span>
              </button>
            ))}
          </div>
          <span className="fac-crate-count">
            {crate.length === 0 ? 'FABRICA UNO' : `${crate.length} FABRICADO${crate.length > 1 ? 'S' : ''} · TÓCALO PARA GUARDARLO`}
          </span>
        </div>
      </div>
    </section>
  );
}
