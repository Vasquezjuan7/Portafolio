"use client";

import { useSyncExternalStore } from "react";
import { ArrowUp } from "lucide-react";
import { useGame } from "../game/GameProvider";
import { GithubIcon, LinkedinIcon } from "../Icons";

const noopSubscribe = () => () => {};
const BUILD_YEAR = 2026;

/** Pie de página en forma de créditos finales. */
export default function Credits() {
  const { travel, c, t } = useGame();
  const { chapters, profile } = c;
  // El año se lee en el navegador; en el prerender se usa el del build.
  const year = useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => BUILD_YEAR);

  return (
    <footer className="relative z-10 border-t border-line bg-surface/80 backdrop-blur-md">
      <div className="marquee overflow-hidden border-b border-line py-6" aria-hidden="true">
        <div className="marquee-track" style={{ animationDuration: "28s" }}>
          {Array.from({ length: 2 }, (_, k) => (
            <span key={k} className="font-display flex items-center text-[clamp(2.5rem,7vw,6rem)] leading-none font-bold whitespace-nowrap">
              {t.marquee.map((w, i) => (
                <span key={w} className="flex items-center">
                  <span className={i % 2 ? "text-gradient" : "text-outline"}>{w}</span>
                  <span className="mx-8 text-fuchsia-400/70">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-subtle uppercase">{t.haveProject}</p>
          <a href={`mailto:${profile.email}`} data-cursor={t.cursorWrite} className="group mt-6 inline-block">
            <span className="font-display text-outline hover-fill block text-[clamp(3rem,11vw,9rem)] leading-[0.9] font-bold tracking-[-0.04em] transition-all duration-500">
              {t.letsTalk}
            </span>
            <span className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors group-hover:text-ink">
              {profile.email} <ArrowUp className="h-4 w-4 rotate-45 transition-transform group-hover:rotate-90" aria-hidden="true" />
            </span>
          </a>
          <div>
            <button type="button" onClick={() => travel("inicio")} className="btn btn-ghost magnetic mt-10 px-5 py-2.5 text-xs">
              <ArrowUp className="h-4 w-4" aria-hidden="true" /> {t.backTop}
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 text-sm sm:grid-cols-2">
          <div>
            <p className="font-hud text-xs font-bold tracking-[0.25em] text-subtle uppercase">{t.chaptersLabel}</p>
            <ul className="mt-3 grid grid-cols-2 gap-1.5">
              {chapters.map((ch) => (
                <li key={ch.id}>
                  <a
                    href={`#${ch.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      travel(ch.id);
                    }}
                    className="text-muted hover:text-primary-ink"
                  >
                    › {ch.short}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-hud text-xs font-bold tracking-[0.25em] text-subtle uppercase">{t.development}</p>
            <p className="mt-3 text-muted">{t.builtBy} {profile.fullName}</p>
            <p className="mt-1 text-muted">Next.js · React · TypeScript · Tailwind CSS · Web Audio · Canvas</p>
            <div className="mt-4 flex gap-2">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost h-10 w-10 p-0" aria-label="GitHub">
                <GithubIcon className="h-4 w-4" />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost h-10 w-10 p-0" aria-label="LinkedIn">
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center font-mono text-xs text-subtle">
          © {year} {profile.fullName} · {t.rights}
        </p>
      </div>
    </footer>
  );
}
