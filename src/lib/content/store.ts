import { create } from 'zustand'
import { categoryLabelFromUi } from '@/i18n/index'
import type { Locale } from '@/i18n/types'
import { getDefaultContentBundle } from '@/lib/content/defaults'
import type { AppMeta, ContentBundle } from '@/lib/content/types'
import {
  clearContentBundleOverride,
  getContentBundleOverride,
  saveContentBundleOverride,
} from '@/lib/storage/db'
import type { BuddyCheckStep, ChecklistCategory, ChecklistTemplate } from '@/types'

type TemplateMap = Record<string, ChecklistTemplate>

interface ContentState {
  ready: boolean
  bundle: ContentBundle
  isCustomized: boolean
  hydrateContent: () => Promise<void>
  getUi: (locale: Locale) => Record<string, unknown>
  getBuddyCheckSteps: (locale: Locale) => BuddyCheckStep[]
  getChecklistTemplates: (locale: Locale) => TemplateMap
  getAppMeta: () => AppMeta
  getCategoryLabel: (locale: Locale, category: ChecklistCategory) => string
  saveBundle: (bundle: ContentBundle) => Promise<void>
  resetToDefaults: () => Promise<void>
}

export const useContentStore = create<ContentState>((set, get) => ({
  ready: false,
  bundle: getDefaultContentBundle(),
  isCustomized: false,

  hydrateContent: async () => {
    const override = await getContentBundleOverride()
    const bundle = override ?? getDefaultContentBundle()
    set({ ready: true, bundle, isCustomized: Boolean(override) })
  },

  getUi: (locale) => get().bundle.locales[locale].ui,

  getBuddyCheckSteps: (locale) => get().bundle.locales[locale].buddyCheck.steps,

  getChecklistTemplates: (locale) => get().bundle.locales[locale].templates,

  getAppMeta: () => get().bundle.appMeta,

  getCategoryLabel: (locale, category) =>
    categoryLabelFromUi(get().bundle.locales[locale].ui, category),

  saveBundle: async (bundle) => {
    await saveContentBundleOverride(bundle)
    set({ bundle, isCustomized: true })
  },

  resetToDefaults: async () => {
    await clearContentBundleOverride()
    set({ bundle: getDefaultContentBundle(), isCustomized: false })
  },
}))
