import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n/useTranslation'
import type { BuddyCheckStep } from '@/types'

interface BuddyCheckStepViewProps {
  step: BuddyCheckStep
  stepIndex: number
  totalSteps: number
  confirmed: boolean
  onConfirm: () => void
  onNext: () => void
  onBack: () => void
}

export function BuddyCheckStepView({
  step,
  stepIndex,
  totalSteps,
  confirmed,
  onConfirm,
  onNext,
  onBack,
}: BuddyCheckStepViewProps) {
  const { t } = useTranslation()
  const isLast = stepIndex === totalSteps - 1

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-sky-400">
            {t('buddyCheck.step', {
              current: stepIndex + 1,
              total: totalSteps,
            })}
          </p>
          <h2 className="text-3xl font-bold text-slate-50">{step.title}</h2>
        </div>
        <p className="text-xl leading-relaxed text-slate-200">{step.prompt}</p>
      </div>

      <div className="mt-8 space-y-4">
        {!confirmed ? (
          <Button fullWidth onClick={onConfirm}>
            {step.confirmLabel}
          </Button>
        ) : (
          <Button fullWidth onClick={onNext}>
            {isLast ? t('buddyCheck.finish') : t('buddyCheck.next')}
          </Button>
        )}
        {stepIndex > 0 && (
          <Button variant="ghost" fullWidth onClick={onBack}>
            {t('buddyCheck.back')}
          </Button>
        )}
      </div>
    </div>
  )
}

export function BuddyCheckProgressDots({
  total,
  current,
}: {
  total: number
  current: number
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-4" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={[
            'h-2.5 w-2.5 rounded-full transition-colors',
            i <= current ? 'bg-sky-400' : 'bg-slate-600',
          ].join(' ')}
        />
      ))}
    </div>
  )
}
