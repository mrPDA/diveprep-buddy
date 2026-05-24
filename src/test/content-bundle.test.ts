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
        expect(ui.context.rentalGear).toBeTruthy()
        expect(ui.context.rentalGearHint).toBeTruthy()
        expect(ui.checklist.rentalSection.title).toBeTruthy()
        expect(ui.checklist.rentalSection.hide).toBeTruthy()
        expect(ui.checklist).toBeDefined()
        expect(ui.buddyCheck).toBeDefined()
        expect(ui.summary).toBeDefined()
        expect(ui.disclaimer).toBeDefined()
      })

      it('has rental template with stable item ids', () => {
        const rental = bundle.locales[locale].templates.rental
        expect(rental.items).toHaveLength(10)
        const ids = rental.items.map((item) => item.id)
        expect(ids).toEqual([
          'rental-mask-condition',
          'rental-bcd-hold-air',
          'rental-bcd-valves',
          'rental-reg-first-stage',
          'rental-reg-breathe',
          'rental-spg-needle',
          'rental-tank-visual',
          'rental-suit-condition',
          'rental-weights-condition',
          'rental-computer-battery',
        ])
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
        rentalGear: false,
      },
      bundle.locales.en.templates as Record<string, ChecklistTemplate>,
    )
    expect(items.length).toBeGreaterThan(10)
  })

  it('adds rental items when rentalGear is enabled', () => {
    const items = composeChecklist(
      {
        diveType: 'boat',
        coldWater: false,
        nightDive: false,
        photography: false,
        travel: false,
        training: false,
        rentalGear: true,
      },
      bundle.locales.en.templates as Record<string, ChecklistTemplate>,
    )
    expect(items.some((i) => i.id.startsWith('rental-'))).toBe(true)
    expect(items.filter((i) => i.id.startsWith('rental-'))).toHaveLength(10)
  })
})
