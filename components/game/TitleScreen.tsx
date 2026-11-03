"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { introSeen, useGame } from "./GameProvider";
import { INTRO_KEY, getSave, updateSave } from "./store";

/** Intro: contador gigante y telón que se abre. Se salta con clic o tecla. */
export default function TitleScreen() {
  const { unlock, c, t } = useGame();
  const { profile } = c;
  const WORDS = t.titleWords;
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current || introSeen()) return;
    done.current = true;
    setLeaving(true);
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // Ignorar
    }
    // Las animaciones del inicio arrancan mientras se abre el telón.
    setTimeout(() => document.documentElement.setAttribute("data-intro-start", "1"), 0);
    setTimeout(() => {
      document.documentElement.setAttribute("data-intro", "seen");
      updateSave((s) => ({ discovered: s.discovered.includes("inicio") ? s.discovered : [...s.discovered, "inicio"] }));
      unlock("inicio");
    }, 1000);
  }, [unlock]);

  useEffect(() => {
    if (introSeen()) return;
    const total = getSave().fx ? 2200 : 300;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const x = Math.min(1, (t - start) / total);
      setPct(Math.round(100 * (1 - Math.pow(1 - x, 2))));
      if (x < 1) raf = requestAnimationFrame(tick);
      else setTimeout(finish, 200);
    };
    raf = requestAnimationFrame(tick);
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skip);
    };
  }, [finish]);

  const word = WORDS[Math.min(WORDS.length - 1, Math.floor(pct / (100 / WORDS.length)))];

  return (
    <div onClick={finish} className="title-screen fixed inset-0 z-[100] cursor-pointer overflow-hidden" role="dialog" aria-modal="true" aria-label={t.titleLoading}>
      <div className={`curtain absolute inset-x-0 top-0 h-1/2 bg-bg ${leaving ? "-translate-y-full" : ""}`} />
      <div className={`curtain absolute inset-x-0 bottom-0 h-1/2 bg-bg ${leaving ? "translate-y-full" : ""}`} />
      <div
        className={`curtain absolute top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent shadow-[0_0_20px_#e879f9] ${leaving ? "scale-x-150 opacity-0" : ""}`}
        style={{ width: `${pct}%`, left: `${(100 - pct) / 2}%` }}
      />

      <div className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-300 sm:p-10 ${leaving ? "opacity-0" : "opacity-100"}`}>
        <div className="flex items-center justify-between font-mono text-xs tracking-[0.3em] text-muted uppercase">
          <span>{profile.fullName}</span>
          <span className="hidden sm:inline">{t.titleEdition}</span>
        </div>

        <div className="text-center">
          <p className="font-display text-gradient text-4xl font-bold sm:text-6xl" aria-live="polite">
            <span key={word} className="anim-rise inline-block">
              {word}
            </span>
          </p>
          <p className="mt-3 font-mono text-[11px] tracking-[0.35em] text-subtle uppercase">{t.titleClick}</p>
        </div>

        <div className="flex items-end justify-between">
          <span className="font-mono text-xs text-subtle">{profile.role}</span>
          <span className="font-display text-[clamp(5rem,18vw,14rem)] leading-[0.8] font-bold text-ink tabular-nums">
            {String(pct).padStart(3, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
