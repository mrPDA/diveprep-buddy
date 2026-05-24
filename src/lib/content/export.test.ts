import { describe, expect, it } from 'vitest'
import bundle from '@/content/content.bundle.json'
import type { ContentBundle } from '@/lib/content/types'
import { parseImportedBundle } from '@/lib/content/export'

describe('parseImportedBundle', () => {
  it('accepts valid bundle JSON', () => {
    const parsed = parseImportedBundle(JSON.stringify(bundle)) as ContentBundle
    expect(parsed.appMeta.name).toBe(bundle.appMeta.name)
    expect(parsed.locales.en.ui.disclaimer.title).toBeTruthy()
  })

  it('rejects invalid bundle', () => {
    expect(() => parseImportedBundle('{}')).toThrow('Invalid content bundle')
    expect(() => parseImportedBundle('{ "appMeta": {} }')).toThrow(
      'Invalid content bundle',
    )
  })
})
