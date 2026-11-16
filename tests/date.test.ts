import { formatTimelinePeriod, getYearsOfExperience } from '../utils/date';
import { assert } from './testConfig';

export function testDateUtils() {
  assert(formatTimelinePeriod('2024', 'Presente') === '2024 — Presente', 'Formateo de periodo');
  assert(getYearsOfExperience(2022) >= 1, 'Años de experiencia válidos');
}
