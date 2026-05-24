import { useTranslation } from '@/i18n/useTranslation'

interface ProgressBarProps {
  completed: number
  total: number
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const { t } = useTranslation()
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{t('checklist.progress')}</span>
        <span>
          {t('checklist.progressCount', { completed, total })}
        </span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-slate-700"
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={t('checklist.progressCount', { completed, total })}
      >
        <div
          className="h-full rounded-full bg-sky-400 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
