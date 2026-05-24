import { useEffect } from 'react'
import { useAppStore } from '@/app/store'
import { Button } from '@/components/ui/Button'
import {
  ChecklistCategorySection,
  ChecklistItemRow,
  RentalChecklistSection,
} from '@/components/ui/ChecklistItemRow'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SafetyFooter } from '@/components/ui/DisclaimerBanner'
import {
  getRentalChecklistItems,
  getVisibleChecklistItems,
} from '@/lib/checklist-display'
import { isRentalChecklistItem } from '@/lib/checklist-engine'
import { useTranslation } from '@/i18n/useTranslation'
import type { ChecklistCategory } from '@/types'

const CATEGORY_ORDER: ChecklistCategory[] = [
  'core-gear',
  'safety',
  'exposure',
  'camera',
  'travel',
  'documents',
]

export function ChecklistScreen() {
  const checklist = useAppStore((s) => s.checklist)
  const toggleItem = useAppStore((s) => s.toggleItem)
  const setRentalSectionHidden = useAppStore((s) => s.setRentalSectionHidden)
  const resetChecklist = useAppStore((s) => s.resetChecklist)
  const setView = useAppStore((s) => s.setView)
  const startNewPreparation = useAppStore((s) => s.startNewPreparation)
  const { t, categoryLabel } = useTranslation()

  useEffect(() => {
    if (!checklist) {
      setView('context')
    }
  }, [checklist, setView])

  if (!checklist) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-16 text-center">
        <p className="text-lg text-slate-300">{t('checklist.emptyTitle')}</p>
        <p className="text-slate-400">{t('checklist.emptySubtitle')}</p>
        <Button onClick={() => setView('context')}>
          {t('checklist.emptyAction')}
        </Button>
      </div>
    )
  }

  const rentalItems = getRentalChecklistItems(checklist.items)
  const showRentalSection =
    checklist.context.rentalGear && rentalItems.length > 0
  const rentalHidden = checklist.rentalSectionHidden ?? false
  const visibleItems = getVisibleChecklistItems(checklist)

  const completed = visibleItems.filter((i) => i.completed).length
  const total = visibleItems.length
  const allComplete = completed === total

  const grouped = CATEGORY_ORDER.reduce<
    Record<ChecklistCategory, typeof checklist.items>
  >(
    (acc, cat) => {
      acc[cat] = checklist.items.filter(
        (item) => item.category === cat && !isRentalChecklistItem(item.id),
      )
      return acc
    },
    {} as Record<ChecklistCategory, typeof checklist.items>,
  )

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-50">
              {t('checklist.title')}
            </h1>
            <p className="mt-1 text-sm text-slate-400">{t('checklist.subtitle')}</p>
          </div>
          <Button variant="ghost" className="shrink-0" onClick={() => startNewPreparation()}>
            {t('checklist.changeContext')}
          </Button>
        </div>
        <ProgressBar completed={completed} total={total} />
      </header>

      <div className="space-y-6">
        {showRentalSection && (
          <RentalChecklistSection
            title={t('checklist.rentalSection.title')}
            hideLabel={t('checklist.rentalSection.hide')}
            hidden={rentalHidden}
            onHiddenChange={setRentalSectionHidden}
            items={rentalItems}
            onToggleItem={toggleItem}
          />
        )}

        {CATEGORY_ORDER.map((category) => {
          const items = grouped[category]
          if (items.length === 0) return null
          return (
            <ChecklistCategorySection
              key={category}
              title={categoryLabel(category)}
            >
              {items.map((item) => (
                <ChecklistItemRow
                  key={item.id}
                  item={item}
                  onToggle={() => toggleItem(item.id)}
                />
              ))}
            </ChecklistCategorySection>
          )
        })}
      </div>

      <div className="space-y-3 pb-4">
        <Button variant="secondary" fullWidth onClick={resetChecklist}>
          {t('checklist.reset')}
        </Button>
        <Button fullWidth onClick={() => setView('buddy-check')}>
          {allComplete ? t('checklist.startBuddyCheck') : t('checklist.continueBuddyCheck')}
        </Button>
        <SafetyFooter />
      </div>
    </div>
  )
}
