"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useGame } from "../game/GameProvider";
import { CountUp, RotatingText } from "../fx/Effects";
import CvButton from "../CvButton";

/** Línea de texto cuyas letras entran en 3D una a una. */
function SplitLine({ text, delay = 0, charClass = "" }: { text: string; delay?: number; charClass?: string }) {
  return (
    <span className="split-line" aria-label={text} style={{ perspective: "800px" }}>
      {text.split(" ").map((word, w, words) => {
        // Índice global de la letra para encadenar los retrasos entre palabras.
        const start = words.slice(0, w).reduce((n, x) => n + x.length + 1, 0);
        return (
          <span key={w} className="inline-block whitespace-nowrap">
            {word.split("").map((ch, i) => (
              <span key={i} aria-hidden="true" className={`split-char ${charClass}`} style={{ animationDelay: `${delay + (start + i) * 0.05}s` }}>
                {ch}
              </span>
            ))}
            {w < words.length - 1 && <span aria-hidden="true">{" "}</span>}
          </span>
        );
      })}
    </span>
  );
}

const CHIPS = [
  { label: "Next.js", x: "58%", y: "18%", depth: 30, delay: "0s" },
  { label: "Node.js", x: "86%", y: "26%", depth: 50, delay: "1.2s" },
  { label: "Spring Boot", x: "62%", y: "70%", depth: 40, delay: "0.6s" },
  { label: "PostgreSQL", x: "88%", y: "62%", depth: 25, delay: "1.8s" },
  { label: "AWS", x: "74%", y: "84%", depth: 60, delay: "0.9s" },
  { label: "React", x: "70%", y: "42%", depth: 70, delay: "2.4s" },
];

/** Chips de cristal flotando alrededor del orbe, con parallax según el ratón. */
function FloatingChips() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));
    let raf = 0;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      items.forEach((el) => {
        const d = Number(el.dataset.depth);
        el.style.translate = `${cur.x * d}px ${cur.y * d}px`;
      });
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      {CHIPS.map((c, i) => (
        <span key={c.label} data-depth={c.depth} className="absolute" style={{ left: c.x, top: c.y }}>
          <span className="anim-rise block" style={{ animationDelay: `${1.2 + i * 0.12}s` }}>
            <span
              className="anim-float flex items-center gap-2 rounded-full border border-line bg-white/[0.06] px-4 py-2 font-mono text-xs text-ink/90 shadow-[0_8px_30px_-8px_rgb(168_85_247/0.6)] backdrop-blur-md"
              style={{ animationDelay: c.delay, animationDuration: `${4 + (i % 3)}s` }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#e879f9]" />
              {c.label}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Hero() {
  const { travel, c, t } = useGame();
  const { profile, quickStats, skillTree } = c;
  const TECH = skillTree.flatMap((b) => b.nodes.map((n) => n.name));
  // Línea 1: nombres · Línea 2: apellidos.
  const words = profile.fullName.toUpperCase().split(" ");
  const first = words.slice(0, 2).join(" ");
  const rest = words.slice(2);

  return (
    <section id="inicio" tabIndex={-1} aria-label="Inicio" className="relative flex min-h-[100svh] flex-col overflow-hidden outline-none">
            <div className="pointer-events-none absolute inset-0 bg-black/35 lg:hidden" aria-hidden="true" />

      <FloatingChips />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pt-28 pb-12 sm:px-6">
        <div className="anim-rise flex flex-wrap items-center gap-3" style={{ animationDelay: "0.1s" }}>
          <span className="chip border-primary/30 bg-black/30 text-primary-ink backdrop-blur">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            {profile.availability}
          </span>
          <span className="chip bg-black/30 backdrop-blur">{profile.location}</span>
        </div>

        <h1 className="font-display mt-6 text-[clamp(2.6rem,6vw,6.25rem)] leading-[0.9] font-bold tracking-[-0.05em] text-ink">
          <span className="sr-only">{profile.fullName}, </span>
          <SplitLine text={first} delay={0.15} />
          {rest.length > 0 && <SplitLine text={rest.join(" ")} delay={0.45} charClass="text-gradient" />}
        </h1>

        <div className="mt-8 grid max-w-2xl gap-6">
          <p className="anim-rise font-mono text-lg text-ink sm:text-2xl" style={{ animationDelay: "0.8s" }}>
            <span className="text-fuchsia-400">&gt;</span> <RotatingText items={t.roles} />
          </p>
          <p className="anim-rise max-w-xl text-base leading-relaxed text-muted sm:text-lg" style={{ animationDelay: "0.9s" }}>
            {profile.tagline}
          </p>

          <div className="anim-rise flex flex-wrap gap-3" style={{ animationDelay: "1s" }}>
            <CvButton className="btn btn-primary magnetic px-8 py-4 text-sm" />
            <a
              href="#misiones"
              onClick={(e) => {
                e.preventDefault();
                travel("misiones");
              }}
              className="btn btn-ghost magnetic group bg-black/30 px-8 py-4 text-sm"
            >
              {t.seeProjects}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <dl className="anim-rise mt-14 grid max-w-xl grid-cols-3 gap-6" style={{ animationDelay: "1.1s" }}>
          {quickStats.map((s) => (
            <div key={s.label} className="border-l border-fuchsia-400/40 pl-4">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-bold text-ink sm:text-5xl">
                <CountUp value={s.value} />
              </dd>
              <dd className="mt-1 text-xs text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={() => travel("perfil")}
          className="anim-rise absolute right-6 bottom-10 hidden items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-muted uppercase hover:text-ink lg:flex"
          style={{ animationDelay: "1.3s" }}
        >
          {t.discoverMore}
          <span className="grid h-12 w-12 place-items-center rounded-full border border-line backdrop-blur">
            <ArrowDown className="anim-float h-4 w-4 text-fuchsia-300" aria-hidden="true" />
          </span>
        </button>
      </div>

      {/* Cinta de tecnologías */}
      <div className="tech-ribbon marquee relative -rotate-1 border-y border-fuchsia-400/20 py-4 backdrop-blur-md" aria-label={t.technologies}>
        <div className="marquee-track">
          {[...TECH, ...TECH].map((t, i) => (
            <span key={i} className="font-display mx-7 flex items-center gap-7 text-lg font-medium whitespace-nowrap text-ink/80" aria-hidden={i >= TECH.length}>
              {t}
              <span className="text-fuchsia-400" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
