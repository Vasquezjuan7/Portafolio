// Preferencias y progreso del visitante en localStorage,
// expuestos como store externo para useSyncExternalStore.

import type { Lang } from "../../data/portfolio";

export interface SaveData {
  sound: boolean;
  fx: boolean;
  /** true si el visitante cambió las animaciones a mano en el menú. */
  fxChosen?: boolean;
  /** Tema claro (fondo blanco con acentos morados). */
  light: boolean;
  lang: Lang;
  achievements: string[];
  discovered: string[];
}

export const SAVE_KEY = "juan-portfolio-v2";
export const INTRO_KEY = "juan-portfolio-intro";

const DEFAULT_SAVE: SaveData = {
  sound: false,
  fx: true,
  light: false,
  lang: "es",
  achievements: [],
  discovered: [],
};

let save: SaveData = DEFAULT_SAVE;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      save = { ...DEFAULT_SAVE, ...(JSON.parse(raw) as Partial<SaveData>) };
      // Las animaciones solo se apagan si el visitante lo eligió en el menú.
      if (!save.fxChosen) save = { ...save, fx: true };
    }
    else {
      // Primera visita: idioma según el navegador.
      if (!navigator.language.toLowerCase().startsWith("es")) save = { ...save, lang: "en" };
    }
  } catch {
    // Almacenamiento no disponible: valores por defecto.
  }
}

export function getSave(): SaveData {
  load();
  return save;
}

export function getServerSave(): SaveData {
  return DEFAULT_SAVE;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function updateSave(patch: Partial<SaveData> | ((current: SaveData) => Partial<SaveData>)) {
  load();
  const next = typeof patch === "function" ? patch(save) : patch;
  save = { ...save, ...next };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // Ignorar errores de almacenamiento.
  }
  listeners.forEach((l) => l());
}

export function resetSave() {
  updateSave({ achievements: [], discovered: [] });
}

/** Se ejecuta antes de pintar: efectos, tema claro, idioma e intro ya vista (evita parpadeos). */
export const BOOT_SCRIPT = `(function(){try{var d=document.documentElement;var s=JSON.parse(localStorage.getItem("${SAVE_KEY}")||"{}");if(s.fx===false&&s.fxChosen)d.setAttribute("data-fx","off");if(s.light)d.setAttribute("data-theme","light");if(s.lang)d.lang=s.lang;if(sessionStorage.getItem("${INTRO_KEY}")==="1")d.setAttribute("data-intro","seen");}catch(e){}})();`;
