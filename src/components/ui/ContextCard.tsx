interface ContextCardProps {
  label: string
  description?: string
  selected: boolean
  onSelect: () => void
}

export function ContextCard({
  label,
  description,
  selected,
  onSelect,
}: ContextCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        'min-h-[72px] w-full rounded-2xl border-2 px-5 py-4 text-left transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400',
        selected
          ? 'border-sky-400 bg-slate-800'
          : 'border-slate-600 bg-slate-800/50 hover:border-slate-500',
      ].join(' ')}
    >
      <span className="block text-lg font-semibold text-slate-50">{label}</span>
      {description && (
        <span className="mt-1 block text-sm text-slate-400">{description}</span>
      )}
    </button>
  )
}

interface ToggleCardProps {
  label: string
  hint?: string
  active: boolean
  onToggle: () => void
  className?: string
}

export function ToggleCard({
  label,
  hint,
  active,
  onToggle,
  className = '',
}: ToggleCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={[
        'min-h-11 rounded-xl border px-4 py-3 text-left text-base font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400',
        active
          ? 'border-sky-400 bg-sky-400/10 text-sky-300'
          : 'border-slate-600 bg-slate-800/50 text-slate-200 hover:border-slate-500',
        className,
      ].join(' ')}
    >
      <span className="block">{label}</span>
      {active && hint ? (
        <span className="mt-1 block text-sm font-normal text-slate-400 transition-opacity duration-200">
          {hint}
        </span>
      ) : null}
    </button>
  )
}
