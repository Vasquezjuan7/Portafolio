"use client";

import { useGame } from "../game/GameProvider";

/** Radar hexagonal de atributos. */
export default function AttributeRadar() {
  const { c: content, t } = useGame();
  const { attributes } = content;
  const size = 220;
  const c = size / 2;
  const r = 76;
  const n = attributes.length;
  const point = (i: number, scale: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * r * scale, c + Math.sin(a) * r * scale] as const;
  };
  const ring = (scale: number) => attributes.map((_, i) => point(i, scale).join(",")).join(" ");
  const shape = attributes.map((a, i) => point(i, a.value / 100).join(",")).join(" ");

  return (
    <svg viewBox={`-34 -6 ${size + 68} ${size + 12}`} className="mx-auto w-full max-w-[280px]" role="img" aria-label={`${t.attributesLabel}: ${attributes.map((a) => `${a.label} ${a.value}`).join(", ")}`}>
      <defs>
        <linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#d946ef" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon key={s} points={ring(s)} fill="none" stroke="rgb(167 139 250 / 0.18)" strokeWidth="1" />
      ))}
      {attributes.map((_, i) => {
        const [x, y] = point(i, 1);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="rgb(167 139 250 / 0.18)" strokeWidth="1" />;
      })}
      <polygon points={shape} fill="url(#radar-fill)" stroke="#c084fc" strokeWidth="1.5" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px #a855f7)" }} />
      {attributes.map((a, i) => {
        const [x, y] = point(i, a.value / 100);
        return <circle key={a.label} cx={x} cy={y} r="3" fill="#f0abfc" />;
      })}
      {attributes.map((a, i) => {
        const [x, y] = point(i, 1.28);
        return (
          <text key={a.label} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="var(--muted)" style={{ font: "500 9px var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}

