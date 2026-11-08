'use client';

import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
