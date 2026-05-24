import { useAppStore } from '@/app/store'
import { useContentStore } from '@/lib/content/store'
import { translateMessages, categoryLabelFromUi } from '@/i18n'
import type { ChecklistCategory } from '@/types'

export function useTranslation() {
  const locale = useAppStore((s) => s.locale)
  const bundle = useContentStore((s) => s.bundle)

  const ui = bundle.locales[locale].ui

  return {
    locale,
    t: (key: string, params?: Record<string, string | number>) =>
      translateMessages(ui, key, params),
    categoryLabel: (category: ChecklistCategory) =>
      categoryLabelFromUi(ui, category),
  }
}
