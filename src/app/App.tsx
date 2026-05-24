import { useEffect } from 'react'
import { useAppStore } from '@/app/store'
import { DisclaimerModal } from '@/components/ui/DisclaimerBanner'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { OfflineIndicator } from '@/components/ui/OfflineIndicator'
import { useTranslation } from '@/i18n/useTranslation'
import { BuddyCheckScreen } from '@/features/buddy-check/BuddyCheckScreen'
import { ChecklistScreen } from '@/features/checklist/ChecklistScreen'
import { ContextScreen } from '@/features/context/ContextScreen'
import { SummaryScreen } from '@/features/summary/SummaryScreen'

function AppShell() {
  const view = useAppStore((s) => s.view)
  const hydrated = useAppStore((s) => s.hydrated)
  const disclaimerAcceptedAt = useAppStore((s) => s.disclaimerAcceptedAt)
  const acceptDisclaimer = useAppStore((s) => s.acceptDisclaimer)
  const hydrate = useAppStore((s) => s.hydrate)
  const { t } = useTranslation()

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-slate-400">{t('app.loading')}</p>
      </div>
    )
  }

  const showDisclaimer = !disclaimerAcceptedAt

  return (
    <>
      <OfflineIndicator />
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 py-6 sm:px-6">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-sky-400">DivePrep</span>
            <span className="text-lg text-slate-400">Buddy</span>
          </div>
          <LanguageSwitcher />
        </header>

        <main className="flex flex-1 flex-col">
          {view === 'context' && <ContextScreen />}
          {view === 'checklist' && <ChecklistScreen />}
          {view === 'buddy-check' && <BuddyCheckScreen />}
          {view === 'summary' && <SummaryScreen />}
        </main>
      </div>

      {showDisclaimer && (
        <DisclaimerModal onAccept={() => void acceptDisclaimer()} />
      )}
    </>
  )
}

export default AppShell
