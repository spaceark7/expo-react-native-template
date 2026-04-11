import { ThemeProvider as AppThemeProvider } from '@/contexts/theme-context'
import { useIsAuthenticated } from '@/infrastructure/store/auth'
import { Stack } from 'expo-router'
import '../global.css'

export default function Layout() {
  return (
    <AppThemeProvider>
      <RootNavigator />
    </AppThemeProvider>
  )
}

function RootNavigator() {
  const isAuthenticated = useIsAuthenticated()

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='auth/index' />
      <Stack.Screen name='+not-found' />

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='profile' />
      </Stack.Protected>
    </Stack>
  )
}
