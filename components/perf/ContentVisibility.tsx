import React from 'react';

export default function ContentVisibility({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
      {children}
    </div>
  );
}
