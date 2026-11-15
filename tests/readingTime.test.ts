import { estimateReadingMinutes } from '../utils/readingTime';
import { assert } from './testConfig';

export function testReadingTime() {
  const shortText = 'Hola mundo desarrollador';
  assert(estimateReadingMinutes(shortText) === 1, 'Texto corto debe dar 1 minuto');
  const longText = new Array(400).fill('palabra').join(' ');
  assert(estimateReadingMinutes(longText) === 2, '400 palabras deben dar 2 minutos');
}
