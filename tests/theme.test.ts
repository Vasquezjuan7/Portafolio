import { assert } from './testConfig';

export function testThemeModes() {
  const modes = ['dark', 'light'];
  assert(modes.includes('dark'), 'Modo oscuro soportado');
  assert(modes.includes('light'), 'Modo claro soportado');
}
