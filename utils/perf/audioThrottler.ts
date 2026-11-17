let lastAudioTrigger = 0;

export function canPlayAudioTrigger(throttleMs = 50): boolean {
  const now = Date.now();
  if (now - lastAudioTrigger < throttleMs) return false;
  lastAudioTrigger = now;
  return true;
}
