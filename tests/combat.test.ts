import { COMBAT_BALANCE } from '../constants/combat';
import { assert } from './testConfig';

export function testCombatCalculations() {
  assert(COMBAT_BALANCE.player.initialHp === 100, 'Salud inicial del jugador correcta');
  assert(COMBAT_BALANCE.boss.maxHp > COMBAT_BALANCE.player.attackDmg, 'El jefe tiene más HP que un ataque');
}
