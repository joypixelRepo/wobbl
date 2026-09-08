/**
 * Deliberately small physics: circles + axis-aligned boxes in a bounded room.
 * Semi-implicit Euler with positional correction — enough for bounce, inertia,
 * drag-throw and collisions, cheap enough to keep the whole page at 60fps.
 * The physics serves the design; it is not a simulation.
 */

export interface Body {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  r: number;          // radius (collision proxy for every shape)
  mass: number;
  angle: number;
  spin: number;
  restitution: number;
  asleep: boolean;
  held: boolean;
  kind: string;
  color: string;
  accent: string;
  scale: number;
}

export interface World {
  bodies: Body[];
  w: number; h: number;
  gravity: number;
  air: number;
  floorFriction: number;
}

let uid = 1;

export function makeBody(p: Partial<Body> & Pick<Body, 'x' | 'y' | 'r'>): Body {
  return {
    id: uid++,
    vx: 0, vy: 0,
    mass: p.r * p.r * 0.01,
    angle: Math.random() * Math.PI * 2,
    spin: 0,
    restitution: 0.62,
    asleep: false,
    held: false,
    kind: 'ball',
    color: '#FF4433',
    accent: '#FFF4E4',
    scale: 1,
    ...p,
  };
}

export function createWorld(w: number, h: number): World {
  return { bodies: [], w, h, gravity: 2400, air: 0.995, floorFriction: 0.86 };
}

const MAX_STEP = 1 / 60;

export function step(world: World, dtRaw: number) {
  // Clamp + subdivide so a stalled tab never explodes the simulation.
  const dt = Math.min(dtRaw, 1 / 20);
  const steps = Math.ceil(dt / MAX_STEP);
  const h = dt / steps;
  for (let s = 0; s < steps; s++) integrate(world, h);
}

function integrate(world: World, dt: number) {
  const { bodies, w, h, gravity } = world;

  for (const b of bodies) {
    if (b.held) { b.asleep = false; continue; }
    if (b.asleep) continue;

    b.vy += gravity * dt;
    b.vx *= world.air;
    b.vy *= world.air;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.angle += b.spin * dt;
    b.spin *= 0.985;

    // Walls
    if (b.x - b.r < 0) { b.x = b.r; b.vx = -b.vx * b.restitution; b.spin += b.vy * 0.004; }
    else if (b.x + b.r > w) { b.x = w - b.r; b.vx = -b.vx * b.restitution; b.spin -= b.vy * 0.004; }

    if (b.y + b.r > h) {
      b.y = h - b.r;
      b.vy = -b.vy * b.restitution;
      b.vx *= world.floorFriction;
      b.spin = b.vx * 0.03;
      if (Math.abs(b.vy) < 42 && Math.abs(b.vx) < 12) {
        b.vy = 0; b.vx *= 0.7;
        if (Math.abs(b.spin) < 0.25) { b.spin = 0; b.asleep = true; }
      }
    } else if (b.y - b.r < -h) {
      b.y = -h; b.vy = 0;
    }
  }

  // Pairwise collisions — body counts stay small (< 60), O(n²) is fine.
  for (let i = 0; i < bodies.length; i++) {
    const a = bodies[i];
    for (let j = i + 1; j < bodies.length; j++) {
      const b = bodies[j];
      if (a.asleep && b.asleep) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const min = a.r + b.r;
      const d2 = dx * dx + dy * dy;
      if (d2 >= min * min || d2 === 0) continue;

      const d = Math.sqrt(d2);
      const nx = dx / d;
      const ny = dy / d;
      const overlap = min - d;

      const ma = a.held ? 0 : 1 / a.mass;
      const mb = b.held ? 0 : 1 / b.mass;
      const inv = ma + mb;
      if (inv === 0) continue;

      a.x -= nx * overlap * (ma / inv);
      a.y -= ny * overlap * (ma / inv);
      b.x += nx * overlap * (mb / inv);
      b.y += ny * overlap * (mb / inv);

      const rvx = b.vx - a.vx;
      const rvy = b.vy - a.vy;
      const sep = rvx * nx + rvy * ny;
      if (sep > 0) continue;

      const e = Math.min(a.restitution, b.restitution);
      const impulse = (-(1 + e) * sep) / inv;
      if (!a.held) { a.vx -= impulse * nx * ma; a.vy -= impulse * ny * ma; a.asleep = false; }
      if (!b.held) { b.vx += impulse * nx * mb; b.vy += impulse * ny * mb; b.asleep = false; }
      a.spin -= impulse * 0.0009;
      b.spin += impulse * 0.0009;
    }
  }
}

export function bodyAt(world: World, x: number, y: number): Body | null {
  for (let i = world.bodies.length - 1; i >= 0; i--) {
    const b = world.bodies[i];
    const dx = x - b.x;
    const dy = y - b.y;
    if (dx * dx + dy * dy <= b.r * b.r * 1.25) return b;
  }
  return null;
}

export function wake(world: World, impulse = 900) {
  for (const b of world.bodies) {
    b.asleep = false;
    b.vx += (Math.random() - 0.5) * impulse;
    b.vy -= Math.random() * impulse;
    b.spin += (Math.random() - 0.5) * 8;
  }
}
