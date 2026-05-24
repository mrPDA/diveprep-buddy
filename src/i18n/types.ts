import localesConfig from '@/content/locales.config.json'

export type Locale = 'en' | 'ru'

export const DEFAULT_LOCALE = localesConfig.default as Locale

export const SUPPORTED_LOCALES = localesConfig.supported.map(
  (entry) => entry.code,
) as Locale[]

export const LOCALE_LABELS = Object.fromEntries(
  localesConfig.supported.map((entry) => [entry.code, entry.label]),
) as Record<Locale, string>

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE
  const lang = navigator.language.toLowerCase()
  for (const entry of localesConfig.supported) {
    if (lang.startsWith(entry.code)) return entry.code as Locale
  }
  return DEFAULT_LOCALE
}
