const THEME_COLOR_DARK = '#0f172a'
const THEME_COLOR_SUNLIGHT = '#ffffff'

export function applySunlightMode(enabled: boolean): void {
  const root = document.documentElement
  root.dataset.theme = enabled ? 'sunlight' : 'default'
  root.style.colorScheme = enabled ? 'light' : 'dark'

  const meta = document.querySelector('meta[name="theme-color"]')
  meta?.setAttribute('content', enabled ? THEME_COLOR_SUNLIGHT : THEME_COLOR_DARK)
}
