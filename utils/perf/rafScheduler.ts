export function scheduleNextTick(callback: () => void): number {
  if (typeof window === 'undefined') return 0;
  return window.requestAnimationFrame(callback);
}
