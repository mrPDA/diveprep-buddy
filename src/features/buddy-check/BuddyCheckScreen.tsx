import { useEffect, useState } from 'react'
import { useAppStore, useBuddyCheckSteps } from '@/app/store'
import {
  BuddyCheckProgressDots,
  BuddyCheckStepView,
} from '@/components/ui/BuddyCheckStepView'
import { TextLink } from '@/components/ui/TextLink'
import { SafetyFooter } from '@/components/ui/DisclaimerBanner'
import { useTranslation } from '@/i18n/useTranslation'
import type { BuddyCheckStep } from '@/types'

function findFirstIncompleteIndex(
  steps: BuddyCheckStep[],
  completed: string[],
): number {
  const idx = steps.findIndex((s) => !completed.includes(s.id))
  return idx < 0 ? 0 : idx
}

export function BuddyCheckScreen() {
  const checklist = useAppStore((s) => s.checklist)
  const buddyCheck = useAppStore((s) => s.buddyCheck)
  const completeBuddyStep = useAppStore((s) => s.completeBuddyStep)
  const finishBuddyCheck = useAppStore((s) => s.finishBuddyCheck)
  const setView = useAppStore((s) => s.setView)
  const buddyCheckSteps = useBuddyCheckSteps()
  const { t } = useTranslation()

  const [stepIndex, setStepIndex] = useState(() =>
    findFirstIncompleteIndex(buddyCheckSteps, buddyCheck.stepsCompleted),
  )

  useEffect(() => {
    if (!checklist) {
      setView('context')
    }
  }, [checklist, setView])

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
        <TextLink onClick={() => setView('checklist')}>
          {t('buddyCheck.backToChecklist')}
        </TextLink>
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
