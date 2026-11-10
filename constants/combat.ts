export const COMBAT_BALANCE = {
  player: {
    initialHp: 100,
    initialMana: 60,
    maxMana: 100,
    attackDmg: 40,
    manaRegen: 15,
    shieldHeal: 25,
    shieldMana: 20,
    ultimateCost: 50,
    ultimateDmg: 85,
  },
  boss: {
    maxHp: 150,
    counterDmg: 18,
    weakenedDmg: 12,
  },
} as const;
