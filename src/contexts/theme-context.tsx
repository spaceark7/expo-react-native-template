import { APP_CONFIG } from '@/constants/config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as NavigationBar from 'expo-navigation-bar'
import { colorScheme } from 'nativewind'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useColorScheme as useRNColorScheme } from 'react-native'

type ThemeMode = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

type ThemeContextType = {
  themeMode: ThemeMode
  resolvedTheme: ResolvedTheme
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Safe AsyncStorage wrapper that handles when native module isn't available
try {
  if (!AsyncStorage) {
    console.warn(
      'AsyncStorage is not available. Theme preference will not persist across app restarts.'
    )
  }
} catch (e) {
  console.log('AsyncStorage not available, theme preference will not persist')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useRNColorScheme()
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system')
  const [isLoaded, setIsLoaded] = useState(false)

  const loadThemePreference = async () => {
    if (AsyncStorage) {
      try {
        const savedTheme = await AsyncStorage.getItem(
          APP_CONFIG.THEME_STORAGE_KEY
        )
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode)
          colorScheme.set(savedTheme as ResolvedTheme)
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error)
      }
    }
    setIsLoaded(true)
    if (systemColorScheme === 'dark' && themeMode === 'light') {
      NavigationBar.setStyle('inverted')
    } else {
      NavigationBar.setStyle('auto')
    }
  }

  const setThemeMode = async (mode: ThemeMode) => {
    if (AsyncStorage) {
      try {
        await AsyncStorage.setItem(APP_CONFIG.THEME_STORAGE_KEY, mode)
      } catch (error) {
        console.error('Failed to save theme preference:', error)
      }
    }
    setThemeModeState(mode)
    colorScheme.set(
      mode === 'system'
        ? systemColorScheme === 'dark'
          ? 'dark'
          : 'light'
        : mode
    )
  }

  const toggleTheme = () => {
    const newMode = resolvedTheme === 'light' ? 'dark' : 'light'
    setThemeMode(newMode)
  }

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference()
  }, [themeMode])

  // Resolve the actual theme based on mode and system preference
  const resolvedTheme: ResolvedTheme =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode

  // Don't render children until theme is loaded to prevent flash
  if (!isLoaded) {
    return null
  }

  return (
    <ThemeContext.Provider
      value={{ themeMode, resolvedTheme, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
