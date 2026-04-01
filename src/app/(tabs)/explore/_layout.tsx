import { ThemedView } from '@/components/themed-view'
import { useTheme } from '@/hooks/use-theme'
import { Stack } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index'
}

export default function Layout() {
  const { theme } = useTheme()

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTitleStyle: { color: theme.text, fontWeight: 'bold' },
        title: 'Buku Belanja',
        headerTintColor: theme.text,
        headerRight({ tintColor }) {
          //Mock Avatar
          return (
            <ThemedView
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: tintColor
              }}
            />
          )
        }
      }}
    />
  )
}
