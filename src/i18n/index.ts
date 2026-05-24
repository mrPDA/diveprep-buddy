import en from '@/i18n/locales/en'
import ru from '@/i18n/locales/ru'
import type { Locale } from '@/i18n/types'
import type { ChecklistCategory } from '@/types'

type Messages = Record<string, unknown>

const messages: Record<Locale, Messages> = { en, ru }

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const value = getNestedValue(messages[locale] as Record<string, unknown>, key)
  if (typeof value !== 'string') return key

  if (!params) return value

  return Object.entries(params).reduce(
    (text, [param, replacement]) =>
      text.replaceAll(`{{${param}}}`, String(replacement)),
    value,
  )
}

export function categoryLabel(locale: Locale, category: ChecklistCategory): string {
  return translate(locale, `checklist.categories.${category}`)
}

export function applyDocumentLocale(locale: Locale): void {
  document.documentElement.lang = locale
}
