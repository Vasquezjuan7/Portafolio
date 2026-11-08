export function springInterpolate(current: number, target: number, damping: number = 0.15): number {
  return current + (target - current) * damping;
}
