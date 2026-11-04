"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Chapter from "../game/Chapter";
import { useGame } from "../game/GameProvider";
import { sfx } from "../game/sfx";

const DURATION = 7000;

export default function Allies() {
  const { current, unlock, c, t } = useGame();
  const { allies } = c;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState<string[]>([allies[0].id]);
  const ally = allies[index];

  const go = useCallback((dir: number) => {
    setIndex((i) => {
      const next = (i + dir + allies.length) % allies.length;
      setSeen((s) => (s.includes(allies[next].id) ? s : [...s, allies[next].id]));
      return next;
    });
  }, [allies]);

  const manual = (dir: number) => {
    sfx.select();
    go(dir);
  };

  useEffect(() => {
    if (seen.length === allies.length) unlock("dialogo");
  }, [seen.length, unlock, allies.length]);

  // Avance automático mientras la sección está en pantalla.
  useEffect(() => {
    if (paused || current !== "aliados" || document.documentElement.getAttribute("data-fx") === "off") return;
    const t = setTimeout(() => go(1), DURATION);
    return () => clearTimeout(t);
  }, [index, paused, current, go]);

  useEffect(() => {
    if (current !== "aliados") return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight") manual(1);
      if (e.key === "ArrowLeft") manual(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <Chapter id="aliados" kicker={t.alliesKicker} title={<>{t.alliesTitle[0]}<span className="text-gradient">{t.alliesTitle[1]}</span></>} intro={t.alliesIntro}>
      <div className="reveal grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
        {/* Mazo */}
        <div
          className="relative h-[540px] sm:h-[440px] lg:h-[420px]"
          style={{ perspective: "1400px" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {allies.map((a, i) => {
            const pos = (i - index + allies.length) % allies.length;
            const front = pos === 0;
            return (
              <figure
                key={a.id}
                aria-hidden={!front}
                className="panel absolute inset-0 flex flex-col justify-between overflow-hidden p-7 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-9"
                style={{
                  background: "linear-gradient(180deg, rgb(255 255 255 / 0.05), transparent 40%), var(--deck)",
                  transform: `translate3d(${pos * 22}px, ${pos * -18}px, ${pos * -90}px) rotateY(${pos * -6}deg)`,
                  opacity: pos > 2 ? 0 : 1 - pos * 0.28,
                  zIndex: allies.length - pos,
                  filter: front ? "none" : `blur(${pos * 1.5}px)`,
                  pointerEvents: front ? "auto" : "none",
                }}
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-fuchsia-600/20 blur-3xl" aria-hidden="true" />
                <Quote className="h-10 w-10 text-fuchsia-400/60" aria-hidden="true" />
                <blockquote className="font-display relative mt-4 text-lg leading-snug font-medium text-ink sm:text-xl xl:text-2xl">
                  {front
                    ? a.text.split(" ").map((w, k) => (
                        <span key={`${index}-${k}`} className="anim-rise inline-block" style={{ animationDelay: `${k * 0.025}s` }}>
                          {w}&nbsp;
                        </span>
                      ))
                    : a.text}
                </blockquote>
                <figcaption className="relative mt-6 flex items-center gap-4">
                  <span className="font-display grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 font-bold text-white shadow-[0_0_24px_-4px_#a855f7]">
                    {a.initials}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{a.name}</span>
                    <span className="block text-sm text-muted">
                      {a.role} · {a.organization}
                    </span>
                  </span>
                </figcaption>
                {front && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5" aria-hidden="true">
                    <span
                      key={`${index}-${paused}`}
                      className="block h-full origin-left bg-gradient-to-r from-violet-500 to-fuchsia-400"
                      style={{ animation: paused || current !== "aliados" ? "none" : `loading ${DURATION}ms linear both` }}
                    />
                  </span>
                )}
              </figure>
            );
          })}
        </div>

        {/* Lista */}
        <div>
          <ul className="space-y-2" role="tablist" aria-label={t.alliesKicker}>
            {allies.map((a, i) => (
              <li key={a.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => {
                    sfx.select();
                    setIndex(i);
                    setSeen((s) => (s.includes(a.id) ? s : [...s, a.id]));
                  }}
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                    i === index ? "border-fuchsia-400/50 bg-fuchsia-500/10 shadow-[0_0_30px_-12px_#c026d3]" : "border-transparent hover:border-line hover:bg-white/[0.03]"
                  }`}
                >
                  <span className={`font-mono text-sm transition-colors ${i === index ? "text-fuchsia-300" : "text-subtle"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span className="block font-semibold text-ink">{a.name}</span>
                    <span className="block text-xs text-muted">{a.role}</span>
                  </span>
                  <span className={`h-px transition-all duration-500 ${i === index ? "w-10 bg-fuchsia-400" : "w-0 bg-transparent"}`} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-2">
            <button type="button" onClick={() => manual(-1)} className="btn btn-ghost magnetic h-12 w-12 p-0" aria-label={t.prevTestimonial}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => manual(1)} className="btn btn-primary magnetic h-12 w-12 p-0" aria-label={t.nextTestimonial}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {ally.name}: {ally.text}
          </p>
        </div>
      </div>
    </Chapter>
  );
}
