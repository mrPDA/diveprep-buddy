import { loadTemplatesFromModules } from '@/lib/checklist-engine'
import type { Locale } from '@/i18n/types'
import type { BuddyCheckStep, ChecklistTemplate } from '@/types'
import enBuddyCheck from '@/content/locales/en/buddy-check.json'
import ruBuddyCheck from '@/content/locales/ru/buddy-check.json'

const templateModules = import.meta.glob('../content/locales/*/templates/*.json', {
  eager: true,
}) as Record<string, { default: ChecklistTemplate }>

export function getChecklistTemplates(
  locale: Locale,
): Record<string, ChecklistTemplate> {
  const prefix = `/locales/${locale}/templates/`
  const filtered = Object.fromEntries(
    Object.entries(templateModules).filter(([path]) => path.includes(prefix)),
  )
  return loadTemplatesFromModules(filtered)
}

const buddyCheckByLocale: Record<Locale, { steps: BuddyCheckStep[] }> = {
  en: enBuddyCheck,
  ru: ruBuddyCheck,
}

export function getBuddyCheckSteps(locale: Locale): BuddyCheckStep[] {
  return buddyCheckByLocale[locale].steps
}
