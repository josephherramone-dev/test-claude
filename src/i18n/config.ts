/**
 * Internationalisation settings.
 *
 * French is the only published locale today. The layout already uses logical
 * CSS properties (ms/me, ps/pe, start/end) and reads `dir` from here, so adding
 * Arabic (RTL) or English means:
 *   1. adding the locale to `locales` below,
 *   2. creating `src/i18n/dictionaries/<locale>.ts` with the same shape as `fr.ts`,
 *   3. moving pages under `src/app/[locale]/` (see README › Internationalisation).
 */
export const locales = ["fr"] as const;
export const plannedLocales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];
export type AnyLocale = Locale | (typeof plannedLocales)[number];

export const defaultLocale: Locale = "fr";

export const localeDirection: Record<AnyLocale, "ltr" | "rtl"> = {
  fr: "ltr",
  en: "ltr",
  ar: "rtl",
};

export const localeHtmlLang: Record<AnyLocale, string> = {
  fr: "fr-MA",
  en: "en",
  ar: "ar-MA",
};
