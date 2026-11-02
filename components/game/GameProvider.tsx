"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { CHAPTER_IDS, CONTENT, type ChapterId, type Content, type Lang } from "../../data/portfolio";
import { UI, type Dict } from "../../data/i18n";
import { THEME } from "../../data/theme";
import { getSave, getServerSave, subscribe, updateSave, type SaveData } from "./store";
import { setSoundEnabled, sfx } from "./sfx";

export const ACHIEVEMENTS = [
  { id: "inicio", icon: "⚡" },
  { id: "curioso", icon: "🔍" },
  { id: "guardado", icon: "💾" },
  { id: "dialogo", icon: "💬" },
  { id: "cazador", icon: "🐞" },
  { id: "explorador", icon: "🛰️" },
  { id: "senal", icon: "📡" },
  { id: "secreto", icon: "⬆️" },
] as const;

export type AchievementId = (typeof ACHIEVEMENTS)[number]["id"];

export interface Toast {
  id: number;
  icon: string;
  kicker: string;
  title: string;
  text?: string;
}

export interface Banner {
  title: string;
  subtitle?: string;
  tone?: "win" | "fail" | "secret";
}

const XP_PER_CHAPTER = 100;
const XP_PER_ACHIEVEMENT = 250;
export const MAX_XP = CHAPTER_IDS.length * XP_PER_CHAPTER + ACHIEVEMENTS.length * XP_PER_ACHIEVEMENT;

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

interface GameContextValue {
  save: SaveData;
  world: typeof THEME;
  xp: number;
  current: ChapterId;
  toasts: Toast[];
  banner: Banner | null;
  pauseOpen: boolean;
  setPauseOpen: (open: boolean) => void;
  setSound: (on: boolean) => void;
  setFx: (on: boolean) => void;
  setLight: (on: boolean) => void;
  setLang: (lang: Lang) => void;
  lang: Lang;
  /** Contenido del portafolio en el idioma actual. */
  c: Content;
  /** Textos de la interfaz en el idioma actual. */
  t: Dict;
  unlock: (id: AchievementId) => void;
  pushToast: (toast: Omit<Toast, "id">) => void;
  showBanner: (banner: Banner) => void;
  travel: (id: ChapterId) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function introSeen() {
  return typeof document !== "undefined" && document.documentElement.getAttribute("data-intro") === "seen";
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const save = useSyncExternalStore(subscribe, getSave, getServerSave);
  const [current, setCurrent] = useState<ChapterId>("inicio");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [pauseOpen, setPauseOpenState] = useState(false);
  const toastId = useRef(0);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lang = save.lang;
  const c = CONTENT[lang];
  const t = UI[lang];
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-fx", save.fx ? "on" : "off");
    if (save.light) html.setAttribute("data-theme", "light");
    else html.removeAttribute("data-theme");
    html.lang = lang;
    setSoundEnabled(save.sound);
  }, [save.fx, save.sound, save.light, lang]);

  const pushToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200);
  }, []);

  const showBanner = useCallback((next: Banner) => {
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    setBanner(next);
    bannerTimer.current = setTimeout(() => setBanner(null), 3000);
  }, []);

  const unlock = useCallback(
    (id: AchievementId) => {
      if (getSave().achievements.includes(id)) return;
      updateSave((s) => ({ achievements: [...s.achievements, id] }));
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      if (!a) return;
      sfx.achievement();
      const txt = tRef.current;
      pushToast({ icon: a.icon, kicker: txt.achievementUnlocked, title: txt.achievements[id].title, text: txt.achievements[id].detail });
    },
    [pushToast],
  );

  const setSound = useCallback((on: boolean) => {
    setSoundEnabled(on);
    updateSave({ sound: on });
    if (on) sfx.select();
  }, []);

  const setFx = useCallback((on: boolean) => {
    sfx.click();
    updateSave({ fx: on, fxChosen: true });
  }, []);

  const setLight = useCallback((on: boolean) => {
    sfx.click();
    updateSave({ light: on });
  }, []);

  const setLang = useCallback((next: Lang) => {
    sfx.click();
    updateSave({ lang: next });
  }, []);

  const setPauseOpen = useCallback((open: boolean) => {
    if (open) sfx.select();
    else sfx.back();
    setPauseOpenState(open);
  }, []);

  const travel = useCallback((id: ChapterId) => {
    sfx.click();
    setPauseOpenState(false);
    document.getElementById(id)?.scrollIntoView({ behavior: getSave().fx ? "smooth" : "auto", block: "start" });
  }, []);

  // Sección actual + secciones recorridas.
  useEffect(() => {
    const sections = CHAPTER_IDS.map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id as ChapterId;
          setCurrent(id);
          if (!introSeen()) continue;
          const s = getSave();
          if (s.discovered.includes(id)) continue;
          updateSave({ discovered: [...s.discovered, id] });
          if (getSave().discovered.length === CHAPTER_IDS.length) unlock("explorador");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [unlock]);

  // Luz que sigue al cursor sobre las tarjetas (.panel-hover).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest?.<HTMLElement>(".panel-hover");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  // Teclado: ESC o Ctrl/⌘+K abren el menú; código secreto.
  useEffect(() => {
    let konami: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      const cmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if ((e.key === "Escape" || cmdK) && introSeen() && !document.querySelector("[data-modal-open]")) {
        if (cmdK) e.preventDefault();
        setPauseOpenState((open) => {
          if (open) sfx.back();
          else sfx.select();
          return !open;
        });
      }
      if (typing) return;
      konami = [...konami, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length);
      if (konami.join() === KONAMI.join()) {
        konami = [];
        unlock("secreto");
        showBanner({ ...tRef.current.secretBanner, tone: "secret" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlock, showBanner]);

  const xp = save.discovered.length * XP_PER_CHAPTER + save.achievements.length * XP_PER_ACHIEVEMENT;

  const value = useMemo<GameContextValue>(
    () => ({
      save,
      world: THEME,
      xp,
      current,
      toasts,
      banner,
      pauseOpen,
      setPauseOpen,
      setSound,
      setFx,
      setLight,
      setLang,
      lang,
      c,
      t,
      unlock,
      pushToast,
      showBanner,
      travel,
    }),
    [save, xp, current, toasts, banner, pauseOpen, setPauseOpen, setSound, setFx, setLight, setLang, lang, c, t, unlock, pushToast, showBanner, travel],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame debe usarse dentro de GameProvider");
  return ctx;
}
