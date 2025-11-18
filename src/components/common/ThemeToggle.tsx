import React, { useEffect, useState, useCallback } from 'react'
import { Sun, Moon } from 'lucide-react'
import { getPreferredTheme, setTheme, type Theme } from '../../utils/theme'

interface ThemeToggleProps {
  className?: string
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    setThemeState(getPreferredTheme())
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${
        isDark
          ? 'bg-[#1E1E1E] border-[#2A2A2A] text-[rgba(255,255,255,0.87)] hover:bg-[#232323] focus:ring-[#BB86FC]'
          : 'bg-white border-secondary-200 text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-500'
      } ${className}`}
      aria-pressed={isDark}
      aria-label="Toggle dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Moon size={16} className="text-[rgba(255,255,255,0.87)]" />
      ) : (
        <Sun size={16} className="text-secondary-700" />
      )}
      <span className="text-sm font-medium">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  )
}

export default ThemeToggle
