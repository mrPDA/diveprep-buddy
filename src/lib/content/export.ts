import type { ContentBundle, LocaleContent } from '@/lib/content/types'

export function downloadContentBundle(bundle: ContentBundle, filename?: string): void {
  const name =
    filename ??
    `diveprep-content-${new Date().toISOString().slice(0, 10)}.json`
  const blob = new Blob([JSON.stringify(bundle, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isValidLocaleContent(value: unknown): value is LocaleContent {
  if (!isObject(value)) return false
  if (!isObject(value.ui)) return false
  if (!isObject(value.buddyCheck)) return false
  if (!Array.isArray((value.buddyCheck as Record<string, unknown>).steps)) {
    return false
  }
  if (!isObject(value.templates)) return false
  if (!isObject((value.templates as Record<string, unknown>).base)) return false
  const base = (value.templates as Record<string, unknown>).base
  if (!isObject(base) || !Array.isArray(base.items)) return false
  return true
}

export function parseImportedBundle(raw: string): ContentBundle {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Invalid content bundle')
  }

  if (!isObject(parsed)) throw new Error('Invalid content bundle')

  const appMeta = parsed.appMeta
  if (
    !isObject(appMeta) ||
    typeof appMeta.name !== 'string' ||
    appMeta.name.length === 0
  ) {
    throw new Error('Invalid content bundle')
  }

  const locales = parsed.locales
  if (!isObject(locales)) throw new Error('Invalid content bundle')
  if (!isValidLocaleContent(locales.en) || !isValidLocaleContent(locales.ru)) {
    throw new Error('Invalid content bundle')
  }

  return parsed as unknown as ContentBundle
}
