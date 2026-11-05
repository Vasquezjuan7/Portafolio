export type SectionId = 
  | 'hero' 
  | 'profile' 
  | 'missions' 
  | 'story' 
  | 'arena' 
  | 'allies' 
  | 'contact';

export interface NavLink {
  id: SectionId;
  label: string;
  icon: string;
  chapterNumber: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface NavigationState {
  activeSection: SectionId;
  scrollProgress: number;
  isNavOpen: boolean;
}
