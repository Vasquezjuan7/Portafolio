'use client';

import React, { useEffect, useRef } from 'react';

export default function FocusTrap({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) {
      focusable[0].focus();
    }
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
