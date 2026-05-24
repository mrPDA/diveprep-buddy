import type { ChecklistCategory } from '@/types'

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

export function translateMessages(
  messages: Record<string, unknown>,
  key: string,
  params?: Record<string, string | number>,
): string {
  const value = getNestedValue(messages, key)
  if (typeof value !== 'string') return key

  if (!params) return value

  return Object.entries(params).reduce(
    (text, [param, replacement]) =>
      text.replaceAll(`{{${param}}}`, String(replacement)),
    value,
  )
}

export function categoryLabelFromUi(
  ui: Record<string, unknown>,
  category: ChecklistCategory,
): string {
  return translateMessages(ui, `checklist.categories.${category}`)
}

export function applyDocumentLocale(locale: string): void {
  document.documentElement.lang = locale
}
