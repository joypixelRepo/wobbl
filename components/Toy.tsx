'use client';

import { useId } from 'react';
import type { ToyKind } from '@/data/catalog';
import { Materials, type SubProps } from '@/components/toys/kit';
import { Bot, Spring, Stack, Blob, Racer, Planet, Noise } from '@/components/toys/classics';
import { Plane, Rocket, Digger, Train, Ufo, Firetruck, Tractor, Boat, Heli, Sub, Bus } from '@/components/toys/vehicles';
import { Dino, Unicorn, Dragon, Bear } from '@/components/toys/creatures';
import { Dollhouse, Castle, Kitchen, Ferris, Lab, Track } from '@/components/toys/worlds';

export interface ToyProps {
  kind: ToyKind;
  body: string;
  accent: string;
  extra: string;
  /** -1..1, tilts the toy and steers the eyes toward the pointer */
  look?: { x: number; y: number };
  /** continuous rotation for wheels / propellers / spinners, in degrees */
  spin?: number;
  className?: string;
  style?: React.CSSProperties;
  /** part id -> click handler, for the interactive hero toy */
  onPart?: (part: string) => void;
  /** parts currently "reacting" (lit, ejected, spinning) */
  active?: Record<string, number>;
  shadow?: boolean;
}

/* ------------------------------------------------------------------ *
 * One drawing per product. They all sit in the same 200×200 box, all
 * stand on the same ground shadow and all share the material kit, so
 * a rocket and a dollhouse still look like they came out of the same
 * factory. Adding a toy is: draw it, register it here, sell it from
 * data/catalog.ts.
 * ------------------------------------------------------------------ */
const TOYS: Record<ToyKind, (p: SubProps) => React.ReactElement> = {
  // clásicos
  bot: Bot, spring: Spring, stack: Stack, blob: Blob, racer: Racer, planet: Planet, noise: Noise,
  // vehículos
  plane: Plane, rocket: Rocket, digger: Digger, train: Train, ufo: Ufo,
  firetruck: Firetruck, tractor: Tractor, boat: Boat, heli: Heli, sub: Sub, bus: Bus,
  // criaturas
  dino: Dino, unicorn: Unicorn, dragon: Dragon, bear: Bear,
  // mundos
  dollhouse: Dollhouse, castle: Castle, kitchen: Kitchen, ferris: Ferris, lab: Lab, track: Track,
};

export default function Toy({
  kind, body, accent, extra,
  look = { x: 0, y: 0 },
  spin = 0,
  className, style, onPart, active = {}, shadow = true,
}: ToyProps) {
  const uid = useId().replace(/[:]/g, '');
  const part = (id: string) =>
    onPart
      ? { onPointerDown: (e: React.PointerEvent) => { e.stopPropagation(); onPart(id); }, style: { cursor: 'none' as const } }
      : {};
  const A = (id: string) => active[id] ?? 0;
  const Shape = TOYS[kind] ?? TOYS.bot;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ overflow: 'visible', display: 'block', ...style }}
      aria-hidden="true"
    >
      <Materials uid={uid} body={body} accent={accent} extra={extra} />
      {shadow && (
        <ellipse cx="100" cy="184" rx={54 - look.y * 4} ry="11" fill={`url(#${uid}-ground)`} />
      )}
      <Shape uid={uid} body={body} accent={accent} extra={extra} look={look} part={part} A={A} spin={spin} />
    </svg>
  );
}
