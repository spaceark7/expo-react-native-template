import { useTheme } from '@/hooks/use-theme'
import { MaterialIcons } from '@expo/vector-icons'
import { ViewStyle } from 'react-native'
import { ThemedView } from '../themed-view'

export function AvatarAction({ style }: { style?: ViewStyle }) {
  const { theme } = useTheme()
  return (
    <ThemedView
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        ...style
      }}>
      <MaterialIcons name='person' size={16} color={theme.text} />
    </ThemedView>
  )
}
