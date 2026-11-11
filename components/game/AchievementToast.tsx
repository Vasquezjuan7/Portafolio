'use client';

import React from 'react';

interface AchievementToastProps {
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  onClose: () => void;
}

export default function AchievementToast({ title, description, icon, xpReward, onClose }: AchievementToastProps) {
  return (
    <aside 
      aria-label="Notificación de logro desbloqueado"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-4 p-4 rounded-2xl bg-black/90 border border-amber-500/50 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300 text-white font-mono"
    >
      <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl animate-bounce">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">¡LOGRO DESBLOQUEADO!</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">+{xpReward} XP</span>
        </div>
        <h4 className="text-sm font-bold">{title}</h4>
        <p className="text-xs text-slate-300">{description}</p>
      </div>
      <button 
        type="button" 
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </aside>
  );
}
