import { springInterpolate } from '../utils/spring';
import { assert } from './testConfig';

export function testSpringDamping() {
  const interpolated = springInterpolate(0, 100, 0.2);
  assert(interpolated === 20, 'Interpolación por resorte correcta');
}
