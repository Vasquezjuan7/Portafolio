'use client';

import React from 'react';

export default function FocusRing({ children }: { children: React.ReactNode }) {
  return (
    <div className="focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 rounded-xl transition-all">
      {children}
    </div>
  );
}
