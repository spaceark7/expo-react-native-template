import { AnimatedSplashOverlay } from '@/components/animated-icon'
import AppTabs from '@/components/app-tabs'
import { Colors } from '@/constants/theme'
import { TabBarProvider } from '@/contexts/tabbar-context'
import { useTheme } from '@/hooks/use-theme'
import { ThemeProvider } from '@react-navigation/native'

export default function TabLayoutContent() {
  const { lightTheme, darkTheme, theme } = useTheme()
  const isDark = theme === Colors.dark

  return (
    <ThemeProvider value={isDark ? darkTheme : lightTheme}>
      <TabBarProvider>
        <AnimatedSplashOverlay />
        <AppTabs />
      </TabBarProvider>
    </ThemeProvider>
  )
}
