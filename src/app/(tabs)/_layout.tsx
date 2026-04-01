import { ThemeProvider } from '@react-navigation/native'
import React from 'react'

import { AnimatedSplashOverlay } from '@/components/animated-icon'
import AppTabs from '@/components/app-tabs'
import { Colors } from '@/constants/theme'
import { ThemeProvider as AppThemeProvider } from '@/contexts/theme-context'
import { useTheme } from '@/hooks/use-theme'

function TabLayoutContent() {
  const { lightTheme, darkTheme, theme } = useTheme()
  const isDark = theme === Colors.dark

  return (
    <ThemeProvider value={isDark ? darkTheme : lightTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  )
}

export default function TabLayout() {
  return (
    <AppThemeProvider>
      <TabLayoutContent />
    </AppThemeProvider>
  )
}
