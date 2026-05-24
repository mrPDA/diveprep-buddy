import { useAppStore } from '@/app/store'
import { Button } from '@/components/ui/Button'
import { getVisibleChecklistItems } from '@/lib/checklist-display'
import { useTranslation } from '@/i18n/useTranslation'

export function SummaryScreen() {
  const checklist = useAppStore((s) => s.checklist)
  const setView = useAppStore((s) => s.setView)
  const startNewPreparation = useAppStore((s) => s.startNewPreparation)
  const { t } = useTranslation()

  const visibleItems = checklist ? getVisibleChecklistItems(checklist) : []
  const completedCount = visibleItems.filter((i) => i.completed).length
  const totalCount = visibleItems.length

  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-8 py-8 text-center">
      <div className="space-y-4">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-400/20"
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10 text-sky-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-50">{t('summary.title')}</h1>
        <p className="max-w-sm text-lg leading-relaxed text-slate-300">
          {t('summary.body')}
        </p>
        {checklist && (
          <p className="text-sm text-slate-400">
            {t('summary.stats', {
              completed: completedCount,
              total: totalCount,
            })}
          </p>
        )}
      </div>

      <div className="w-full max-w-sm space-y-3">
        <Button fullWidth onClick={startNewPreparation}>
          {t('summary.newDive')}
        </Button>
        {checklist && (
          <Button variant="secondary" fullWidth onClick={() => setView('checklist')}>
            {t('summary.reviewChecklist')}
          </Button>
        )}
      </div>
    </div>
  )
}
