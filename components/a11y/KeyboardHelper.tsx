'use client';

import React, { useState } from 'react';
import { KEYBOARD_SHORTCUTS } from '../../constants/shortcuts';

export default function KeyboardHelper() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-40 font-mono text-xs">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-slate-300 hover:text-white"
        aria-label="Atajos de teclado"
      >
        ⌨️ Teclas
      </button>

      {open && (
        <div className="absolute bottom-10 left-0 p-4 rounded-xl bg-black/95 border border-purple-500/50 text-white w-64 shadow-2xl space-y-2">
          <h4 className="font-bold text-purple-400">Atajos Tácticos</h4>
          <ul className="space-y-1 text-[11px] text-slate-300">
            {KEYBOARD_SHORTCUTS.map(sc => (
              <li key={sc.key} className="flex justify-between">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-bold">{sc.key}</kbd>
                <span>{sc.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
