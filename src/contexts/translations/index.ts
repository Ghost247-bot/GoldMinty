import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { de } from './de';
import { zh } from './zh';
import { it } from './it';

export const translations = {
  en,
  fr,
  es,
  de,
  zh,
  it,
};

export type TranslationKey = keyof typeof en;
export type Language = keyof typeof translations;
