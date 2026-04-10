import {
  type ResolvedTheme,
  type ThemeMode,
  useGlobalConfigActions,
  useIsAppStoreHydrated,
  useResolvedTheme,
  useThemeMode
} from '@/infrastructure/store/global-config'
import * as NavigationBar from 'expo-navigation-bar'
import { colorScheme } from 'nativewind'
import React, { useEffect } from 'react'
import { useColorScheme as useRNColorScheme } from 'react-native'

type ThemeContextType = {
  themeMode: ThemeMode
  resolvedTheme: ResolvedTheme
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useRNColorScheme()
  const isStoreHydrated = useIsAppStoreHydrated()
  const resolvedTheme = useResolvedTheme()
  const { setSystemColorScheme } = useGlobalConfigActions()

  useEffect(() => {
    setSystemColorScheme(systemColorScheme === 'dark' ? 'dark' : 'light')
  }, [setSystemColorScheme, systemColorScheme])

  useEffect(() => {
    colorScheme.set(resolvedTheme)

    if (systemColorScheme === 'dark' && resolvedTheme === 'light') {
      NavigationBar.setStyle('inverted')
      return
    }

    NavigationBar.setStyle('auto')
  }, [resolvedTheme, systemColorScheme])

  if (!isStoreHydrated) {
    return null
  }

  return <>{children}</>
}

export function useThemeContext() {
  const themeMode = useThemeMode()
  const resolvedTheme = useResolvedTheme()
  const { setThemeMode } = useGlobalConfigActions()

  const toggleTheme = () => {
    setThemeMode(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  return {
    themeMode,
    resolvedTheme,
    setThemeMode,
    toggleTheme
  } satisfies ThemeContextType
}
