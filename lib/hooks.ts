'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Shared rAF loop — one ticker for the whole page instead of N timers. */
const tickers = new Set<(dt: number, t: number) => void>();
let rafId = 0;
let last = 0;

function loop(now: number) {
  const dt = last ? Math.min((now - last) / 1000, 0.1) : 0.016;
  last = now;
  tickers.forEach((fn) => fn(dt, now));
  rafId = tickers.size ? requestAnimationFrame(loop) : 0;
}

export function useRaf(fn: (dt: number, t: number) => void, active = true) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (!active) return;
    const cb = (dt: number, t: number) => ref.current(dt, t);
    tickers.add(cb);
    if (!rafId) { last = 0; rafId = requestAnimationFrame(loop); }
    return () => {
      tickers.delete(cb);
      if (!tickers.size && rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    };
  }, [active]);
}

/** Normalised pointer position (-1..1) plus raw client coords. */
export function usePointer() {
  const ref = useRef({ x: 0, y: 0, nx: 0, ny: 0, down: false, moved: false });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const p = ref.current;
      p.x = e.clientX; p.y = e.clientY;
      p.nx = (e.clientX / window.innerWidth) * 2 - 1;
      p.ny = (e.clientY / window.innerHeight) * 2 - 1;
      p.moved = true;
    };
    const down = () => { ref.current.down = true; };
    const up = () => { ref.current.down = false; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, []);
  return ref;
}

/** Fires once when the element first enters the viewport. */
export function useInView<T extends HTMLElement>(margin = '-15% 0px') {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, margin]);
  return [ref, seen] as const;
}

export function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    setTouch(window.matchMedia('(hover: none), (pointer: coarse)').matches);
  }, []);
  return touch;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Element size, kept current through resize. */
export function useSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect;
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

/** Force re-render helper for imperative sub-systems. */
export function useForceUpdate() {
  const [, set] = useState(0);
  return useCallback(() => set((n) => n + 1), []);
}
