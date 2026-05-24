import { useEffect, useState } from 'react'
import { useTranslation } from '@/i18n/useTranslation'

export function OfflineIndicator() {
  const { t } = useTranslation()
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null

  return (
    <div
      className="bg-amber-900/90 px-4 py-2 text-center text-sm text-amber-100"
      role="status"
    >
      {t('offline.banner')}
    </div>
  )
}
