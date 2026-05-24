import { useTranslation } from '@/i18n/useTranslation'
import type { ChecklistItemState } from '@/types'

interface ChecklistItemRowProps {
  item: ChecklistItemState
  onToggle: () => void
}

export function ChecklistItemRow({ item, onToggle }: ChecklistItemRowProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        'flex min-h-12 w-full min-w-0 items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400',
        item.completed ? 'bg-slate-800/80' : 'bg-slate-800 hover:bg-slate-750',
      ].join(' ')}
    >
      <span
        aria-hidden
        className={[
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2',
          item.completed
            ? 'border-sky-400 bg-sky-400 text-slate-900'
            : 'border-slate-500 bg-transparent',
        ].join(' ')}
      >
        {item.completed && (
          <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
            <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={[
            'block text-base font-medium',
            item.completed ? 'text-slate-400 line-through' : 'text-slate-100',
          ].join(' ')}
        >
          {item.label}
          {item.critical && (
            <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-amber-400">
              {t('checklist.critical')}
            </span>
          )}
        </span>
        {item.hint && (
          <span className="mt-1 block text-sm text-slate-400">{item.hint}</span>
        )}
      </span>
    </button>
  )
}

interface ChecklistCategorySectionProps {
  title: string
  children: React.ReactNode
}

export function ChecklistCategorySection({
  title,
  children,
}: ChecklistCategorySectionProps) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  )
}
