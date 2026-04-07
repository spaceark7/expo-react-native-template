import { StyleSheet, type ViewStyle } from 'react-native'

import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

import { ThemedView } from '../themed-view'

export type CardProps = {
  children: React.ReactNode
  style?: ViewStyle
  borderLeft?: boolean
}

export function Card({ children, style, borderLeft }: CardProps) {
  const { theme } = useTheme()

  return (
    <ThemedView
      style={[
        styles.card,
        { backgroundColor: theme.cardBackground },
        style,
        borderLeft && {
          borderLeftWidth: 4,
          borderLeftColor: theme.primary
        }
      ]}>
      {children}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3
  }
})
