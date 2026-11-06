export interface TestimonialEntry {
  id: string;
  author: string;
  role: {
    es: string;
    en: string;
  };
  organization: string;
  avatarInitials: string;
  rating: number;
  quote: {
    es: string;
    en: string;
  };
  endorsementType: 'academic' | 'peer' | 'client' | 'mentor';
}
