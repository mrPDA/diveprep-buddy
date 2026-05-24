import type { ButtonHTMLAttributes } from 'react'

export function IconButton({
  label,
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={[
        'flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
