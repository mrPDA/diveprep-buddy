import { useEffect, useId, useRef, useState } from 'react'
import { useAppStore } from '@/app/store'
import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@/i18n/types'
import { useTranslation } from '@/i18n/useTranslation'

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9M12 3c-2.5 2.7-4 6-4 9s1.5 6.3 4 9" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={[
        'h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform duration-200',
        open ? 'rotate-180' : '',
      ].join(' ')}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 text-sky-400" aria-hidden>
      <path
        d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z"
        fill="currentColor"
      />
    </svg>
  )
}

export function LanguageSwitcher() {
  const locale = useAppStore((s) => s.locale)
  const setLocale = useAppStore((s) => s.setLocale)
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const selectLocale = (code: Locale) => {
    setLocale(code)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className={[
          'flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400',
          open
            ? 'border-sky-400/60 bg-slate-800 text-slate-50 shadow-[0_0_0_1px_rgba(56,189,248,0.15)]'
            : 'border-slate-600 bg-slate-800 text-slate-200 hover:border-slate-500 hover:text-slate-50',
        ].join(' ')}
      >
        <GlobeIcon />
        <span className="uppercase tracking-wide">{locale}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          className={[
            'absolute right-0 z-50 mt-2 min-w-[11.5rem] origin-top-right',
            'animate-[lang-menu-in_150ms_ease-out]',
          ].join(' ')}
        >
          <ul
            id={listId}
            role="listbox"
            aria-label={t('language.label')}
            aria-activedescendant={`${listId}-${locale}`}
            className="overflow-hidden rounded-xl border border-slate-600 bg-slate-800 py-1 shadow-xl shadow-black/50 ring-1 ring-white/5"
          >
            {SUPPORTED_LOCALES.map((code) => {
              const selected = code === locale
              return (
                <li key={code} role="presentation">
                  <button
                    id={`${listId}-${code}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => selectLocale(code)}
                    className={[
                      'flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-base transition-colors',
                      'focus-visible:bg-slate-700 focus-visible:outline-none',
                      selected
                        ? 'bg-sky-400/10 text-sky-300'
                        : 'text-slate-200 hover:bg-slate-700/70',
                    ].join(' ')}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      {selected ? <CheckIcon /> : null}
                    </span>
                    <span className="font-medium">{LOCALE_LABELS[code]}</span>
                    <span
                      className={[
                        'ml-auto rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider',
                        selected
                          ? 'bg-sky-400/15 text-sky-400'
                          : 'bg-slate-700/80 text-slate-500',
                      ].join(' ')}
                    >
                      {code}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
