'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

/**
 * One Lenis instance drives the page and feeds GSAP's ScrollTrigger, so every
 * scroll-driven animation on the site reads from the same clock. Scroll input
 * is never blocked — smoothing only reshapes it.
 */
export default function SmoothScroll({ paused }: { paused?: boolean }) {
  useEffect(() => {
    if (!registered) { gsap.registerPlugin(ScrollTrigger); registered = true; }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fast-flick detection: dispatched so toys can be thrown off their shelves.
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 40) {
        const v = Math.abs(window.scrollY - lastY) / dt;
        if (v > 3.4) window.dispatchEvent(new CustomEvent('wobbl:fastscroll', { detail: { v } }));
        lastY = window.scrollY;
        lastT = now;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      window.removeEventListener('scroll', onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  useEffect(() => {
    const l = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (!l) return;
    if (paused) l.stop(); else l.start();
  }, [paused]);

  return null;
}
