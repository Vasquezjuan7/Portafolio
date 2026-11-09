'use client';

import { useState, useEffect } from 'react';

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export function useKonamiCode(onSuccess: () => void) {
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === KONAMI_SEQUENCE[cursor]) {
        const next = cursor + 1;
        if (next === KONAMI_SEQUENCE.length) {
          onSuccess();
          setCursor(0);
        } else {
          setCursor(next);
        }
      } else {
        setCursor(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursor, onSuccess]);
}
