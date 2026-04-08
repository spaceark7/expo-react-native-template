import { router } from 'expo-router'
import { Alert } from 'react-native'
import { useAuthStore } from './auth-store'

export function forceLogout(): void {
  const { logout, resetState } = useAuthStore.getState()

  logout()
  resetState()

  Alert.alert(
    'Session Expired',
    'Your session has expired. Please log in again.',
    [
      {
        text: 'OK',
        onPress: () => {
          router.replace('/')
        }
      }
    ],
    { cancelable: false }
  )
}
