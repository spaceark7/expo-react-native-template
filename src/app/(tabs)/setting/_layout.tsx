import { AvatarAction } from '@/components/ui/avatar-action'
import { useTheme } from '@/hooks/use-theme'
import { Stack, router } from 'expo-router'

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
          //Mock Avatar - Navigate to shared profile screen
          return <AvatarAction onPress={() => router.push('/profile')} />
        }
      }}
    />
  )
}
