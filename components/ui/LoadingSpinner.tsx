import React from 'react';

export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div role="status" aria-label="Cargando..." className="flex items-center justify-center">
      <div className={`${sizeMap[size]} border-2 border-purple-500 border-t-transparent rounded-full animate-spin`} />
      <span className="sr-only">Cargando contenido...</span>
    </div>
  );
}
