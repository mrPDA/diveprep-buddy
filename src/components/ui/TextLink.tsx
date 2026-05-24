import type { ButtonHTMLAttributes } from 'react'

/** Min 44px tap target for back / secondary text actions */
export function TextLink({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={[
        'inline-flex min-h-11 items-center py-2 text-sm text-sky-400 hover:text-sky-300',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
