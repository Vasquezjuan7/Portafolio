export function shouldSkipParticleFrame(currentFps: number): boolean {
  return currentFps < 30; // Reduce workload on low-end hardware
}
