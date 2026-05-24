import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-sky-400 text-slate-900 hover:bg-sky-300 active:bg-sky-500 disabled:bg-slate-600 disabled:text-slate-400',
  secondary:
    'bg-slate-700 text-slate-100 hover:bg-slate-600 active:bg-slate-800 disabled:bg-slate-800 disabled:text-slate-500',
  ghost:
    'bg-transparent text-sky-400 hover:bg-slate-800 active:bg-slate-700 disabled:text-slate-500',
}

export function Button({
  variant = 'primary',
  children,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={[
        'min-h-11 rounded-xl px-5 py-3 text-base font-semibold transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400',
        variants[variant],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
