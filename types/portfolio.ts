export type ProjectCategory = 'Fullstack' | 'Frontend' | 'WebGL 3D' | 'Tooling';

export interface MediaCapture {
  id: string;
  title: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface ProjectData {
  id: string;
  title: string;
  category: ProjectCategory;
  description: {
    es: string;
    en: string;
  };
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  demoVideo?: string;
  captures: MediaCapture[];
  featured: boolean;
}
