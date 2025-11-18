const STORAGE_KEY = 'digcity-theme'

export type Theme = 'light' | 'dark'

export const getStoredTheme = (): Theme | null => {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    if (t === 'light' || t === 'dark') return t
    return null
  } catch {
    return null
  }
}

export const getPreferredTheme = (): Theme => {
  const stored = getStoredTheme()
  if (stored) return stored
  // Fallback to system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

export const applyThemeClass = (theme: Theme) => {
  const root = document.documentElement
  if (!root) return
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const setTheme = (theme: Theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {}
  applyThemeClass(theme)
}

export const initializeTheme = () => {
  const theme = getPreferredTheme()
  applyThemeClass(theme)
}

