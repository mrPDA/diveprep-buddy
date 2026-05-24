import type { Locale } from '@/i18n/types'
import { useContentStore } from '@/lib/content/store'

export function getChecklistTemplates(locale: Locale) {
  return useContentStore.getState().getChecklistTemplates(locale)
}

export function getBuddyCheckSteps(locale: Locale) {
  return useContentStore.getState().getBuddyCheckSteps(locale)
}
