export type MilestoneType = 'academic' | 'work' | 'certification';

export interface TimelineMilestone {
  id: string;
  type: MilestoneType;
  title: {
    es: string;
    en: string;
  };
  institution: string;
  period: string;
  location: string;
  description: {
    es: string;
    en: string;
  };
  achievements: {
    es: string[];
    en: string[];
  };
  technologies: string[];
}
