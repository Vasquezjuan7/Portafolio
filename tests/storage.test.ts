import { safeGetStorage } from '../utils/storage';
import { assert } from './testConfig';

export function testStorageFallback() {
  const result = safeGetStorage('clave_inexistente', 'valor_por_defecto');
  assert(result === 'valor_por_defecto', 'Fallback de almacenamiento correcto');
}
