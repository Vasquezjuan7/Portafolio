"use client";

import { useEffect, useRef, useState } from "react";
import { X, Check, Lock, ArrowRight } from "lucide-react";
import { ACHIEVEMENTS, MAX_XP, useGame } from "./GameProvider";
import { resetSave } from "./store";
import { sfx } from "./sfx";
import CvButton from "../CvButton";
import { LANGS } from "../../data/portfolio";

type Tab = "logros" | "ajustes";

function Toggle({ label, hint, on, onChange }: { label: string; hint: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-line px-4 py-3 text-left transition-colors hover:border-primary/60"
    >
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-subtle">{hint}</span>
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-gradient-to-r from-violet-600 to-fuchsia-500" : "bg-subtle/40"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}

/** Menú de comandos: navegación, logros y ajustes. */
export default function PauseMenu() {
  const { pauseOpen, setPauseOpen, save, xp, current, travel, setSound, setFx, setLight, setLang, lang, c, t } = useGame();
  const { chapters } = c;
  const [tab, setTab] = useState<Tab>("logros");
  const firstRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!pauseOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [pauseOpen]);

  if (!pauseOpen) return null;

  return (
    <div
      className="anim-fade fixed inset-0 z-[80] overflow-y-auto bg-black/70 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label={t.menu}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setPauseOpen(false);
      }}
    >
      <div className="relative mx-auto my-16 grid max-w-5xl gap-6 px-5 lg:grid-cols-[1fr_1.2fr]" onMouseDown={(e) => e.target === e.currentTarget && setPauseOpen(false)}>
        <div className="panel glow-border anim-pop p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs tracking-[0.3em] text-primary-ink uppercase">{t.navigation}</p>
            <button type="button" onClick={() => setPauseOpen(false)} className="btn btn-ghost inline-flex h-8 w-8 p-0 lg:hidden" aria-label={t.closeMenu}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <ol className="mt-4 space-y-1">
            {chapters.map((ch, i) => {
              const active = current === ch.id;
              return (
                <li key={ch.id}>
                  <button
                    ref={i === 0 ? firstRef : undefined}
                    type="button"
                    onClick={() => travel(ch.id)}
                    onMouseEnter={() => sfx.hover()}
                    className={`group flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-all ${active ? "bg-primary/15" : "hover:bg-white/5"}`}
                  >
                    <span className="w-6 font-mono text-xs text-subtle group-hover:text-primary-ink">{String(i).padStart(2, "0")}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-ink">{ch.title}</span>
                    </span>
                    {save.discovered.includes(ch.id) && <Check className="h-3.5 w-3.5 text-primary-ink" aria-label={t.visited} />}
                    <ArrowRight className="h-4 w-4 -translate-x-1 text-primary-ink opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ol>
          <CvButton className="btn btn-primary mt-5 w-full px-5 py-3 text-sm" />
          <div className="mt-2 grid grid-cols-3 gap-2">
            <CvButton mode="view" iconClass="h-3.5 w-3.5" className="btn btn-ghost px-3 py-2.5 text-xs" />
            {LANGS.map((l) => (
              <CvButton key={l} lang={l} label={`${t.cvIn} ${l.toUpperCase()}`} iconClass="h-3.5 w-3.5" className="btn btn-ghost px-3 py-2.5 text-xs" />
            ))}
          </div>
        </div>

        <div className="panel anim-pop p-6" style={{ animationDelay: "0.06s" }}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1 rounded-full border border-line p-1" role="tablist">
              {(
                [
                  ["logros", `${t.achievementsTab} ${save.achievements.length}/${ACHIEVEMENTS.length}`],
                  ["ajustes", t.settingsTab],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => {
                    sfx.click();
                    setTab(id);
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${tab === id ? "bg-primary/25 text-ink" : "text-muted hover:text-ink"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setPauseOpen(false)} className="btn btn-ghost hidden h-8 px-3 text-xs lg:inline-flex" aria-label={t.closeMenu}>
              <X className="h-3.5 w-3.5" /> Esc
            </button>
          </div>

          <div className="mt-5" role="tabpanel">
            {tab === "logros" && (
              <>
                <div className="mb-4">
                  <div className="mb-1.5 flex justify-between font-mono text-[11px] text-subtle">
                    <span>{t.exploreProgress}</span>
                    <span className="text-primary-ink">{Math.round((xp / MAX_XP) * 100)}%</span>
                  </div>
                  <div className="bar">
                    <span style={{ width: `${(xp / MAX_XP) * 100}%` }} />
                  </div>
                </div>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {ACHIEVEMENTS.map((a) => {
                    const got = save.achievements.includes(a.id);
                    const hidden = a.id === "secreto" && !got;
                    return (
                      <li key={a.id} className={`flex items-center gap-3 rounded-xl border p-3 ${got ? "border-primary/40 bg-primary/10" : "border-line opacity-60"}`}>
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg ${got ? "bg-primary/20" : "bg-white/5"}`} aria-hidden="true">
                          {got ? a.icon : <Lock className="h-4 w-4 text-subtle" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-ink">{hidden ? t.hiddenAchievement : t.achievements[a.id].title}</span>
                          <span className="block truncate text-xs text-subtle">{hidden ? "???" : t.achievements[a.id].detail}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {tab === "ajustes" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
                  <span>
                    <span className="block text-sm font-semibold text-ink">{t.settingLang.label}</span>
                    <span className="block text-xs text-subtle">{t.settingLang.hint}</span>
                  </span>
                  <span className="flex shrink-0 gap-1 rounded-full border border-line p-1" role="group" aria-label={t.settingLang.label}>
                    {LANGS.map((l) => (
                      <button
                        key={l}
                        type="button"
                        aria-pressed={lang === l}
                        onClick={() => setLang(l)}
                        className={`rounded-full px-3 py-1 font-mono text-xs font-semibold transition-colors ${lang === l ? "bg-primary/25 text-ink" : "text-muted hover:text-ink"}`}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </span>
                </div>
                <Toggle label={t.settingLight.label} hint={t.settingLight.hint} on={save.light} onChange={setLight} />
                <Toggle label={t.settingSound.label} hint={t.settingSound.hint} on={save.sound} onChange={setSound} />
                <Toggle label={t.settingFx.label} hint={t.settingFx.hint} on={save.fx} onChange={setFx} />
                <button
                  type="button"
                  onClick={() => {
                    sfx.back();
                    resetSave();
                  }}
                  className="pt-3 text-xs text-subtle underline underline-offset-4 hover:text-ink"
                >
                  {t.resetProgress}
                </button>
                <p className="pt-4 text-xs text-subtle">
                  {t.shortcuts}: <span className="kbd">Esc</span> {t.or} <span className="kbd">Ctrl K</span> {t.shortcutsMenu} · <span className="kbd">1</span>
                  <span className="kbd">2</span>
                  <span className="kbd">3</span> {t.shortcutsArena} · <span className="kbd">←</span>
                  <span className="kbd">→</span> {t.shortcutsAllies}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
