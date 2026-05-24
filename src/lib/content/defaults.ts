import appMeta from '@/content/app-meta.json'
import enBuddyCheck from '@/content/locales/en/buddy-check.json'
import enUi from '@/content/locales/en/ui.json'
import ruBuddyCheck from '@/content/locales/ru/buddy-check.json'
import ruUi from '@/content/locales/ru/ui.json'
import { loadTemplatesFromModules } from '@/lib/checklist-engine'
import type { Locale } from '@/i18n/types'
import type { ChecklistTemplate } from '@/types'
import {
  CONTENT_BUNDLE_VERSION,
  type ContentBundle,
  type LocaleContent,
} from '@/lib/content/types'

const templateModules = import.meta.glob('../../content/locales/*/templates/*.json', {
  eager: true,
}) as Record<string, { default: ChecklistTemplate }>

function templatesForLocale(locale: Locale): Record<string, ChecklistTemplate> {
  const prefix = `/locales/${locale}/templates/`
  const filtered = Object.fromEntries(
    Object.entries(templateModules).filter(([path]) => path.includes(prefix)),
  )
  return loadTemplatesFromModules(filtered)
}

function localeContent(locale: Locale): LocaleContent {
  const templates = templatesForLocale(locale)
  const buddyCheck = locale === 'en' ? enBuddyCheck : ruBuddyCheck
  const ui = locale === 'en' ? enUi : ruUi
  return {
    ui: structuredClone(ui) as Record<string, unknown>,
    buddyCheck: structuredClone(buddyCheck),
    templates: structuredClone(templates),
  }
}

export function getDefaultContentBundle(): ContentBundle {
  return {
    version: CONTENT_BUNDLE_VERSION,
    appMeta: structuredClone(appMeta),
    locales: {
      en: localeContent('en'),
      ru: localeContent('ru'),
    },
  }
}

export const TEMPLATE_IDS = [
  'base',
  'boat',
  'shore',
  'night',
  'cold-water',
  'photo',
  'travel',
  'training',
] as const
