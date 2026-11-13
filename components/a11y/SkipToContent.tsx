'use client';

import React from 'react';

export default function SkipToContent() {
  return (
    <a
      href="#hero"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[999] px-4 py-2 bg-indigo-600 text-white font-mono text-xs rounded-lg shadow-xl"
    >
      Saltar al contenido principal
    </a>
  );
}
