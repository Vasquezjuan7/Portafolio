import { assert } from './testConfig';

export function testCvFileName() {
  const fileName = 'Juan_Desarrollador_CV.pdf';
  assert(fileName.endsWith('.pdf'), 'Extensión de hoja de vida válida');
}
