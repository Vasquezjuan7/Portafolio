export type SfxIdentifier = 
  | 'click' 
  | 'hover' 
  | 'attack' 
  | 'defend' 
  | 'ultimate' 
  | 'victory' 
  | 'defeat' 
  | 'pause' 
  | 'resume';

export interface ProceduralToneConfig {
  frequency: number;
  endFrequency?: number;
  duration: number;
  type: OscillatorType;
  gain: number;
}
