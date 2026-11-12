'use client';

import React from 'react';
import { Achievement } from '../../data/achievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

export default function AchievementBadge({ achievement, isUnlocked }: AchievementBadgeProps) {
  return (
    <div 
      className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
        isUnlocked 
          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
          : 'bg-black/30 border-white/5 opacity-50 text-slate-500'
      }`}
    >
      <span className="text-2xl filter drop-shadow">{achievement.icon}</span>
      <div>
        <div className="flex items-center gap-2">
          <h5 className="font-bold text-xs">{achievement.title}</h5>
          {isUnlocked && <span className="text-[10px] text-emerald-400 font-mono">DESBLOQUEADO</span>}
        </div>
        <p className="text-[11px] opacity-80">{achievement.description}</p>
      </div>
    </div>
  );
}
