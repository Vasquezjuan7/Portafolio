'use client';

import React from 'react';

export default function AriaLiveRegion({ message }: { message: string }) {
  return (
    <div 
      aria-live="polite" 
      aria-atomic="true" 
      className="sr-only"
    >
      {message}
    </div>
  );
}
