import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  useColorScheme,
  View,
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
  children?: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  iconOnly?: boolean
  containerStyle?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
  textStyle?: StyleProp<TextStyle>
}

export function ThemedButton({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  leftIcon,
  rightIcon,
  iconOnly = false,
  containerStyle,
  textStyle,
  style,
  ...rest
}: ThemedButtonProps) {
  const { theme } = useTheme()
  const colorScheme = useColorScheme()

  const isDisabled = disabled || loading

  const getBackgroundColor = (pressed: boolean): string => {
    if (isDisabled) {
      return theme.backgroundElement
    }

    switch (variant) {
      case 'primary':
        return pressed ? theme.primary500 : theme.primaryContainer
      case 'success':
        return pressed ? theme.secondary500 : theme.secondaryContainer
      case 'outline':
        return pressed ? theme.backgroundElement : 'transparent'
      case 'ghost':
        return pressed ? theme.backgroundElement : 'transparent'
      case 'danger':
        return pressed ? '#8B0017' : theme.danger
      case 'secondary':
        return pressed ? theme.secondaryFixedDim : theme.secondaryFixed
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
        return '#ffffff'
      case 'success':
        return colorScheme === 'dark' ? theme.text : theme.onSecondary
      case 'secondary':
        return theme.onSecondaryFixed
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
    // Icon-only buttons should have minimal padding
    if (iconOnly) {
      switch (size) {
        case 'small':
          return {
            padding: Spacing.one,
            minHeight: 32,
            minWidth: 32
          }
        case 'medium':
          return {
            padding: Spacing.two,
            minHeight: 44,
            minWidth: 44
          }
        case 'large':
          return {
            padding: Spacing.three,
            minHeight: 56,
            minWidth: 56
          }
        default:
          return {
            padding: Spacing.two,
            minHeight: 44,
            minWidth: 44
          }
      }
    }

    // Regular buttons with text
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

  const cloneIconWithColor = (icon: React.ReactNode) => {
    if (!icon) return null
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        // @ts-ignore - color prop exists on icon components
        color: getTextColor()
      } as any)
    }
    return icon
  }

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={getTextColor()} />
    }

    // If iconOnly mode, render children directly (icon)
    if (iconOnly) {
      return children
    }

    // If children is a string or has text content
    const hasTextContent =
      typeof children === 'string' || typeof children === 'number'

    return (
      <View style={styles.content}>
        {leftIcon && (
          <View style={styles.iconLeft}>{cloneIconWithColor(leftIcon)}</View>
        )}

        {hasTextContent ? (
          <ThemedText
            style={[styles.text, { color: getTextColor() }, textStyle]}
            type={getTextSize()}>
            {children}
          </ThemedText>
        ) : (
          children
        )}

        {rightIcon && (
          <View style={styles.iconRight}>{cloneIconWithColor(rightIcon)}</View>
        )}
      </View>
    )
  }

  return (
    <Pressable
      disabled={isDisabled}
      style={
        typeof style === 'function'
          ? (state) => {
              const customStyle = style(state)
              return customStyle
            }
          : style
      }
      {...rest}>
      {(state) => (
        <View
          style={[
            styles.button,
            {
              backgroundColor: getBackgroundColor(state.pressed),
              opacity: isDisabled ? 0.5 : 1
            },
            getBorderStyle(),
            getSizeStyles(),
            typeof containerStyle === 'function'
              ? containerStyle(state)
              : containerStyle
          ]}>
          {renderContent()}
        </View>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontWeight: '600',
    textAlign: 'center'
  },
  iconLeft: {
    marginRight: Spacing.two
  },
  iconRight: {
    marginLeft: Spacing.two
  }
})
