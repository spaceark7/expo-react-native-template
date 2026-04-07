import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { ThemedText } from '../themed-text'
import { ThemedView } from '../themed-view'

type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'success'
  | 'neutral'
  | 'outline'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  style?: ViewStyle
}

export default function Badge({
  variant = 'primary',
  children,
  style
}: BadgeProps) {
  const { theme } = useTheme()

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.primaryContainer
        }
      case 'secondary':
        return {
          backgroundColor: theme.secondaryContainer
        }
      case 'tertiary':
        return {
          backgroundColor: theme.tertiaryContainer
        }
      case 'error':
        return {
          backgroundColor: theme.errorContainer
        }
      case 'success':
        return {
          backgroundColor: theme.success + '20' // 20% opacity
        }
      case 'neutral':
        return {
          backgroundColor: theme.surfaceContainerHighest
        }
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.outline
        }
      default:
        return {
          backgroundColor: theme.primaryContainer
        }
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return theme.onPrimaryContainer
      case 'secondary':
        return theme.onSecondaryContainer
      case 'tertiary':
        return theme.onTertiaryContainer
      case 'error':
        return theme.onErrorContainer
      case 'success':
        return theme.success
      case 'neutral':
        return theme.onSurface
      case 'outline':
        return theme.onSurface
      default:
        return theme.onPrimaryContainer
    }
  }

  return (
    <ThemedView style={[styles.badge, getVariantStyles(), style]}>
      <ThemedText style={[styles.text, { color: getTextColor() }]}>
        {children}
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 100,
    alignSelf: 'flex-start'
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16
  }
})
