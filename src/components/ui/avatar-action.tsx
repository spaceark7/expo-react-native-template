import { useTheme } from '@/hooks/use-theme'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ViewStyle } from 'react-native'
import { ThemedButton } from '../themed-button'

export function AvatarAction({
  style,
  onPress
}: {
  style?: ViewStyle
  onPress?: () => void
}) {
  const { theme } = useTheme()
  return (
    <ThemedButton
      variant='ghost'
      iconOnly
      size='small'
      onPress={onPress || (() => router.push('/profile'))}
      style={[
        {
          borderRadius: 16
        },
        style
      ]}>
      <MaterialIcons name='account-circle' size={32} color={theme.text} />
    </ThemedButton>
  )
}
