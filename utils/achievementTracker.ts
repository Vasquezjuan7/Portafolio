import { safeGetStorage, safeSetStorage } from './storage';

const ACHIEVEMENTS_KEY = 'portfolio_unlocked_achievements';

export function getUnlockedAchievements(): string[] {
  return safeGetStorage<string[]>(ACHIEVEMENTS_KEY, ['first_contact']);
}

export function unlockAchievement(id: string): boolean {
  const current = getUnlockedAchievements();
  if (current.includes(id)) return false;
  const updated = [...current, id];
  safeSetStorage(ACHIEVEMENTS_KEY, updated);
  return true;
}
