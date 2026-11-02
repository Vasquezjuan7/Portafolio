// Efectos de sonido sintetizados con Web Audio API (sin archivos externos).

let ctx: AudioContext | null = null;
let enabled = false;

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

function audio(): AudioContext | null {
  if (!enabled || typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  type: OscillatorType,
  from: number,
  to: number,
  duration: number,
  volume: number,
  delay = 0,
) {
  const ac = audio();
  if (!ac) return;
  try {
    const t = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + duration);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + duration);
  } catch {
    // Silencioso
  }
}

export const sfx = {
  click: () => tone("sine", 880, 440, 0.05, 0.05),
  hover: () => tone("sine", 1200, 1100, 0.03, 0.015),
  select: () => tone("triangle", 520, 780, 0.08, 0.06),
  back: () => tone("triangle", 600, 300, 0.08, 0.05),
  world: () => tone("triangle", 320, 960, 0.14, 0.07),
  attack: () => tone("sawtooth", 650, 110, 0.15, 0.09),
  hit: () => tone("square", 200, 60, 0.18, 0.07),
  shield: () => tone("sine", 220, 880, 0.22, 0.08),
  ultimate: () => {
    tone("sawtooth", 140, 980, 0.3, 0.1);
    tone("sine", 70, 40, 0.5, 0.12, 0.25);
  },
  discover: () => {
    tone("sine", 660, 660, 0.08, 0.04);
    tone("sine", 990, 990, 0.12, 0.04, 0.08);
  },
  achievement: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone("sine", f, f, 0.18, 0.05, i * 0.07));
  },
  fail: () => {
    tone("triangle", 400, 200, 0.25, 0.07);
    tone("triangle", 300, 120, 0.4, 0.07, 0.22);
  },
  start: () => {
    tone("triangle", 220, 440, 0.2, 0.06);
    tone("triangle", 440, 880, 0.3, 0.06, 0.15);
  },
};
