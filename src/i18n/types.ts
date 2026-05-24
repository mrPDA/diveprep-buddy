export type Locale = 'en' | 'ru'

export const DEFAULT_LOCALE: Locale = 'en'

export const SUPPORTED_LOCALES: Locale[] = ['en', 'ru']

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
}

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE
  const lang = navigator.language.toLowerCase()
  if (lang.startsWith('ru')) return 'ru'
  return DEFAULT_LOCALE
}
