import { useTheme } from '@/hooks/use-theme'
import { Stack } from 'expo-router'

export default function Layout() {
  const { theme } = useTheme()

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTitleStyle: { color: theme.text, fontWeight: 'bold' },
        title: 'Profile',
        headerTintColor: theme.text
      }}
    />
  )
}
