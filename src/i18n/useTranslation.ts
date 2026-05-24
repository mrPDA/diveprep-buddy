import { useAppStore } from '@/app/store'
import { categoryLabel, translate } from '@/i18n'
import type { ChecklistCategory } from '@/types'

export function useTranslation() {
  const locale = useAppStore((s) => s.locale)

  return {
    locale,
    t: (key: string, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    categoryLabel: (category: ChecklistCategory) =>
      categoryLabel(locale, category),
  }
}
