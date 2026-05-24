import { lazy, Suspense, useEffect } from 'react'
import { useAppStore } from '@/app/store'
import { DisclaimerModal } from '@/components/ui/DisclaimerBanner'
import { IconButton } from '@/components/ui/IconButton'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { OfflineIndicator } from '@/components/ui/OfflineIndicator'
import { isAdminEnabled } from '@/lib/env'
import { useContentStore } from '@/lib/content/store'
import { useTranslation } from '@/i18n/useTranslation'
import { BuddyCheckScreen } from '@/features/buddy-check/BuddyCheckScreen'
import { ChecklistScreen } from '@/features/checklist/ChecklistScreen'
import { ContextScreen } from '@/features/context/ContextScreen'
import { SummaryScreen } from '@/features/summary/SummaryScreen'

const AdminScreen = lazy(() =>
  import('@/features/admin/AdminScreen').then((m) => ({ default: m.AdminScreen })),
)

function AppShell() {
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const hydrated = useAppStore((s) => s.hydrated)
  const disclaimerAcceptedAt = useAppStore((s) => s.disclaimerAcceptedAt)
  const acceptDisclaimer = useAppStore((s) => s.acceptDisclaimer)
  const hydrate = useAppStore((s) => s.hydrate)
  const contentReady = useContentStore((s) => s.ready)
  const hydrateContent = useContentStore((s) => s.hydrateContent)
  const appMeta = useContentStore((s) => s.getAppMeta())
  const { t } = useTranslation()

  useEffect(() => {
    async function init() {
      await hydrateContent()
      await hydrate()
    }
    void init()
  }, [hydrate, hydrateContent])

  useEffect(() => {
    if (contentReady) {
      document.title = appMeta.name
    }
  }, [contentReady, appMeta.name])

  useEffect(() => {
    if (!isAdminEnabled && view === 'admin') {
      setView('context')
    }
  }, [view, setView])

  if (!contentReady || !hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center app-safe-shell">
        <p className="text-slate-400">{t('app.loading')}</p>
      </div>
    )
  }

  const showDisclaimer =
    !disclaimerAcceptedAt && !(isAdminEnabled && view === 'admin')

  return (
    <>
      <div className="app-safe-shell mx-auto flex min-h-dvh max-w-lg flex-col">
        <OfflineIndicator />
        <header className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-sky-400">
              {appMeta.shortName || 'DivePrep'}
            </span>
            <span className="text-lg text-slate-400">Buddy</span>
          </div>
          <div className="flex items-center gap-2">
            {isAdminEnabled && (
              <IconButton
                label={t('admin.title')}
                onClick={() => setView(view === 'admin' ? 'context' : 'admin')}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconButton>
            )}
            {view !== 'admin' && <LanguageSwitcher />}
          </div>
        </header>

        <main className="flex flex-1 flex-col">
          {view === 'context' && <ContextScreen />}
          {view === 'checklist' && <ChecklistScreen />}
          {view === 'buddy-check' && <BuddyCheckScreen />}
          {view === 'summary' && <SummaryScreen />}
          {isAdminEnabled && view === 'admin' && (
            <Suspense fallback={<p className="text-slate-400">{t('app.loading')}</p>}>
              <AdminScreen />
            </Suspense>
          )}
        </main>
      </div>

      {showDisclaimer && (
        <DisclaimerModal onAccept={() => void acceptDisclaimer()} />
      )}
    </>
  )
}

export default AppShell
