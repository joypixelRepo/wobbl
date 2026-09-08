'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SmoothScroll from '@/components/SmoothScroll';
import Preloader from '@/components/Preloader';
import Cursor from '@/components/Cursor';
import Hud from '@/components/Hud';
import ToyBoxMenu from '@/components/ToyBoxMenu';
import ToyBoxCart from '@/components/ToyBoxCart';
import Transition, { type TransitionHandle } from '@/components/Transition';
import EggFriend from '@/components/EggFriend';

import Hero from '@/components/Hero';
import BuildSection from '@/components/BuildSection';
import Statement from '@/components/Statement';
import CollectionSection from '@/components/CollectionSection';
import ColorsSection from '@/components/ColorsSection';
import FactorySection from '@/components/FactorySection';
import PlaygroundSection from '@/components/PlaygroundSection';
import CharactersSection from '@/components/CharactersSection';
import StorySection from '@/components/StorySection';
import ShopSection from '@/components/ShopSection';
import Footer from '@/components/Footer';
import { Marquee } from '@/components/ui';

import { ShopProvider } from '@/lib/store';
import { applyPalette, byId, type Palette } from '@/lib/theme';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);
  const [egg, setEgg] = useState(0);
  const transition = useRef<TransitionHandle>(null);
  const manualPalette = useRef<string | null>(null);

  /* ---- palette follows the scroll, world by world ---- */
  useEffect(() => {
    if (loading) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('[data-palette]').forEach((el) => {
        const id = el.dataset.palette!;
        const set = () => {
          // The colour lab hands control to the visitor; don't fight them.
          if (el.id === 'colors' && manualPalette.current) return;
          applyPalette(byId(id));
        };
        ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', onEnter: set, onEnterBack: set });
      });
      ScrollTrigger.refresh();
    });
    return () => ctx.revert();
  }, [loading]);

  const goto = useCallback((id: string) => {
    setMenu(false);
    transition.current?.cover(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(el, { offset: -10, immediate: true });
      else el.scrollIntoView();
    });
  }, []);

  const toTop = useCallback(() => {
    transition.current?.cover(() => {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    });
  }, []);

  const onColorPick = useCallback((p: Palette) => { manualPalette.current = p.id; }, []);

  return (
    <ShopProvider>
      {loading && <Preloader onDone={() => setLoading(false)} />}

      <SmoothScroll paused={loading || menu} />
      <Cursor />

      <Hud menuOpen={menu} onMenu={() => setMenu((m) => !m)} onLogoEgg={() => setEgg((n) => n + 1)} />
      <ToyBoxMenu open={menu} onClose={() => setMenu(false)} onNavigate={goto} />
      <ToyBoxCart />
      <Transition ref={transition} />
      <EggFriend trigger={egg} />

      <a className="skip-link" href="#collection">SALTAR A LOS JUGUETES</a>

      <main id="main" className="page" aria-hidden={loading}>
        <div data-palette="cream">
          <Hero onExplore={() => goto('collection')} />
        </div>

        <Marquee
          items={['NO ES SOLO UN JUGUETE', 'HECHO PARA ROMPERSE', 'Y VOLVER A MONTARSE', 'FABRICADO EN BARCELONA']}
          speed={38}
          className="ribbon ribbon-a"
        />

        <BuildSection />

        <Statement
          id="statement-1"
          line1="IMAGINACIÓN"
          line2="ENORME."
          copy="Un juguete tiene que sobrevivir a que se sienten encima, a bajar las escaleras por su cuenta y a pasar una semana en el jardín. Todo lo que hacemos está pensado para desmontarse y volver a montarse. Esa es, básicamente, la gracia."
          kind="planet"
          palette="grape"
          body="#B7F04A" accent="#FFCE00" extra="#FF7FC4"
        />

        <CollectionSection />

        <Marquee
          items={['ELIGE UN MUNDO', 'CAMBIA EL COLOR', 'CÁMBIALO TODO']}
          speed={30}
          reverse
          className="ribbon ribbon-b"
          separator="●"
        />

        <ColorsSection onPick={onColorPick} />

        <FactorySection />

        <PlaygroundSection />

        <CharactersSection />

        <StorySection />

        <Statement
          id="statement-2"
          line1="VAMOS"
          line2="A JUGAR."
          copy="Esa es toda la filosofía. No hay un segundo párrafo."
          kind="spring"
          palette="tomato"
          body="#FFCE00" accent="#2B2BFF" extra="#FFF4E4"
        />

        <ShopSection />

        <Footer onTop={toTop} />
      </main>
    </ShopProvider>
  );
}
