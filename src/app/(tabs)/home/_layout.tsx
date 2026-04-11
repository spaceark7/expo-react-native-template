import { AvatarAction } from '@/components/ui/avatar-action'
import { useTheme } from '@/hooks/use-theme'
import { Stack, router } from 'expo-router'

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
        headerRight() {
          return (
            <AvatarAction
              onPress={() => {
                router.push('/profile')
              }}
            />
          )
        }
      }}
    />
  )
}