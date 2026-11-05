"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useGame } from "../game/GameProvider";
import { sfx } from "../game/sfx";
import RankIcon, { valueToRank } from "../RankIcon";

/** Radar hexagonal de atributos, interactivo: pasa el cursor, toca o navega con el teclado. */
export default function AttributeRadar() {
  const { c: content, t } = useGame();
  const { attributes, rankLabels } = content;
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<SVGSVGElement | null>(null);

  // La figura "crece" desde el centro cuando el radar entra en pantalla.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const size = 220;
  const c = size / 2;
  const r = 76;
  const n = attributes.length;
  const active = hover ?? pinned;

  const point = (i: number, scale: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * r * scale, c + Math.sin(a) * r * scale] as const;
  };
  const ring = (scale: number) => attributes.map((_, i) => point(i, scale).join(",")).join(" ");
  const shape = attributes.map((a, i) => point(i, a.value / 100).join(",")).join(" ");

  const select = (i: number) => {
    sfx.click();
    setPinned((p) => (p === i ? null : i));
  };

  const onKey = (e: KeyboardEvent<SVGGElement>, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(i);
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
      const next = (i + dir + n) % n;
      setPinned(next);
      ref.current?.querySelector<SVGGElement>(`[data-attr="${next}"]`)?.focus();
    }
  };

  const current = active !== null ? attributes[active] : null;
  const currentRank = current ? valueToRank(current.value) : null;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <svg
        ref={ref}
        viewBox={`-34 -6 ${size + 68} ${size + 12}`}
        className="mx-auto w-full max-w-[280px] overflow-visible"
        role="group"
        aria-label={t.attributesLabel}
        onMouseLeave={() => setHover(null)}
      >
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
          const on = active === i;
          return (
            <line
              key={i}
              x1={c}
              y1={c}
              x2={x}
              y2={y}
              stroke={on ? "#f0abfc" : "rgb(167 139 250 / 0.18)"}
              strokeWidth={on ? 1.5 : 1}
              style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
            />
          );
        })}

        <g
          style={{
            transformOrigin: `${c}px ${c}px`,
            transform: visible ? "scale(1)" : "scale(0)",
            transition: "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <polygon
            points={shape}
            fill="url(#radar-fill)"
            stroke="#c084fc"
            strokeWidth="1.5"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 8px #a855f7)", opacity: active === null ? 1 : 0.75, transition: "opacity 0.2s" }}
          />
          {attributes.map((a, i) => {
            const [x, y] = point(i, a.value / 100);
            const on = active === i;
            return (
              <g key={a.label}>
                {on && <circle cx={x} cy={y} r="9" fill="#f0abfc" opacity="0.25" className="animate-ping" style={{ transformOrigin: `${x}px ${y}px` }} />}
                <circle cx={x} cy={y} r={on ? 5 : 3} fill={on ? "#ffffff" : "#f0abfc"} stroke={on ? "#d946ef" : "none"} strokeWidth="2" style={{ transition: "r 0.2s" }} />
              </g>
            );
          })}
        </g>

        {attributes.map((a, i) => {
          const [x, y] = point(i, 1.28);
          const [vx, vy] = point(i, a.value / 100);
          const on = active === i;
          return (
            <g
              key={a.label}
              data-attr={i}
              role="button"
              tabIndex={0}
              aria-pressed={pinned === i}
              aria-label={`${a.label}: ${rankLabels[valueToRank(a.value)]}. ${a.detail}`}
              className="cursor-pointer outline-none [&:focus-visible>text]:underline"
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onClick={() => select(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {/* Zonas de toque amplias: la etiqueta y el vértice. */}
              <circle cx={x} cy={y} r="22" fill="transparent" />
              <circle cx={vx} cy={vy} r="14" fill="transparent" />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={on ? "var(--ink)" : "var(--muted)"}
                style={{
                  font: `${on ? 700 : 500} 9px var(--font-mono)`,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  transition: "fill 0.2s",
                }}
              >
                {a.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="min-h-[92px] w-full rounded-xl border border-line bg-white/[0.02] p-3.5" aria-live="polite">
        {current && currentRank ? (
          <div key={current.label} className="anim-fade">
            <p className="flex items-center justify-between gap-3">
              <span className="font-display font-semibold text-ink">{current.label}</span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-fuchsia-300">
                <RankIcon rank={currentRank} className="h-3.5 w-3.5" />
                {rankLabels[currentRank]}
              </span>
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{current.detail}</p>
          </div>
        ) : (
          <p className="grid h-full min-h-[64px] place-items-center text-center text-xs text-subtle">{t.attributesHint}</p>
        )}
      </div>
    </div>
  );
}
