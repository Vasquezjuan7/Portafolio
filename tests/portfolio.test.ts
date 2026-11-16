import { assert } from './testConfig';

export function testPortfolioUniqueIds() {
  const ids = ['pulseflow', 'vortex3d', 'nexustask', 'aurastore', 'devstream', 'vaultkey'];
  const uniqueIds = new Set(ids);
  assert(ids.length === uniqueIds.size, 'IDs de proyectos únicos');
}
