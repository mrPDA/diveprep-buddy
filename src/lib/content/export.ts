import type { ContentBundle } from '@/lib/content/types'

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
  anchor.click()
  URL.revokeObjectURL(url)
}

export function parseImportedBundle(raw: string): ContentBundle {
  const parsed = JSON.parse(raw) as ContentBundle
  if (!parsed?.appMeta || !parsed?.locales?.en || !parsed?.locales?.ru) {
    throw new Error('Invalid content bundle')
  }
  return parsed
}
