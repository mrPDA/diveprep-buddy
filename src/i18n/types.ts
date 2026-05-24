import { getDefaultContentBundle } from '@/lib/content/defaults'

export type Locale = 'en' | 'ru'

const fallbackConfig = {
  default: 'en' as Locale,
  supported: [
    { code: 'en' as Locale, label: 'English' },
    { code: 'ru' as Locale, label: 'Русский' },
  ],
}

function getLocalesConfig() {
  return getDefaultContentBundle().localesConfig ?? fallbackConfig
}

export const DEFAULT_LOCALE = getLocalesConfig().default

export const SUPPORTED_LOCALES = getLocalesConfig().supported.map(
  (entry) => entry.code,
) as Locale[]

export const LOCALE_LABELS = Object.fromEntries(
  getLocalesConfig().supported.map((entry) => [entry.code, entry.label]),
) as Record<Locale, string>

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE
  const lang = navigator.language.toLowerCase()
  for (const entry of getLocalesConfig().supported) {
    if (lang.startsWith(entry.code)) return entry.code
  }
  return DEFAULT_LOCALE
}
