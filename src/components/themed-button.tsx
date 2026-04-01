import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type ViewStyle
} from 'react-native'

import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

import { ThemedText } from './themed-text'

export type ThemedButtonProps = PressableProps & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
}

export function ThemedButton({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  style,
  ...rest
}: ThemedButtonProps) {
  const { theme } = useTheme()

  const isDisabled = disabled || loading

  const getBackgroundColor = (pressed: boolean): string => {
    if (isDisabled) {
      return theme.backgroundElement
    }

    switch (variant) {
      case 'primary':
        return pressed ? theme.primary700 : theme.primary
      case 'secondary':
        return pressed ? theme.backgroundSelected : theme.backgroundElement
      case 'outline':
        return pressed ? theme.backgroundElement : 'transparent'
      case 'ghost':
        return pressed ? theme.backgroundElement : 'transparent'
      case 'danger':
        return pressed ? '#8B0017' : theme.danger
      case 'success':
        return pressed ? '#2B5509' : theme.success
      default:
        return pressed ? theme.primary700 : theme.primary
    }
  }

  const getTextColor = (): string => {
    if (isDisabled) {
      return theme.textSecondary
    }

    switch (variant) {
      case 'primary':
      case 'danger':
      case 'success':
        return '#ffffff'
      case 'secondary':
      case 'outline':
      case 'ghost':
        return theme.text
      default:
        return '#ffffff'
    }
  }

  const getBorderStyle = (): ViewStyle => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: isDisabled ? theme.backgroundSelected : theme.primary
      }
    }
    return {}
  }

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: Spacing.one,
          paddingHorizontal: Spacing.three,
          minHeight: 32
        }
      case 'medium':
        return {
          paddingVertical: Spacing.two,
          paddingHorizontal: Spacing.four,
          minHeight: 44
        }
      case 'large':
        return {
          paddingVertical: Spacing.three,
          paddingHorizontal: Spacing.five,
          minHeight: 56
        }
      default:
        return {
          paddingVertical: Spacing.two,
          paddingHorizontal: Spacing.four,
          minHeight: 44
        }
    }
  }

  const getTextSize = (): 'small' | 'default' | 'smallBold' => {
    switch (size) {
      case 'small':
        return 'small'
      case 'medium':
        return 'default'
      case 'large':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <Pressable
      disabled={isDisabled}
      style={(state) => {
        const customStyle = typeof style === 'function' ? style(state) : style
        return [
          styles.button,
          {
            backgroundColor: getBackgroundColor(state.pressed),
            opacity: isDisabled ? 0.5 : 1
          },
          getBorderStyle(),
          getSizeStyles(),
          customStyle
        ]
      }}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <ThemedText
          style={[styles.text, { color: getTextColor() }]}
          type={getTextSize()}>
          {children}
        </ThemedText>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flexDirection: 'row'
  },
  text: {
    fontWeight: '600',
    textAlign: 'center'
  }
})
