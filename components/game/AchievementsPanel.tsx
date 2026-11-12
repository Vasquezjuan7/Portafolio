'use client';

import React from 'react';
import { ACHIEVEMENTS_LIST } from '../../data/achievements';
import { getUnlockedAchievements } from '../../utils/achievementTracker';
import AchievementBadge from './AchievementBadge';

export default function AchievementsPanel({ onClose }: { onClose: () => void }) {
  const unlocked = getUnlockedAchievements();

  return (
    <div className="p-6 rounded-2xl bg-black/95 border border-purple-500/40 text-white font-mono space-y-4 max-w-lg w-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-bold text-lg text-purple-400 flex items-center gap-2">
          <span>🏆</span> SALA DE TROFEOS & LOGROS
        </h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-xs">
          Cerrar
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2.5 max-h-80 overflow-y-auto pr-1">
        {ACHIEVEMENTS_LIST.map(item => (
          <AchievementBadge 
            key={item.id} 
            achievement={item} 
            isUnlocked={unlocked.includes(item.id)} 
          />
        ))}
      </div>
    </div>
  );
}
