"use client";

import { useEffect, useRef } from "react";
import { CHAPTER_IDS, type ChapterId } from "../../data/portfolio";

/** Añade la clase .is-visible a los elementos .reveal del contenedor al entrar en pantalla. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    const scan = () => root.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)").forEach((el) => observer.observe(el));
    scan();
    // Elementos que aparecen después (filtros, pestañas) también se revelan.
    const mutations = new MutationObserver(scan);
    mutations.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);
  return ref;
}

interface ChapterProps {
  id: ChapterId;
  kicker: string;
  title: React.ReactNode;
  intro?: string;
  children: React.ReactNode;
  className?: string;
}

/** Cabecera de sección reutilizable. */
export function ChapterHeader({ id, kicker, title, intro }: Omit<ChapterProps, "children" | "className">) {
  const index = CHAPTER_IDS.indexOf(id);
  return (
    <header className="reveal relative mb-16 max-w-3xl">
          <span className="font-display pointer-events-none absolute -top-14 -left-2 text-[9rem] leading-none font-bold text-primary/[0.07] select-none sm:-left-6" aria-hidden="true">
            {String(index).padStart(2, "0")}
          </span>
          <div className="relative flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-primary-ink uppercase">
            <span className="text-subtle">{`// ${String(index).padStart(2, "0")}`}</span>
            <span className="h-px w-12 bg-gradient-to-r from-violet-500 to-fuchsia-500" aria-hidden="true" />
            {kicker}
          </div>
          <h2 id={`${id}-title`} className="font-display wipe relative mt-5 text-4xl leading-[1.02] font-bold text-ink sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          {intro && <p className="relative mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{intro}</p>}
        </header>
  );
}

/** Sección con cabecera y revelado al hacer scroll. */
export default function Chapter({ id, kicker, title, intro, children, className = "" }: ChapterProps) {
  const ref = useReveal<HTMLElement>();
  return (
    <section id={id} ref={ref} tabIndex={-1} aria-labelledby={`${id}-title`} className={`relative scroll-mt-16 px-4 py-24 outline-none sm:px-6 lg:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <ChapterHeader id={id} kicker={kicker} title={title} intro={intro} />
        {children}
      </div>
    </section>
  );
}
