'use client';

import type { ToyKind } from '@/data/catalog';
import type { ModelProps } from './types';

import Racer from './Racer';
import Rocket from './Rocket';
import Plane from './Plane';
import Bus from './Bus';
import Train from './Train';
import Firetruck from './Firetruck';
import Tractor from './Tractor';
import Boat from './Boat';
import Heli from './Heli';
import Sub from './Sub';
import Digger from './Digger';
import Ufo from './Ufo';
import Bot from './Bot';
import Stack from './Stack';
import Spring from './Spring';
import Planet from './Planet';
import Noise from './Noise';
import Dino from './Dino';
import Bear from './Bear';
import Blob from './Blob';
import Unicorn from './Unicorn';
import Dragon from './Dragon';
import Dollhouse from './Dollhouse';
import Castle from './Castle';
import Kitchen from './Kitchen';
import Ferris from './Ferris';
import Lab from './Lab';
import Track from './Track';

/**
 * Registro de modelos 3D. Va por separado del registro de dibujos SVG
 * de `components/Toy.tsx` a propósito: mientras un juguete no tenga
 * modelo, la web sigue enseñando su vector y no se rompe nada.
 */
export const MODELS: Partial<Record<ToyKind, (p: ModelProps) => React.ReactElement>> = {
  racer: Racer,
  rocket: Rocket,
  plane: Plane,
  bus: Bus,
  train: Train,
  firetruck: Firetruck,
  tractor: Tractor,
  boat: Boat,
  heli: Heli,
  sub: Sub,
  digger: Digger,
  ufo: Ufo,
  bot: Bot,
  stack: Stack,
  spring: Spring,
  planet: Planet,
  noise: Noise,
  dino: Dino,
  bear: Bear,
  blob: Blob,
  unicorn: Unicorn,
  dragon: Dragon,
  dollhouse: Dollhouse,
  castle: Castle,
  kitchen: Kitchen,
  ferris: Ferris,
  lab: Lab,
  track: Track,
};

export const has3D = (kind: ToyKind) => kind in MODELS;
export type { ModelProps };
