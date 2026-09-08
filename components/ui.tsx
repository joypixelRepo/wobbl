'use client';

import React, { useRef, useState } from 'react';
import { play } from '@/lib/sound';

/* ------------------------------------------------------------------ *
 * ToyButton — a moulded plastic part, not a rectangle. It sits on a
 * hard shadow, depresses on press and squashes if you hold it down.
 * ------------------------------------------------------------------ */
export function ToyButton({
  children, onClick, tone = 'a', size = 'md', shape = 'pill', className = '', cursor = 'press', title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: 'a' | 'b' | 'c' | 'd' | 'fg' | 'surface';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'pill' | 'chunk' | 'blob';
  className?: string;
  cursor?: string;
  title?: string;
}) {
  const [held, setHeld] = useState(false);
  return (
    <button
      type="button"
      title={title}
      className={`toy-btn tb-${tone} tbs-${size} tbsh-${shape} ${held ? 'held' : ''} ${className}`}
      data-cursor={cursor}
      onPointerDown={() => { setHeld(true); play('click'); }}
      onPointerUp={() => setHeld(false)}
      onPointerLeave={() => setHeld(false)}
      onPointerEnter={() => play('click')}
      onClick={onClick}
    >
      <span className="toy-btn-face">{children}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * SplitHeading — every letter is its own toy: it lifts and rotates
 * under the pointer, and springs when clicked.
 * ------------------------------------------------------------------ */
export function SplitHeading({
  text, className = '', tag: Tag = 'h2', sticker = false, onLetter,
}: {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3';
  sticker?: boolean;
  onLetter?: (i: number) => void;
}) {
  const words = text.split(' ');
  let idx = -1;
  return (
    <Tag className={`split ${className}`} data-cursor="play">
      {words.map((w, wi) => (
        <span className="split-word" key={`${w}-${wi}`}>
          {Array.from(w).map((ch) => {
            idx += 1;
            const i = idx;
            return (
              <span
                key={i}
                className={`split-ch ${sticker ? 'sticker-text' : ''}`}
                style={{ ['--i' as string]: i }}
                onPointerEnter={() => { if (Math.random() > .6) play('click'); }}
                onPointerDown={() => { play('boing'); onLetter?.(i); }}
              >
                {ch}
              </span>
            );
          })}
          {wi < words.length - 1 && <span className="split-space"> </span>}
        </span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 * Marquee — an infinite conveyor of words, direction and speed given.
 * ------------------------------------------------------------------ */
export function Marquee({
  items, speed = 34, reverse = false, className = '', separator = '✳',
}: { items: string[]; speed?: number; reverse?: boolean; className?: string; separator?: string }) {
  const row = (
    <span className="mq-row">
      {items.map((t, i) => (
        <React.Fragment key={i}>
          <span className="mq-item">{t}</span>
          <span className="mq-sep" aria-hidden>{separator}</span>
        </React.Fragment>
      ))}
    </span>
  );
  return (
    <div className={`mq ${className}`} aria-hidden>
      <div className="mq-track" style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}>
        {row}{row}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sticker — a peel-off label. It lifts off the surface on hover.
 * ------------------------------------------------------------------ */
export function Sticker({
  children, rotate = -4, tone = 'c', className = '',
}: { children: React.ReactNode; rotate?: number; tone?: string; className?: string }) {
  return (
    <span className={`sticker ${className}`} style={{ ['--rot' as string]: `${rotate}deg`, ['--tone' as string]: `var(--${tone})` }}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Magnetic — the element leans toward the pointer, like it is on a
 * spring. Used sparingly, on things that invite a press.
 * ------------------------------------------------------------------ */
export function Magnetic({
  children, strength = 0.34, className = '',
}: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      className={`magnetic ${className}`}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      }}
      onPointerLeave={() => {
        const el = ref.current;
        if (el) el.style.transform = 'translate(0,0)';
      }}
    >
      {children}
    </span>
  );
}
