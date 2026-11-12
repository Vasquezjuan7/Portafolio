'use client';

import React from 'react';
import { ACHIEVEMENTS_LIST } from '../../data/achievements';
import { getUnlockedAchievements } from '../../utils/achievementTracker';

export default function AchievementsCounter({ onClick }: { onClick: () => void }) {
  const unlockedCount = getUnlockedAchievements().length;
  const total = ACHIEVEMENTS_LIST.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-mono transition-all"
      title="Ver trofeos y logros del portafolio"
    >
      <span>🏆</span>
      <span className="font-bold">{unlockedCount}/{total}</span>
    </button>
  );
}
