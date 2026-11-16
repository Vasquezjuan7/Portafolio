import { clamp, lerp, roundTo } from '../utils/math';
import { assert } from './testConfig';

export function testMathUtils() {
  assert(clamp(15, 0, 10) === 10, 'Clamp superior');
  assert(clamp(-5, 0, 10) === 0, 'Clamp inferior');
  assert(lerp(0, 100, 0.5) === 50, 'Lerp al 50%');
  assert(roundTo(3.14159, 2) === 3.14, 'Redondeo a dos decimales');
}
