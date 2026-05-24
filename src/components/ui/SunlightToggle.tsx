import { useAppStore } from '@/app/store'
import { IconButton } from '@/components/ui/IconButton'
import { useTranslation } from '@/i18n/useTranslation'

export function SunlightToggle() {
  const sunlightMode = useAppStore((s) => s.sunlightMode)
  const setSunlightMode = useAppStore((s) => s.setSunlightMode)
  const { t } = useTranslation()

  return (
    <IconButton
      label={sunlightMode ? t('sunlight.off') : t('sunlight.on')}
      aria-pressed={sunlightMode}
      className={sunlightMode ? 'sunlight-toggle-active' : undefined}
      onClick={() => setSunlightMode(!sunlightMode)}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
  )
}
