export interface RadarAxis {
  key: string;
  label: {
    es: string;
    en: string;
  };
  value: number; // 0 to 100
  description: {
    es: string;
    en: string;
  };
}

export interface RadarPoint {
  x: number;
  y: number;
}
