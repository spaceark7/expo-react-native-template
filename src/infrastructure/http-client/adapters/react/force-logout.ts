import { logout, resetAuthState } from '@/infrastructure/store/auth'
import { router } from 'expo-router'
import { Alert } from 'react-native'

export function forceLogout(): void {
  logout()
  resetAuthState()

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
