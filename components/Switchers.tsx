"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { useGame } from "./game/GameProvider";

/** Botón ES / EN. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useGame();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "es" ? "en" : "es")}
      className={`btn btn-ghost h-9 gap-1 px-2.5 font-mono text-[11px] ${className}`}
      aria-label={t.langSwitch}
      title={t.langSwitch}
    >
      <Languages className="h-3.5 w-3.5" aria-hidden="true" />
      <span className={lang === "es" ? "text-ink" : "text-subtle"}>ES</span>
      <span className="text-subtle">/</span>
      <span className={lang === "en" ? "text-ink" : "text-subtle"}>EN</span>
    </button>
  );
}

/** Botón tema oscuro / claro. */
export function ThemeSwitch({ className = "" }: { className?: string }) {
  const { save, setLight, t } = useGame();
  const label = save.light ? t.themeToDark : t.themeToLight;
  const Icon = save.light ? Moon : Sun;
  return (
    <button
      type="button"
      onClick={() => setLight(!save.light)}
      className={`btn btn-ghost h-9 w-9 p-0 ${className}`}
      aria-label={label}
      aria-pressed={save.light}
      title={label}
    >
      <Icon key={String(save.light)} className="anim-pop h-4 w-4" aria-hidden="true" />
    </button>
  );
}
