import { getExternalLinkProps } from '../utils/security';
import { assert } from './testConfig';

export function testLinkSecurity() {
  const props = getExternalLinkProps();
  assert(props.rel.includes('noopener'), 'Atributo noopener presente');
  assert(props.rel.includes('noreferrer'), 'Atributo noreferrer presente');
}
