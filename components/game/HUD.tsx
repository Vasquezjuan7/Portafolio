"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Command } from "lucide-react";
import { useGame } from "./GameProvider";
import CvButton from "../CvButton";
import { LangSwitch, ThemeSwitch } from "../Switchers";

/** Barra de navegación flotante con progreso de lectura. */
export default function HUD() {
  const { save, current, setSound, setPauseOpen, travel, c, t } = useGame();
  const { profile, chapters } = c;
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);

  // Píldora que se desliza hasta la sección activa.
  useEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;
    const place = () => {
      const link = nav.querySelector<HTMLElement>(`[data-id="${current}"]`);
      if (!link) {
        pill.style.opacity = "0";
        return;
      }
      pill.style.opacity = "1";
      pill.style.transform = `translateX(${link.offsetLeft}px)`;
      pill.style.width = `${link.offsetWidth}px`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [current, chapters]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div ref={progressRef} className="h-[2px] origin-left bg-gradient-to-r from-violet-600 via-purple-400 to-fuchsia-500 shadow-[0_0_12px_#a855f7]" style={{ transform: "scaleX(0)" }} aria-hidden="true" />

      <div className={`mx-auto mt-3 flex max-w-6xl items-center gap-3 rounded-full border px-3 py-2 transition-all duration-500 sm:px-4 ${
        scrolled ? "mx-3 border-line bg-bg/70 shadow-[0_10px_40px_-15px_rgb(139_92_246/0.5)] backdrop-blur-xl sm:mx-auto" : "mx-3 border-transparent bg-transparent sm:mx-auto"
      }`}>
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            travel("inicio");
          }}
          className="group flex items-center gap-2.5"
          aria-label={`${profile.fullName}, ${t.backHome}`}
        >
          <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 p-[2px] shadow-[0_0_20px_-4px_#a855f7] transition-transform group-hover:scale-110">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.avatar} alt="" className="h-full w-full rounded-full object-cover" draggable={false} />
          </span>
          <span className="font-display hidden text-sm font-semibold whitespace-nowrap text-ink sm:block lg:hidden">{profile.fullName}</span>
        </a>

        <nav ref={navRef} className="relative mx-auto hidden items-center gap-0.5 lg:flex" aria-label={t.sectionsNav}>
          <span ref={pillRef} className="absolute top-0 left-0 h-full rounded-full border border-fuchsia-400/40 bg-gradient-to-r from-violet-600/40 to-fuchsia-600/30 opacity-0 shadow-[0_0_24px_-6px_#c026d3] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" aria-hidden="true" />
          {chapters.slice(1).map((c) => {
            const active = current === c.id;
            return (
              <a
                key={c.id}
                data-id={c.id}
                href={`#${c.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  travel(c.id);
                }}
                aria-current={active ? "true" : undefined}
                className={`relative z-10 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                                {c.short}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <LangSwitch />
          <ThemeSwitch />
          <button
            type="button"
            onClick={() => setSound(!save.sound)}
            className="btn btn-ghost h-9 w-9 p-0"
            aria-label={save.sound ? t.soundOff : t.soundOn}
            aria-pressed={save.sound}
          >
            {save.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => setPauseOpen(true)} className="btn btn-ghost h-9 gap-1.5 px-3 text-xs" aria-label={t.openMenu}>
            <Command className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{t.menu}</span>
            <span className="hidden font-mono text-[10px] text-subtle xl:inline">Ctrl K</span>
          </button>
          <CvButton label="CV" iconClass="h-3.5 w-3.5" className="btn btn-primary hidden h-9 px-4 text-xs sm:inline-flex" />
        </div>
      </div>
    </header>
  );
}
