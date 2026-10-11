import { defaultLocale, type Locale } from "./config";
import { fr, type Dictionary } from "./dictionaries/fr";

const dictionaries: Record<Locale, Dictionary> = { fr };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}

/** Default-locale dictionary for components that are not locale-aware yet. */
export const t = dictionaries[defaultLocale];
