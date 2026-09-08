'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PRODUCTS, type Product } from '@/data/catalog';
import { play, fanfare, setSound, isSoundOn, restoreSoundPreference } from '@/lib/sound';

export interface CartLine {
  key: string;
  product: Product;
  colorway: number;
  qty: number;
}

interface Ctx {
  lines: CartLine[];
  count: number;
  total: number;
  add: (p: Product, colorway: number, from?: DOMRect | null) => void;
  remove: (key: string) => void;
  setQty: (key: string, q: number) => void;
  clear: () => void;

  boxOpen: boolean;
  setBoxOpen: (v: boolean) => void;

  soundOn: boolean;
  toggleSound: () => void;
  sfx: typeof play;

  chaos: boolean;
  startChaos: () => void;

  /** flying toy animations from shelf -> toy box */
  flights: Flight[];
}

export interface Flight {
  id: number;
  product: Product;
  colorway: number;
  from: { x: number; y: number; size: number };
}

const CartCtx = createContext<Ctx | null>(null);

export function useShop() {
  const c = useContext(CartCtx);
  if (!c) throw new Error('useShop must be used inside <ShopProvider>');
  return c;
}

let flightId = 1;

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [boxOpen, setBoxOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [chaos, setChaos] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const chaosTimer = useRef<number | null>(null);

  useEffect(() => {
    const pref = restoreSoundPreference();
    if (pref) { setSound(true); setSoundOn(true); }
    try {
      const raw = localStorage.getItem('wobbl:cart');
      if (raw) {
        const saved: { id: string; colorway: number; qty: number }[] = JSON.parse(raw);
        setLines(
          saved
            .map((s) => {
              const product = PRODUCTS.find((p) => p.id === s.id);
              return product ? { key: `${s.id}:${s.colorway}`, product, colorway: s.colorway, qty: s.qty } : null;
            })
            .filter(Boolean) as CartLine[],
        );
      }
    } catch { /* storage unavailable */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'wobbl:cart',
        JSON.stringify(lines.map((l) => ({ id: l.product.id, colorway: l.colorway, qty: l.qty }))),
      );
    } catch { /* storage unavailable */ }
  }, [lines]);

  const add = useCallback((product: Product, colorway: number, from?: DOMRect | null) => {
    const key = `${product.id}:${colorway}`;
    setLines((prev) => {
      const hit = prev.find((l) => l.key === key);
      if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { key, product, colorway, qty: 1 }];
    });
    play('pop');
    if (from) {
      const f: Flight = {
        id: flightId++,
        product,
        colorway,
        from: { x: from.left + from.width / 2, y: from.top + from.height / 2, size: Math.min(from.width, 220) },
      };
      setFlights((p) => [...p, f]);
      window.setTimeout(() => {
        setFlights((p) => p.filter((x) => x.id !== f.id));
        play('thud');
      }, 900);
    }
  }, []);

  const remove = useCallback((key: string) => {
    setLines((p) => p.filter((l) => l.key !== key));
    play('clack');
  }, []);

  const setQty = useCallback((key: string, q: number) => {
    setLines((p) => (q <= 0 ? p.filter((l) => l.key !== key) : p.map((l) => (l.key === key ? { ...l, qty: q } : l))));
    play('click');
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const toggleSound = useCallback(() => {
    const next = !isSoundOn();
    setSound(next);
    setSoundOn(next);
    if (next) play('chime');
  }, []);

  const startChaos = useCallback(() => {
    setChaos(true);
    fanfare();
    document.body.classList.add('chaos');
    if (chaosTimer.current) window.clearTimeout(chaosTimer.current);
    chaosTimer.current = window.setTimeout(() => {
      setChaos(false);
      document.body.classList.remove('chaos');
    }, 6000);
  }, []);

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const total = useMemo(() => lines.reduce((n, l) => n + l.qty * l.product.price, 0), [lines]);

  const value: Ctx = {
    lines, count, total, add, remove, setQty, clear,
    boxOpen, setBoxOpen,
    soundOn, toggleSound, sfx: play,
    chaos, startChaos,
    flights,
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
