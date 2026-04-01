import { Ionicons } from '@expo/vector-icons'
import React, { forwardRef, useState } from 'react'
import {
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  type ViewStyle
} from 'react-native'

import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

import { ThemedText } from './themed-text'
import { ThemedView } from './themed-view'

export type ThemedInputProps = TextInputProps & {
  label?: string
  error?: string
  helperText?: string
  variant?: 'outline' | 'filled'
  size?: 'small' | 'medium' | 'large'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const ThemedInput = forwardRef<TextInput, ThemedInputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'outline',
      size = 'medium',
      leftIcon,
      rightIcon,
      secureTextEntry,
      style,
      editable = true,
      ...rest
    },
    ref
  ) => {
    const { theme } = useTheme()
    const [showPassword, setShowPassword] = useState(false)
    const isPasswordField = secureTextEntry !== undefined

    const getInputHeight = (): number => {
      switch (size) {
        case 'small':
          return 36
        case 'medium':
          return 44
        case 'large':
          return 52
        default:
          return 44
      }
    }

    const getContainerStyle = (): ViewStyle => {
      const baseStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        minHeight: getInputHeight(),
        paddingHorizontal: Spacing.three
      }

      if (variant === 'outline') {
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: error ? theme.danger : theme.backgroundSelected,
          backgroundColor: editable ? theme.background : theme.backgroundElement
        }
      } else {
        return {
          ...baseStyle,
          backgroundColor: editable
            ? theme.backgroundElement
            : theme.backgroundSelected,
          borderWidth: error ? 1 : 0,
          borderColor: error ? theme.danger : 'transparent'
        }
      }
    }

    return (
      <ThemedView style={styles.wrapper}>
        {label && (
          <ThemedText type='small' style={styles.label}>
            {label}
          </ThemedText>
        )}

        <ThemedView style={[getContainerStyle()]}>
          {leftIcon && <ThemedView style={styles.icon}>{leftIcon}</ThemedView>}

          <TextInput
            ref={ref}
            editable={editable}
            secureTextEntry={isPasswordField ? !showPassword : secureTextEntry}
            style={[
              ...(Array.isArray(style) ? style : [style]),
              styles.input,
              {
                color: theme.text,
                flex: 1
              }
            ]}
            placeholderTextColor={theme.textSecondary}
            {...rest}
          />

          {isPasswordField && (
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.icon}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          )}

          {!isPasswordField && rightIcon && (
            <ThemedView style={styles.icon}>{rightIcon}</ThemedView>
          )}
        </ThemedView>

        {error && (
          <ThemedText
            type='small'
            style={[styles.helperText, styles.errorText]}>
            {error}
          </ThemedText>
        )}

        {!error && helperText && (
          <ThemedText
            type='small'
            themeColor='textSecondary'
            style={styles.helperText}>
            {helperText}
          </ThemedText>
        )}
      </ThemedView>
    )
  }
)

ThemedInput.displayName = 'ThemedInput'

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  label: {
    marginBottom: Spacing.one,
    fontWeight: '600'
  },
  input: {
    fontSize: 16,
    paddingVertical: Spacing.two
  },
  icon: {
    marginHorizontal: Spacing.one
  },
  helperText: {
    marginTop: Spacing.one,
    marginLeft: Spacing.one
  },
  errorText: {
    color: '#B00020'
  }
})
