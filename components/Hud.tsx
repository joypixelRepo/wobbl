'use client';

import { useRef, useState } from 'react';
import { useShop } from '@/lib/store';
import { play } from '@/lib/sound';

export default function Hud({
  menuOpen, onMenu, onLogoEgg,
}: { menuOpen: boolean; onMenu: () => void; onLogoEgg: () => void }) {
  const { count, soundOn, toggleSound, setBoxOpen } = useShop();
  const clicks = useRef(0);
  const timer = useRef<number | null>(null);
  const [pulse, setPulse] = useState(false);

  function hitLogo() {
    play('click');
    clicks.current += 1;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { clicks.current = 0; }, 900);
    if (clicks.current >= 3) {
      clicks.current = 0;
      onLogoEgg();
    }
  }

  function openBox() {
    play('clack');
    setBoxOpen(true);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 400);
  }

  return (
    <header className={`hud ${menuOpen ? 'hud-inverted' : ''}`}>
      <button className="hud-logo" onClick={hitLogo} data-cursor="press" aria-label="WOBBL inicio" type="button">
        <span className="hud-logo-mark" aria-hidden>
          <svg viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="20" fill="var(--a)" />
            <circle cx="22" cy="22" r="20" fill="url(#hud-sheen)" />
            <circle cx="15" cy="19" r="5.4" fill="#fff" /><circle cx="16" cy="20" r="2.6" fill="#100C14" />
            <circle cx="30" cy="19" r="5.4" fill="#fff" /><circle cx="31" cy="20" r="2.6" fill="#100C14" />
            <path d="M15 29q7 7 14 0" stroke="#100C14" strokeWidth="3" fill="none" strokeLinecap="round" />
            <defs>
              <linearGradient id="hud-sheen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff" stopOpacity=".45" />
                <stop offset="55%" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="hud-logo-word">WOBBL<i>.</i></span>
      </button>

      <div className="hud-right">
        <button
          className={`hud-btn hud-sound ${soundOn ? 'on' : ''}`}
          onClick={toggleSound}
          data-cursor="press"
          aria-pressed={soundOn}
          type="button"
        >
          <span className="eq" aria-hidden>
            <i /><i /><i /><i />
          </span>
          <span className="hud-btn-text">SONIDO {soundOn ? 'SÍ' : 'NO'}</span>
        </button>

        <button className={`hud-btn hud-cart ${pulse ? 'pulse' : ''}`} onClick={openBox} data-cursor="open" type="button">
          <span className="hud-cart-box" aria-hidden>
            <svg viewBox="0 0 44 34">
              <rect x="4" y="12" width="36" height="20" rx="5" fill="var(--fg)" />
              <rect x="2" y="6" width="40" height="9" rx="4" fill="var(--a)" />
              <rect x="19" y="6" width="6" height="26" fill="var(--c)" opacity=".9" />
            </svg>
          </span>
          <span className="hud-btn-text">MI CAJA</span>
          <span className={`hud-count ${count ? 'has' : ''}`}>{count}</span>
        </button>

        <button className={`hud-menu ${menuOpen ? 'is-open' : ''}`} onClick={onMenu} data-cursor="open" type="button"
          aria-expanded={menuOpen} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>
          <span /><span /><span />
          <em>{menuOpen ? 'CERRAR' : 'MENÚ'}</em>
        </button>
      </div>
    </header>
  );
}
