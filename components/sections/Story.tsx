"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, Calendar, CheckCircle2, GraduationCap, Layers } from "lucide-react";
import Chapter from "../game/Chapter";
import { sfx } from "../game/sfx";
import { useGame } from "../game/GameProvider";

type Filter = "todas" | "laboral" | "academica";

export default function Story() {
  const { c, t } = useGame();
  const { story } = c;
  const FILTERS = [
    { id: "todas", label: t.filterAll, icon: Layers },
    { id: "laboral", label: t.filterWork, icon: Briefcase },
    { id: "academica", label: t.filterEdu, icon: GraduationCap },
  ] as const;
  const [filter, setFilter] = useState<Filter>("todas");
  const list = filter === "todas" ? story : story.filter((s) => s.type === filter);
  const lineRef = useRef<HTMLOListElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);

  // La línea se dibuja con el scroll y los nodos se encienden al pasar.
  useEffect(() => {
    const ol = lineRef.current;
    if (!ol) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = ol.getBoundingClientRect();
      const mark = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (mark - r.top) / r.height));
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
      ol.querySelectorAll<HTMLElement>("[data-node]").forEach((n) => {
        n.toggleAttribute("data-on", n.getBoundingClientRect().top < mark);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [filter]);

  return (
    <Chapter
      id="historia"
      kicker={t.storyKicker}
      title={<>{t.storyTitle[0]}<span className="text-gradient">{t.storyTitle[1]}</span></>}
      intro={t.storyIntro}
    >
      <div className="reveal mb-16 inline-flex rounded-full border border-line bg-black/30 p-1 backdrop-blur" role="group" aria-label={t.filterLabel}>
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            onClick={() => {
              sfx.click();
              setFilter(id);
            }}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              filter === id ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_24px_-6px_#a855f7]" : "text-muted hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <ol ref={lineRef} className="relative mx-auto max-w-5xl">
        <span className="absolute top-0 bottom-0 left-4 w-px bg-line md:left-1/2" aria-hidden="true" />
        <span
          ref={fillRef}
          className="absolute top-0 bottom-0 left-4 w-[2px] origin-top bg-gradient-to-b from-violet-500 via-fuchsia-500 to-violet-500 shadow-[0_0_14px_#c026d3] md:left-1/2"
          style={{ transform: "scaleY(0)" }}
          aria-hidden="true"
        />

        {list.map((item, i) => {
          const arc = story.findIndex((s) => s.id === item.id);
          const Icon = item.type === "laboral" ? Briefcase : GraduationCap;
          const right = i % 2 === 1;
          return (
            <li key={`${filter}-${item.id}`} className="relative pb-16 pl-14 last:pb-0 md:grid md:grid-cols-2 md:gap-20 md:pl-0">
              <span
                data-node
                className="group absolute top-6 left-4 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center overflow-hidden rounded-full border border-line bg-bg text-subtle transition-all duration-500 data-[on]:scale-110 data-[on]:border-fuchsia-400 data-[on]:text-white data-[on]:shadow-[0_0_30px_#c026d3] md:left-1/2"
                aria-hidden="true"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 opacity-0 transition-opacity duration-500 group-data-[on]:opacity-100" />
                <Icon className="relative h-4 w-4" />
              </span>

              <div className={`hidden pt-5 md:flex ${right ? "md:order-1 md:justify-end" : "md:order-2"}`} aria-hidden="true">
                <span className="reveal font-display text-outline text-7xl leading-none font-bold">{item.period.split(" ")[0]}</span>
              </div>

              <article className={`reveal panel panel-hover p-6 sm:p-7 ${right ? "md:order-2" : "md:order-1"}`} data-side={right ? "right" : "left"}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs tracking-[0.2em] text-primary-ink uppercase">
                    {String(arc + 1).padStart(2, "0")} · {item.type === "laboral" ? t.filterWork : t.filterEdu}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.period}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-2xl font-bold text-ink">{item.title}</h3>
                <p className="text-sm font-medium text-fuchsia-300">{item.entity}</p>
                <p className="mt-3 leading-relaxed text-muted">{item.description}</p>
                <ul className="mt-4 space-y-2">
                  {item.achievements.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm text-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-300" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-4">
                  {item.skills.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </Chapter>
  );
}
