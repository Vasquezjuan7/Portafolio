export type AbilityTier = 'basic' | 'advanced' | 'ultimate';

export interface CombatAbility {
  id: string;
  name: string;
  tier: AbilityTier;
  manaCost: number;
  baseDamage: number;
  healing: number;
  cooldownTurns: number;
  description: string;
  techEquivalence: string;
}

export interface CombatLogRecord {
  id: string;
  turn: number;
  actor: 'player' | 'enemy' | 'system';
  message: string;
  critical?: boolean;
}
