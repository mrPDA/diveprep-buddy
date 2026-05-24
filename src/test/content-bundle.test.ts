import { describe, expect, it } from 'vitest'
import bundle from '@/content/content.bundle.json'
import { composeChecklist } from '@/lib/checklist-engine'
import { TEMPLATE_IDS } from '@/lib/content/defaults'
import type { ChecklistTemplate } from '@/types'

const LOCALES = ['en', 'ru'] as const

describe('content.bundle.json structure', () => {
  it('has app meta required for PWA', () => {
    expect(bundle.appMeta.name).toBeTruthy()
    expect(bundle.appMeta.shortName).toBeTruthy()
    expect(bundle.appMeta.description).toBeTruthy()
    expect(bundle.appMeta.themeColor).toMatch(/^#[0-9a-f]{6}$/i)
  })

  for (const locale of LOCALES) {
    describe(locale, () => {
      it('has all checklist templates', () => {
        for (const id of TEMPLATE_IDS) {
          expect(bundle.locales[locale].templates[id]?.items.length).toBeGreaterThan(0)
        }
      })

      it('has unique checklist item ids per template', () => {
        for (const id of TEMPLATE_IDS) {
          const items = bundle.locales[locale].templates[id].items
          const ids = items.map((item) => item.id)
          expect(new Set(ids).size).toBe(ids.length)
        }
      })

      it('has five buddy-check steps', () => {
        expect(bundle.locales[locale].buddyCheck.steps).toHaveLength(5)
      })

      it('has core UI sections', () => {
        const ui = bundle.locales[locale].ui
        expect(ui.context).toBeDefined()
        expect(ui.checklist).toBeDefined()
        expect(ui.buddyCheck).toBeDefined()
        expect(ui.summary).toBeDefined()
        expect(ui.disclaimer).toBeDefined()
      })
    })
  }

  it('generates non-empty checklist for typical boat + cold context', () => {
    const items = composeChecklist(
      {
        diveType: 'boat',
        coldWater: true,
        nightDive: false,
        photography: false,
        travel: false,
        training: false,
      },
      bundle.locales.en.templates as Record<string, ChecklistTemplate>,
    )
    expect(items.length).toBeGreaterThan(10)
  })
})
