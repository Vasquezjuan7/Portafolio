export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedByDefault?: boolean;
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: 'first_contact', title: 'Primer Enlace', description: 'Iniciaste el sistema y entraste al portafolio.', icon: '⚡', xpReward: 100 },
  { id: 'lore_master', title: 'Explorador de Código', description: 'Leíste la filosofía y expediente completo.', icon: '📜', xpReward: 150 },
  { id: 'mission_complete', title: 'Inspector de Misiones', description: 'Revisaste todos los proyectos en producción.', icon: '🚀', xpReward: 200 },
  { id: 'bug_crusher', title: 'Exterminador de Bugs', description: 'Derrotaste al Bug de Producción en la Arena.', icon: '👾', xpReward: 300 },
  { id: 'cv_collector', title: 'Documentación Oficial', description: 'Descargaste la hoja de vida en PDF.', icon: '📄', xpReward: 150 },
  { id: 'theme_shifter', title: 'Cromático', description: 'Alternaste entre los temas claro y oscuro.', icon: '🌓', xpReward: 100 },
  { id: 'polyglot', title: 'Bilingüe Táctico', description: 'Cambiaste el idioma a inglés y viceversa.', icon: '🌐', xpReward: 100 },
  { id: 'secret_code', title: 'Hacker de Élite', description: 'Ingresaste el código Konami en el teclado.', icon: '🕹️', xpReward: 500 },
];
