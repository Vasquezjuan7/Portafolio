export type GameMode = 'exploration' | 'tactical' | 'combat';

export type GameDifficulty = 'standard' | 'veteran' | 'hardcore';

export interface PlayerStats {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  defense: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  reducedMotion: boolean;
  scanlines: boolean;
}
