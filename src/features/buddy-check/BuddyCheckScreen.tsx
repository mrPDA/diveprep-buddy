import { useEffect, useState } from 'react'
import { useAppStore, useBuddyCheckSteps } from '@/app/store'
import {
  BuddyCheckProgressDots,
  BuddyCheckStepView,
} from '@/components/ui/BuddyCheckStepView'
import { SafetyFooter } from '@/components/ui/DisclaimerBanner'
import { useTranslation } from '@/i18n/useTranslation'

export function BuddyCheckScreen() {
  const checklist = useAppStore((s) => s.checklist)
  const buddyCheck = useAppStore((s) => s.buddyCheck)
  const completeBuddyStep = useAppStore((s) => s.completeBuddyStep)
  const finishBuddyCheck = useAppStore((s) => s.finishBuddyCheck)
  const setView = useAppStore((s) => s.setView)
  const buddyCheckSteps = useBuddyCheckSteps()
  const { t } = useTranslation()

  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (!checklist) {
      setView('context')
    }
  }, [checklist, setView])

  useEffect(() => {
    const firstIncomplete = buddyCheckSteps.findIndex(
      (s) => !buddyCheck.stepsCompleted.includes(s.id),
    )
    if (firstIncomplete >= 0) {
      setStepIndex(firstIncomplete)
    }
  }, [buddyCheck.stepsCompleted, buddyCheckSteps])

  if (!checklist) return null

  const step = buddyCheckSteps[stepIndex]
  if (!step) return null

  const confirmed = buddyCheck.stepsCompleted.includes(step.id)

  const handleConfirm = () => {
    completeBuddyStep(step.id)
  }

  const handleNext = () => {
    if (stepIndex < buddyCheckSteps.length - 1) {
      setStepIndex(stepIndex + 1)
    } else {
      finishBuddyCheck()
    }
  }

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1)
    }
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      <header className="mb-6">
        <button
          type="button"
          onClick={() => setView('checklist')}
          className="text-sm text-sky-400 hover:text-sky-300"
        >
          {t('buddyCheck.backToChecklist')}
        </button>
        <h1 className="mt-2 text-2xl font-bold text-slate-50">
          {t('buddyCheck.title')}
        </h1>
        <p className="mt-1 text-slate-400">{t('buddyCheck.subtitle')}</p>
      </header>

      <BuddyCheckStepView
        step={step}
        stepIndex={stepIndex}
        totalSteps={buddyCheckSteps.length}
        confirmed={confirmed}
        onConfirm={handleConfirm}
        onNext={handleNext}
        onBack={handleBack}
      />

      <BuddyCheckProgressDots
        total={buddyCheckSteps.length}
        current={stepIndex}
      />

      <SafetyFooter />
    </div>
  )
}
