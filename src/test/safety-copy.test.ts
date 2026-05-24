import { describe, expect, it } from 'vitest'
import bundle from '@/content/content.bundle.json'
import {
  REQUIRED_DISCLAIMER_MARKERS,
  REQUIRED_SAFETY_FOOTER_MARKERS,
  collectUserFacingStrings,
  findForbiddenPhrases,
} from '@/test/safety-rules'

const LOCALES = ['en', 'ru'] as const

describe('safety copy in content bundle', () => {
  for (const locale of LOCALES) {
    describe(locale, () => {
      const ui = bundle.locales[locale].ui

      it('has required disclaimer markers', () => {
        const disclaimerText = [
          ui.disclaimer.title,
          ui.disclaimer.p1,
          ui.disclaimer.p2,
          ui.disclaimer.p3,
        ].join(' ')

        for (const marker of REQUIRED_DISCLAIMER_MARKERS[locale]) {
          expect(disclaimerText.toLowerCase()).toContain(marker.toLowerCase())
        }
      })

      it('has safety footer that denies authority', () => {
        const footer = ui.safety.footer
        for (const marker of REQUIRED_SAFETY_FOOTER_MARKERS[locale]) {
          expect(footer.toLowerCase()).toContain(marker.toLowerCase())
        }
      })

      it('accept button is present', () => {
        expect(ui.disclaimer.accept.length).toBeGreaterThan(0)
      })
    })
  }

  it('contains no forbidden phrases in user-facing strings', () => {
    const strings = collectUserFacingStrings({
      en: bundle.locales.en,
      ru: bundle.locales.ru,
    })
    const hits = findForbiddenPhrases(strings)
    expect(hits).toEqual([])
  })

  it('buddy-check steps use verify tone, not pass/fail authority', () => {
    for (const locale of LOCALES) {
      for (const step of bundle.locales[locale].buddyCheck.steps) {
        expect(step.prompt.toLowerCase()).not.toMatch(/\bis safe\b/)
        expect(step.title.toLowerCase()).not.toMatch(/guaranteed/)
      }
    }
  })

  it('summary copy avoids safety guarantees', () => {
    for (const locale of LOCALES) {
      const summary = bundle.locales[locale].ui.summary
      const text = collectUserFacingStrings(summary).join(' ')
      expect(text.toLowerCase()).not.toMatch(/safe to dive|guaranteed/)
    }
  })
})
