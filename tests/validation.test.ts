import { isValidEmail, sanitizeText, validateFormFields } from '../utils/validation';
import { assert } from './testConfig';

export function testValidationUtils() {
  assert(isValidEmail('usuario@dominio.com'), 'Email válido');
  assert(!isValidEmail('invalido-sin-arroba'), 'Email inválido');
  assert(sanitizeText('<script>hola</script>') === 'scripthola/script', 'Sanitización de etiquetas');
  assert(validateFormFields('Juan', 'correo@test.com', 'Mensaje largo de prueba') === null, 'Formulario correcto');
}
