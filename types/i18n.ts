export type SupportedLocale = 'es' | 'en';

export interface LocaleMeta {
  code: SupportedLocale;
  name: string;
  flag: string;
}

export type TranslationRecord<T = string> = Record<SupportedLocale, T>;
