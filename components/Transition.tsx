'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { gsap } from 'gsap';
import { play } from '@/lib/sound';

export interface TransitionHandle {
  /** Covers the screen, runs `mid`, then uncovers. ~900ms total. */
  cover: (mid: () => void) => void;
}

const COLS = 6;
const ROWS = 4;
const TILE_COLORS = ['#FFCE00', '#FF4433', '#2B2BFF', '#FF7FC4', '#58E3B4', '#B7F04A', '#7B3FE4', '#FF7A1A'];

/**
 * Page changes are never instant. A wall of interlocking puzzle tiles slams
 * across the screen, the content swaps behind it, then the tiles pull away.
 */
const Transition = forwardRef<TransitionHandle>(function Transition(_, ref) {
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  useImperativeHandle(ref, () => ({
    cover(mid: () => void) {
      if (busy.current) return;
      busy.current = true;
      const tiles = root.current?.querySelectorAll('.tr-tile');
      if (!tiles) { mid(); busy.current = false; return; }
      gsap.set(root.current, { pointerEvents: 'auto', visibility: 'visible' });
      play('whoosh');
      gsap.timeline({ onComplete: () => { busy.current = false; gsap.set(root.current, { pointerEvents: 'none', visibility: 'hidden' }); } })
        .fromTo(tiles,
          { yPercent: -120, scale: .8, rotate: -8 },
          { yPercent: 0, scale: 1, rotate: 0, duration: .42, ease: 'power3.out', stagger: { amount: .18, grid: [ROWS, COLS], from: 'start' } })
        .add(() => { mid(); play('snap'); })
        .to(tiles,
          { yPercent: 120, scale: .84, rotate: 8, duration: .44, ease: 'power3.in', stagger: { amount: .18, grid: [ROWS, COLS], from: 'end' } }, '+=.12');
    },
  }));

  return (
    <div ref={root} className="tr" aria-hidden>
      {Array.from({ length: COLS * ROWS }).map((_, i) => (
        <span key={i} className="tr-tile" style={{ background: TILE_COLORS[i % TILE_COLORS.length] }} />
      ))}
    </div>
  );
});

export default Transition;
