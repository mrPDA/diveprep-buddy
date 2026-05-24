import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n/useTranslation'

interface DisclaimerModalProps {
  onAccept: () => void
}

export function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
  const { t } = useTranslation()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 safe-overlay sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <h2 id="disclaimer-title" className="text-xl font-bold text-slate-50">
          {t('disclaimer.title')}
        </h2>
        <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-300">
          <p>{t('disclaimer.p1')}</p>
          <p>{t('disclaimer.p2')}</p>
          <p>{t('disclaimer.p3')}</p>
        </div>
        <Button fullWidth className="mt-6" onClick={onAccept}>
          {t('disclaimer.accept')}
        </Button>
      </div>
    </div>
  )
}

export function SafetyFooter() {
  const { t } = useTranslation()

  return (
    <p className="text-center text-xs text-slate-500">{t('safety.footer')}</p>
  )
}
