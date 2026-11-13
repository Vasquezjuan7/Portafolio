'use client';

import React from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export default function ReducedMotionNotice() {
  const prefersReduced = usePrefersReducedMotion();

  if (!prefersReduced) return null;

  return (
    <aside 
      aria-label="Aviso de modo de movimiento reducido"
      className="p-2 text-[10px] font-mono bg-purple-950/60 text-purple-200 border-b border-purple-800 text-center"
    >
      Modo de movimiento reducido activado según las preferencias de tu sistema operativo.
    </aside>
  );
}
