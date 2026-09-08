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
  /** consecutive near-motionless steps, used to fall asleep off the floor too */
  still: number;
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
    still: 0,
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

/**
 * Hard ceiling on angular velocity, in rad/s. In a narrow box (a phone) bodies
 * collide many times per frame and every contact used to add spin with nothing
 * to bound it, so they ended up whirling on the spot. One turn a second is as
 * fast as a toy should ever look.
 */
const MAX_SPIN = 6.5;
const spinClamp = (v: number) => (v > MAX_SPIN ? MAX_SPIN : v < -MAX_SPIN ? -MAX_SPIN : v);

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
    if (b.held) { b.asleep = false; b.still = 0; continue; }
    if (b.asleep) continue;

    b.vy += gravity * dt;
    b.vx *= world.air;
    b.vy *= world.air;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.angle += b.spin * dt;
    b.spin *= 0.955;
    b.spin = spinClamp(b.spin);

    // Under these thresholds a body moves less than a pixel per frame; after
    // half a second of that it is at rest, wherever it is resting.
    if (Math.abs(b.vx) < 14 && Math.abs(b.vy) < 58 && Math.abs(b.spin) < 0.3) {
      if (++b.still > 30) { b.vx = 0; b.vy = 0; b.spin = 0; b.asleep = true; }
    } else {
      b.still = 0;
    }

    // Walls
    if (b.x - b.r < 0) { b.x = b.r; b.vx = -b.vx * b.restitution; b.spin = spinClamp(b.spin + b.vy * 0.0012); }
    else if (b.x + b.r > w) { b.x = w - b.r; b.vx = -b.vx * b.restitution; b.spin = spinClamp(b.spin - b.vy * 0.0012); }

    if (b.y + b.r > h) {
      b.y = h - b.r;
      b.vy = -b.vy * b.restitution;
      b.vx *= world.floorFriction;
      // Rolling contact: the surface speed of the body matches how fast it travels.
      b.spin = spinClamp(b.vx / b.r);
      if (Math.abs(b.vy) < 42 && Math.abs(b.vx) < 12) {
        b.vy = 0; b.vx *= 0.7;
        if (Math.abs(b.spin) < 0.25) { b.spin = 0; b.asleep = true; }
      }
    } else if (b.y - b.r < -h) {
      b.y = -h; b.vy = 0;
    }
  }

  // Pairwise collisions — body counts stay small (< 30), O(n²) is fine.
  // Two passes: a single projection cannot untangle a dense pile, and the
  // leftover overlap pops bodies out again on the next frame.
  for (let pass = 0; pass < 2; pass++)
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

      // A slow approach is a resting contact, not a bounce. Without this,
      // gravity re-injects velocity every frame and a stack never stops
      // shuffling.
      const e = -sep < 80 ? 0 : Math.min(a.restitution, b.restitution);
      const impulse = (-(1 + e) * sep) / inv;
      // Only a real knock resets the rest timer. Counting every contact meant a
      // body in a stack was "woken" 60 times a second and could never sleep.
      const kickA = impulse * ma;
      const kickB = impulse * mb;
      if (!a.held) { a.vx -= impulse * nx * ma; a.vy -= impulse * ny * ma; if (kickA > 30) { a.asleep = false; a.still = 0; } }
      if (!b.held) { b.vx += impulse * nx * mb; b.vy += impulse * ny * mb; if (kickB > 30) { b.asleep = false; b.still = 0; } }
      // Spin comes from rolling contact and from being thrown — never from the
      // normal impulse. Deriving it from the impulse gave every lower-indexed
      // body a negative kick and every higher-indexed one a positive kick, so
      // in a crowded box everything saturated and span on the spot forever.
      // A small tangential term keeps the character without the runaway.
      const vt = rvx * -ny + rvy * nx;
      if (!a.held) a.spin = spinClamp(a.spin - vt * 0.0012);
      if (!b.held) b.spin = spinClamp(b.spin - vt * 0.0012);
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
    b.still = 0;
    b.vx += (Math.random() - 0.5) * impulse;
    b.vy -= Math.random() * impulse;
    b.spin = spinClamp(b.spin + (Math.random() - 0.5) * 6);
  }
}
