'use client';

import { useEffect, useState } from 'react';
import { play } from '@/lib/sound';

/** Clicked the logo three times? Someone comes out to say hello. */
export default function EggFriend({ trigger }: { trigger: number }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setOn(true);
    play('chime');
    const t = window.setTimeout(() => setOn(false), 5200);
    return () => window.clearTimeout(t);
  }, [trigger]);

  if (!on) return null;

  return (
    <div className="egg" aria-hidden>
      <div className="egg-friend">
        <svg viewBox="0 0 120 120">
          <ellipse cx="60" cy="112" rx="30" ry="6" fill="rgba(0,0,0,.2)" />
          <g className="egg-legs">
            <rect x="42" y="86" width="12" height="24" rx="6" fill="#100C14" />
            <rect x="66" y="86" width="12" height="24" rx="6" fill="#100C14" />
          </g>
          <circle cx="60" cy="56" r="44" fill="#FFCE00" />
          <circle cx="60" cy="56" r="44" fill="url(#egg-sheen)" />
          <circle cx="44" cy="50" r="11" fill="#fff" /><circle cx="46" cy="52" r="5.4" fill="#100C14" />
          <circle cx="76" cy="50" r="11" fill="#fff" /><circle cx="78" cy="52" r="5.4" fill="#100C14" />
          <path d="M44 72q16 14 32 0" stroke="#100C14" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="57" y="4" width="6" height="14" rx="3" fill="#FF4433" />
          <circle cx="60" cy="5" r="7" fill="#FF4433" />
          <defs>
            <linearGradient id="egg-sheen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".5" />
              <stop offset="55%" stopColor="#fff" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity=".2" />
            </linearGradient>
          </defs>
        </svg>
        <span className="egg-say">¡ME HAS ENCONTRADO!</span>
      </div>
    </div>
  );
}
