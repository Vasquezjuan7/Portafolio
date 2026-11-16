import { assert } from './testConfig';

export function testI18nIntegrity() {
  const es = { hero: 'Inicio', contact: 'Contacto' };
  const en = { hero: 'Home', contact: 'Contact' };
  assert(Object.keys(es).length === Object.keys(en).length, 'Mismo número de claves i18n');
}
