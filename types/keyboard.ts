export interface TacticalShortcut {
  key: string;
  description: {
    es: string;
    en: string;
  };
  category: 'navigation' | 'audio' | 'gameplay';
  action: () => void;
}
