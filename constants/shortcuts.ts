export const KEYBOARD_SHORTCUTS = [
  { key: 'M', action: 'toggleMinimap', label: 'Abrir/Cerrar Minimapa' },
  { key: 'K', action: 'toggleSound', label: 'Silenciar/Activar SFX' },
  { key: 'T', action: 'toggleTheme', label: 'Cambiar Modo Claro/Oscuro' },
  { key: 'Escape', action: 'togglePause', label: 'Menú de Pausa' },
  { key: '1-7', action: 'navigateChapter', label: 'Saltar a Capítulo' },
] as const;
