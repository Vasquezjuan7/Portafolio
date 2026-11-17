import { CYBER_GRID } from '../constants/grid';
import { assert } from './testConfig';

export function testGridDimensions() {
  assert(CYBER_GRID.gridSize > 0, 'Tamaño de cuadrícula positivo');
  assert(CYBER_GRID.hudCornerSize === 9, 'Tamaño de esquina HUD de 9px');
}
