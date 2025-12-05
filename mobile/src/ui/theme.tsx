import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const THEME_KEY = '@digcity_theme'

export type ThemeMode = 'dark' | 'light'

// Dark mode colors (default)
export const darkColors = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  primaryDark: '#1d4ed8',
  accent: '#7c3aed',
  accentLight: '#8b5cf6',
  bg: '#0f172a',
  bgDark: '#0a0f1a',
  card: '#111827',
  cardLight: '#1e293b',
  surface: '#1e293b',
  glass: 'rgba(30, 41, 59, 0.7)',
  glassDark: 'rgba(15, 23, 42, 0.8)',
  glassLight: 'rgba(51, 65, 85, 0.5)',
  glassBorder: 'rgba(148, 163, 184, 0.2)',
  text: '#f8fafc',
  textSecondary: '#e2e8f0',
  muted: '#94a3b8',
  mutedLight: '#cbd5e1',
  border: '#1f2937',
  borderLight: '#334155',
  success: '#10b981',
  successLight: '#34d399',
  successBg: 'rgba(16, 185, 129, 0.15)',
  danger: '#ef4444',
  dangerLight: '#f87171',
  dangerBg: 'rgba(239, 68, 68, 0.15)',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  warningBg: 'rgba(245, 158, 11, 0.15)',
  info: '#0ea5e9',
  infoLight: '#38bdf8',
  infoBg: 'rgba(14, 165, 233, 0.15)',
}

export const lightColors = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  primaryDark: '#1d4ed8',
  accent: '#7c3aed',
  accentLight: '#8b5cf6',
  bg: '#f8fafc',
  bgDark: '#f1f5f9',
  card: '#ffffff',
  cardLight: '#f8fafc',
  surface: '#f1f5f9',
  glass: 'rgba(255, 255, 255, 0.8)',
  glassDark: 'rgba(241, 245, 249, 0.9)',
  glassLight: 'rgba(255, 255, 255, 0.6)',
  glassBorder: 'rgba(148, 163, 184, 0.3)',
  text: '#0f172a',
  textSecondary: '#1e293b',
  muted: '#64748b',
  mutedLight: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#cbd5e1',
  success: '#059669',
  successLight: '#10b981',
  successBg: 'rgba(16, 185, 129, 0.1)',
  danger: '#dc2626',
  dangerLight: '#ef4444',
  dangerBg: 'rgba(239, 68, 68, 0.1)',
  warning: '#d97706',
  warningLight: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  info: '#0284c7',
  infoLight: '#0ea5e9',
  infoBg: 'rgba(14, 165, 233, 0.1)',
}

export const darkGradients = {
  primary: ['#2563eb', '#7c3aed'] as const,
  primarySoft: ['#1e40af', '#5b21b6'] as const,
  card: ['#0f172a', '#1e293b'] as const,
  cardDark: ['#0b1a3a', '#0e1f4a'] as const,
  glass: ['rgba(30, 41, 59, 0.9)', 'rgba(15, 23, 42, 0.8)'] as const,
  glassLight: ['rgba(51, 65, 85, 0.6)', 'rgba(30, 41, 59, 0.7)'] as const,
  success: ['#059669', '#10b981'] as const,
  danger: ['#dc2626', '#ef4444'] as const,
  hero: ['#1e3a8a', '#312e81', '#4c1d95'] as const,
  sunset: ['#f97316', '#ec4899'] as const,
}

export const lightGradients = {
  primary: ['#3b82f6', '#8b5cf6'] as const,
  primarySoft: ['#2563eb', '#7c3aed'] as const,
  card: ['#ffffff', '#f8fafc'] as const,
  cardDark: ['#f1f5f9', '#e2e8f0'] as const,
  glass: ['rgba(255, 255, 255, 0.95)', 'rgba(241, 245, 249, 0.9)'] as const,
  glassLight: ['rgba(255, 255, 255, 0.8)', 'rgba(248, 250, 252, 0.8)'] as const,
  success: ['#10b981', '#34d399'] as const,
  danger: ['#ef4444', '#f87171'] as const,
  hero: ['#3b82f6', '#6366f1', '#8b5cf6'] as const,
  sunset: ['#fb923c', '#f472b6'] as const,
}

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 }
export const borderRadius = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 }
export const shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 },
}
export const animation = { fast: 150, normal: 250, slow: 400 }
export const typography = {
  sizes: { xs: 11, sm: 13, base: 15, lg: 17, xl: 20, xxl: 24, xxxl: 32 },
  weights: { normal: '400' as const, medium: '500' as const, semibold: '600' as const, bold: '700' as const },
}

// Theme context
interface ThemeContextType {
  mode: ThemeMode
  colors: typeof darkColors
  gradients: typeof darkGradients
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark')

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') setMode(saved)
    }).catch(() => { })
  }, [])

  const toggleTheme = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark'
    setMode(newMode)
    AsyncStorage.setItem(THEME_KEY, newMode).catch(() => { })
  }

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode)
    AsyncStorage.setItem(THEME_KEY, newMode).catch(() => { })
  }

  const currentColors = mode === 'dark' ? darkColors : lightColors
  const currentGradients = mode === 'dark' ? darkGradients : lightGradients

  return (
    <ThemeContext.Provider value={{ mode, colors: currentColors, gradients: currentGradients, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Legacy exports for backward compatibility (screens not yet migrated to useTheme)
export const colors = darkColors
export const gradients = darkGradients
