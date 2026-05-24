import { useAppStore } from '@/app/store'
import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@/i18n/types'
import { useTranslation } from '@/i18n/useTranslation'

export function LanguageSwitcher() {
  const locale = useAppStore((s) => s.locale)
  const setLocale = useAppStore((s) => s.setLocale)
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="locale-select" className="sr-only">
        {t('language.label')}
      </label>
      <select
        id="locale-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="min-h-9 rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
      >
        {SUPPORTED_LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </div>
  )
}
