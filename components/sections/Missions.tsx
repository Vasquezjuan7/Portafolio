"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, CheckCircle2, ExternalLink, Image as ImageIcon, Play, Star, Target, Trophy, X } from "lucide-react";
import { ChapterHeader, useReveal } from "../game/Chapter";
import { useGame } from "../game/GameProvider";
import { sfx } from "../game/sfx";
import { GithubIcon } from "../Icons";
import type { Project } from "../../data/portfolio";

const hue = (i: number) => 262 + ((i * 23) % 70);

// La tarjeta final ("¿Y si el próximo es el tuyo?") rellena el espacio libre de la última fila.
const CTA_SPAN_MD = ["md:col-span-2", "md:col-span-1"];
const CTA_SPAN_XL = ["xl:col-span-3", "xl:col-span-2", "xl:col-span-1"];

function Stars({ value }: { value: number }) {
  const { t } = useGame();
  return (
    <span className="flex gap-0.5" aria-label={`${t.complexity} ${value} ${t.of} 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < value ? "fill-current text-fuchsia-300" : "text-subtle/50"}`} aria-hidden="true" />
      ))}
    </span>
  );
}

/** Visor del detalle: video del proyecto + galería de imágenes en miniatura. */
function MediaViewer({ media, title }: { media: NonNullable<Project["media"]>; title: string }) {
  const { t } = useGame();
  const items = [
    ...(media.video ? [{ kind: "video" as const, src: media.video, alt: `${t.gameplayVideo} · ${title}` }] : []),
    ...(media.images ?? []).map((im) => ({ kind: "image" as const, src: im.src, alt: im.alt })),
  ];
  const [sel, setSel] = useState(0);
  const cur = items[sel];
  if (!cur) return null;

  return (
    <div className="bg-black">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {cur.kind === "video" ? (
          <video key={cur.src} src={cur.src} poster={media.poster} controls playsInline preload="metadata" className="h-full w-full bg-black object-contain">
            {t.videoUnsupported}
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={cur.src} src={cur.src} alt={cur.alt} className="anim-fade h-full w-full object-contain" />
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto p-3" role="listbox" aria-label={t.gallery}>
        {items.map((it, i) => (
          <button
            key={it.src}
            type="button"
            role="option"
            aria-selected={i === sel}
            aria-label={it.alt}
            onClick={() => {
              sfx.click();
              setSel(i);
            }}
            className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-all ${i === sel ? "border-fuchsia-400 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.kind === "video" ? (media.poster ?? "") : it.src} alt="" className="h-full w-full object-cover" loading="lazy" />
            {it.kind === "video" && (
              <span className="absolute inset-0 grid place-items-center bg-[rgb(0_0_0/0.45)] text-white">
                <Play className="h-5 w-5 fill-current" aria-hidden="true" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Detail({ project, onClose }: { project: Project; onClose: () => void }) {
  const { c, t } = useGame();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const index = c.projects.findIndex((p) => p.id === project.id);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="anim-fade fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-xl"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-modal-open
    >
      <div role="dialog" aria-modal="true" aria-labelledby="detail-title" className={`panel glow-border anim-pop my-8 w-full overflow-hidden ${project.media ? "max-w-5xl" : "max-w-3xl"}`}>
        {project.media ? (
          <div className="relative">
            <MediaViewer media={project.media} title={project.title} />
            <button ref={closeRef} type="button" onClick={onClose} className="btn btn-ghost absolute top-4 right-4 z-10 h-10 w-10 bg-[rgb(0_0_0/0.55)] p-0 text-white" aria-label={t.closeDetail}>
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative h-44" style={{ ["--h" as string]: hue(index) }}>
            <div className="project-art" aria-hidden="true" />
            <span className="font-display text-outline absolute -bottom-6 left-6 text-[7rem] leading-none font-bold" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <button ref={closeRef} type="button" onClick={onClose} className="btn btn-ghost absolute top-4 right-4 h-10 w-10 bg-[rgb(0_0_0/0.4)] p-0 text-white" aria-label={t.closeDetail}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="p-6 sm:p-8">
          <p className="font-mono text-xs tracking-[0.3em] text-primary-ink uppercase">
            {project.category} · {project.year}
          </p>
          <h3 id="detail-title" className="font-display mt-2 text-4xl font-bold text-ink">
            {project.title}
          </h3>
          <p className="text-muted">{project.codename}</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-[1.5fr_1fr]">
            <div className="space-y-5">
              <div>
                <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-subtle uppercase">
                  <Target className="h-3.5 w-3.5" aria-hidden="true" /> {t.description}
                </p>
                <p className="mt-2 leading-relaxed text-ink">{project.description}</p>
              </div>
              <div>
                <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">{t.keyPoints}</p>
                <ul className="mt-2 space-y-2">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-300" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <dl className="space-y-3 rounded-xl border border-line bg-white/[0.02] p-4 text-sm">
              <div>
                <dt className="font-mono text-[10px] tracking-wider text-subtle uppercase">{t.role}</dt>
                <dd className="font-medium text-ink">{project.role}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-wider text-subtle uppercase">{t.complexity}</dt>
                <dd>
                  <Stars value={project.difficulty} />
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-wider text-subtle uppercase">{t.result}</dt>
                <dd className="flex items-start gap-1.5 font-medium text-ink">
                  <Trophy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fuchsia-300" aria-hidden="true" />
                  {project.reward}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-wider text-subtle uppercase">{t.technologiesLabel}</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {project.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-line pt-6">
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost magnetic px-6 py-3 text-sm">
              <GithubIcon className="h-4 w-4" /> {t.code}
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary magnetic px-6 py-3 text-sm">
                <ExternalLink className="h-4 w-4" aria-hidden="true" /> {t.liveDemo}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ p, i, onOpen }: { p: Project; i: number; onOpen: (p: Project, el: HTMLElement) => void }) {
  const { t } = useGame();
  const ref = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const playPreview = () => {
    const v = previewRef.current;
    if (v && document.documentElement.getAttribute("data-fx") !== "off") void v.play().catch(() => {});
  };
  const stopPreview = () => {
    const v = previewRef.current;
    if (v) v.pause();
  };

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || document.documentElement.getAttribute("data-fx") === "off") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(1100px) rotateY(${(x - 0.5) * 8}deg) rotateX(${(0.5 - y) * 8}deg)`;
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        onLeave();
        stopPreview();
      }}
      onPointerEnter={playPreview}
      className="tilt panel group flex h-full w-full flex-col overflow-hidden"
      style={{ ["--h" as string]: hue(i) }}
    >
      <button
        type="button"
        onClick={(e) => onOpen(p, e.currentTarget)}
        data-cursor={t.cursorView}
        className="relative block h-56 w-full shrink-0 overflow-hidden text-left"
        aria-label={`${t.viewDetailOf} ${p.title}`}
      >
        {p.media?.poster ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.media.poster} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            {p.media.video && (
              <video
                ref={previewRef}
                src={p.media.video}
                muted
                loop
                playsInline
                preload="none"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-[rgb(0_0_0/0.55)] to-transparent" aria-hidden="true" />
            <span className="chip absolute bottom-4 left-4 border-white/20 bg-[rgb(0_0_0/0.5)] text-white backdrop-blur">
              {p.media.video ? <Play className="h-3 w-3 fill-current" aria-hidden="true" /> : <ImageIcon className="h-3 w-3" aria-hidden="true" />}
              {p.media.video ? t.videoAndGallery : t.gallery}
            </span>
          </>
        ) : (
          <div className="project-art transition-transform duration-700 group-hover:scale-110" aria-hidden="true" />
        )}
        <span className={`font-display text-outline absolute -bottom-8 -left-2 ${p.media?.poster ? "hidden" : ""} text-[9rem] leading-none font-bold transition-all duration-500 group-hover:-translate-y-2`} aria-hidden="true">
          {String(i + 1).padStart(2, "0")}
        </span>
        <span className="chip absolute top-4 left-4 border-white/20 bg-[rgb(0_0_0/0.4)] text-white backdrop-blur">{p.category}</span>
        <span className="chip absolute top-4 right-4 border-white/20 bg-[rgb(0_0_0/0.4)] text-white backdrop-blur">{p.year}</span>
        <span className="absolute right-5 bottom-5 grid h-12 w-12 place-items-center rounded-full bg-white text-black opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
          <ArrowRight className="h-5 w-5 -rotate-45" />
        </span>
      </button>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-primary-ink">{p.codename}</p>
          <Stars value={p.difficulty} />
        </div>
        <h3 className="font-display mt-2 text-3xl font-bold text-ink sm:text-4xl">{p.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{p.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.tags.slice(0, 4).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex gap-2 pt-6">
          <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost flex-1 px-3 py-2.5 text-xs" aria-label={`${t.codeOf} ${p.title} ${t.onGithub}`}>
            <GithubIcon className="h-4 w-4" /> {t.code}
          </a>
          {p.demo ? (
            <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1 px-3 py-2.5 text-xs" aria-label={`${t.liveDemoOf} ${p.title}`}>
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> {t.demo}
            </a>
          ) : (
            p.media && (
              <button type="button" onClick={(e) => onOpen(p, e.currentTarget)} className="btn btn-primary flex-1 px-3 py-2.5 text-xs">
                <Play className="h-4 w-4 fill-current" aria-hidden="true" /> {p.media.video ? t.watchVideo : t.gallery}
              </button>
            )
          )}
        </div>
      </div>
      <div className="glare" aria-hidden="true" />
    </article>
  );
}

export default function Missions() {
  const { unlock, travel, c, t } = useGame();
  const { projects } = c;
  const [open, setOpen] = useState<Project | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const sectionRef = useReveal<HTMLElement>();
  const openDetail = (p: Project, trigger: HTMLElement) => {
    sfx.select();
    lastTrigger.current = trigger;
    setOpen(p);
    unlock("curioso");
  };

  const close = useCallback(() => {
    sfx.back();
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  return (
    <section id="misiones" ref={sectionRef} tabIndex={-1} aria-labelledby="misiones-title" className="relative scroll-mt-16 pt-24 outline-none lg:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ChapterHeader
          id="misiones"
          kicker={t.projectsKicker}
          title={<>{t.projectsTitle[0]}<span className="text-gradient">{t.projectsTitle[1]}</span></>}
          intro={t.projectsIntro}
        />
      </div>

      {/* Cuadrícula normal: la página se desplaza con normalidad, sin "secuestrar" el scroll. */}
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => (
          <div key={p.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
            <ProjectCard p={p} i={i} onOpen={openDetail} />
          </div>
        ))}

        <div className={`reveal panel glow-border flex w-full flex-col items-start justify-between gap-6 p-8 lg:flex-row lg:items-center ${CTA_SPAN_MD[projects.length % 2]} ${CTA_SPAN_XL[projects.length % 3]}`}>
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-primary-ink uppercase">{t.nextProject}</p>
            <p className="font-display mt-3 text-3xl leading-tight font-bold text-ink sm:text-4xl">
              {t.nextProjectTitle[0]}<span className="text-gradient">{t.nextProjectTitle[1]}</span>{t.nextProjectTitle[2]}
            </p>
          </div>
          <button type="button" onClick={() => travel("contacto")} className="btn btn-primary magnetic shrink-0 px-7 py-4 text-sm">
            {t.letsTalk} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* El detalle se monta en <body> para quedar por encima de la barra de navegación. */}
      {open && createPortal(<Detail project={projects.find((p) => p.id === open.id) ?? open} onClose={close} />, document.body)}
    </section>
  );
}
