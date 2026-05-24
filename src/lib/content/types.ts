import type { Locale } from '@/i18n/types'
import type { BuddyCheckStep, ChecklistTemplate } from '@/types'

export interface AppMeta {
  name: string
  shortName: string
  description: string
  themeColor: string
  backgroundColor: string
}

export interface LocaleContent {
  ui: Record<string, unknown>
  buddyCheck: { version: number; steps: BuddyCheckStep[] }
  templates: Record<string, ChecklistTemplate>
}

export interface ContentBundle {
  version: number
  updatedAt?: string
  appMeta: AppMeta
  localesConfig?: {
    default: Locale
    supported: Array<{ code: Locale; label: string }>
  }
  locales: Record<Locale, LocaleContent>
}

export const CONTENT_BUNDLE_VERSION = 1
