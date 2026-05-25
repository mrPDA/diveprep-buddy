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

  it('rejects malformed JSON', () => {
    expect(() => parseImportedBundle('not json')).toThrow('Invalid content bundle')
  })

  it('rejects locale missing required sections', () => {
    const broken = {
      appMeta: { name: 'X', shortName: '', description: '', themeColor: '', backgroundColor: '' },
      locales: {
        en: { ui: {}, buddyCheck: { version: 1, steps: [] }, templates: {} },
        ru: { ui: {}, buddyCheck: { version: 1, steps: [] }, templates: {} },
      },
    }
    expect(() => parseImportedBundle(JSON.stringify(broken))).toThrow(
      'Invalid content bundle',
    )
  })

  it('rejects bundle with empty appMeta.name', () => {
    const broken = {
      appMeta: { name: '' },
      locales: {
        en: { ui: {}, buddyCheck: { steps: [] }, templates: { base: { items: [] } } },
        ru: { ui: {}, buddyCheck: { steps: [] }, templates: { base: { items: [] } } },
      },
    }
    expect(() => parseImportedBundle(JSON.stringify(broken))).toThrow(
      'Invalid content bundle',
    )
  })
})
