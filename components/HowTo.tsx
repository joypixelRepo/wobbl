'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Numbered instructions for an interactive zone. Nothing on this site should
 * require guessing: every playable area says what to do, in order, and marks
 * which step you are on.
 */
export function HowTo({
  steps, active = -1, done = [], className = '',
}: { steps: string[]; active?: number; done?: number[]; className?: string }) {
  return (
    <ol className={`howto ${className}`} aria-label="Cómo se juega">
      {steps.map((s, i) => (
        <li
          key={s}
          className={`howto-step ${i === active ? 'is-now' : ''} ${done.includes(i) ? 'is-done' : ''}`}
        >
          <b>{done.includes(i) ? '✓' : i + 1}</b>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * A pulsing marker that points at the control the visitor should touch first.
 * It removes itself the moment they interact, and never comes back.
 */
export function FirstHint({
  show, label, className = '',
}: { show: boolean; label: string; className?: string }) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!show) { setVisible(false); return; }
    // Give the section a beat to settle before nagging.
    timer.current = window.setTimeout(() => setVisible(true), 700);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [show]);

  if (!visible) return null;
  return (
    <span className={`first-hint ${className}`} aria-hidden>
      <i />
      {label}
    </span>
  );
}
