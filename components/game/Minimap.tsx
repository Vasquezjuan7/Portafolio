"use client";

import { useGame } from "./GameProvider";

/** Indicador lateral de secciones (puntos con etiqueta al pasar el cursor). */
export default function Minimap() {
  const { current, travel, c, t } = useGame();
  const { chapters } = c;
  const idx = chapters.findIndex((ch) => ch.id === current);

  return (
    <nav className="fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex" aria-label={t.minimapLabel}>
      <span className="absolute top-1 right-[5px] bottom-1 w-px bg-line" aria-hidden="true" />
      <span
        className="absolute top-1 right-[5px] w-px bg-gradient-to-b from-violet-500 to-fuchsia-500 shadow-[0_0_8px_#a855f7] transition-all duration-700"
        style={{ height: `calc(${(Math.max(0, idx) / (chapters.length - 1)) * 100}% - 8px)` }}
        aria-hidden="true"
      />
      {chapters.map((ch, i) => {
        const active = i === idx;
        const passed = i <= idx;
        return (
          <button key={ch.id} type="button" onClick={() => travel(ch.id)} className="group relative flex items-center gap-3" aria-label={`${t.goTo} ${ch.title}`} aria-current={active ? "true" : undefined}>
            <span className={`font-mono text-[10px] tracking-widest uppercase transition-all ${active ? "text-primary-ink opacity-100" : "translate-x-2 text-subtle opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}>
              {String(i).padStart(2, "0")} · {ch.short}
            </span>
            <span
              className={`relative h-[11px] w-[11px] rounded-full border transition-all ${
                active ? "scale-125 border-fuchsia-300 bg-fuchsia-400 shadow-[0_0_12px_#e879f9]" : passed ? "border-primary bg-primary" : "border-subtle bg-bg group-hover:border-primary-ink"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
