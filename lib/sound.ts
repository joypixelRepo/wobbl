/**
 * Procedural toy-sound engine.
 * Every sound is synthesised with the WebAudio API — zero audio assets to load,
 * and the timbres are shaped to feel like physical plastic toys.
 * Audio NEVER starts on its own: the context is only created after the user
 * explicitly switches sound ON.
 */

export type ToySound = 'click' | 'snap' | 'boing' | 'pop' | 'whoosh' | 'chime' | 'thud' | 'clack';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;

const listeners = new Set<(on: boolean) => void>();

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function isSoundOn() { return enabled; }

export function setSound(on: boolean) {
  enabled = on;
  if (on) ensureCtx();
  listeners.forEach((l) => l(on));
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('wobbl:sound', on ? '1' : '0'); } catch { /* private mode */ }
  }
}

export function restoreSoundPreference() {
  if (typeof window === 'undefined') return false;
  try { return localStorage.getItem('wobbl:sound') === '1'; } catch { return false; }
}

export function onSoundChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Short noise burst — the "plastic" component of every impact. */
function noise(c: AudioContext, dur: number, gain: number, filterHz: number, q = 1) {
  const frames = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, frames, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = filterHz;
  bp.Q.value = q;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(bp).connect(g).connect(master!);
  src.start();
  return src;
}

function tone(
  c: AudioContext,
  type: OscillatorType,
  f0: number,
  f1: number,
  dur: number,
  gain: number,
  delay = 0,
) {
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master!);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

const PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

export function play(sound: ToySound, variation = 0) {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c || !master) return;
  const v = 1 + (Math.random() - 0.5) * 0.12 + variation * 0.02;

  switch (sound) {
    case 'click':
      noise(c, 0.03, 0.28, 2600 * v, 6);
      tone(c, 'square', 1400 * v, 700 * v, 0.045, 0.1);
      break;
    case 'clack':
      noise(c, 0.05, 0.34, 1500 * v, 3);
      tone(c, 'triangle', 420 * v, 180 * v, 0.09, 0.16);
      break;
    case 'snap':
      noise(c, 0.035, 0.32, 3400 * v, 8);
      tone(c, 'sine', 900 * v, 1650 * v, 0.1, 0.2);
      tone(c, 'sine', 1650 * v, 2100 * v, 0.08, 0.09, 0.05);
      break;
    case 'boing': {
      const t = c.currentTime;
      const osc = c.createOscillator();
      const g = c.createGain();
      const lfo = c.createOscillator();
      const lfoGain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 * v, t);
      osc.frequency.exponentialRampToValueAtTime(120 * v, t + 0.42);
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(22, t);
      lfo.frequency.exponentialRampToValueAtTime(6, t + 0.42);
      lfoGain.gain.setValueAtTime(150, t);
      lfoGain.gain.exponentialRampToValueAtTime(6, t + 0.42);
      lfo.connect(lfoGain).connect(osc.frequency);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.24, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.46);
      osc.connect(g).connect(master);
      osc.start(t); lfo.start(t);
      osc.stop(t + 0.5); lfo.stop(t + 0.5);
      break;
    }
    case 'pop':
      tone(c, 'sine', 220 * v, 1200 * v, 0.07, 0.26);
      noise(c, 0.02, 0.16, 1800, 4);
      break;
    case 'thud':
      tone(c, 'sine', 160 * v, 55, 0.16, 0.3);
      noise(c, 0.06, 0.14, 480, 1.4);
      break;
    case 'whoosh': {
      // Filter-swept noise: air moving past a plastic object.
      const t = c.currentTime;
      const frames = Math.floor(c.sampleRate * 0.4);
      const buf = c.createBuffer(1, frames, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(320, t);
      bp.frequency.exponentialRampToValueAtTime(2600 * v, t + 0.18);
      bp.frequency.exponentialRampToValueAtTime(280, t + 0.4);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.18, t + 0.1);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      src.connect(bp).connect(g).connect(master);
      src.start(t);
      break;
    }
    case 'chime': {
      PENTA.forEach((f, i) => tone(c, 'triangle', f, f * 1.01, 0.5, 0.11, i * 0.055));
      break;
    }
  }
}

/** Ascending arpeggio for celebrations. */
export function fanfare() {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  [0, 1, 2, 3, 5].forEach((n, i) => {
    tone(c, 'triangle', PENTA[n], PENTA[n] * 1.005, 0.42, 0.13, i * 0.07);
    tone(c, 'sine', PENTA[n] * 2, PENTA[n] * 2, 0.24, 0.05, i * 0.07);
  });
}
