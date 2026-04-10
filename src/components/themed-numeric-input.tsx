import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'

import { responsiveFontSize, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

import { ThemedText } from './themed-text'
import { ThemedView } from './themed-view'

export type ThemedNumericInputProps = {
  value: number
  onValueChange: (value: number) => void
  label?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  error?: string
  helperText?: string
  size?: 'small' | 'medium' | 'large'
  showButtons?: boolean
}

export function ThemedNumericInput({
  value,
  onValueChange,
  label,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  disabled = false,
  error,
  helperText,
  size = 'medium',
  showButtons = true
}: ThemedNumericInputProps) {
  const { theme } = useTheme()
  const [inputValue, setInputValue] = useState(value.toString())
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString())
    }
  }, [isFocused, value])

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max)
    console.log(`Incrementing value to ${newValue}`) // Debug log
    onValueChange(newValue)
    setInputValue(newValue.toString())
  }

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min)
    onValueChange(newValue)
    setInputValue(newValue.toString())
  }

  const handleTextChange = (text: string) => {
    setInputValue(text)

    // Allow user to type freely, only validate the value
    const numValue = parseFloat(text)
    console.log(
      `User typed ${text} in numeric input, parsed value is ${numValue}`
    ) // Debug log
    if (!isNaN(numValue)) {
      // Don't clamp while typing - let them enter any number
      // This allows typing numbers like "100" when max is 999 without interruption
      onValueChange(numValue)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)

    // Clamp to valid range on blur
    const numValue = parseFloat(inputValue)
    if (isNaN(numValue) || inputValue.trim() === '') {
      // Reset to current value if invalid
      setInputValue(value.toString())
    } else {
      // Clamp the value to min/max range
      const clampedValue = Math.min(Math.max(numValue, min), max)
      setInputValue(clampedValue.toString())
      if (clampedValue !== value) {
        onValueChange(clampedValue)
      }
    }
  }

  const getButtonSize = (): number => {
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

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return responsiveFontSize('small')
      case 'medium':
        return responsiveFontSize('default')
      case 'large':
        return responsiveFontSize('medium')
      default:
        return responsiveFontSize('default')
    }
  }

  const buttonSize = getButtonSize()
  const fontSize = getFontSize()

  return (
    <ThemedView style={styles.wrapper}>
      {label && (
        <ThemedText type='small' style={styles.label}>
          {label}
        </ThemedText>
      )}

      <ThemedView style={styles.container}>
        {showButtons && (
          <Pressable
            disabled={disabled || value <= min}
            onPress={handleDecrement}>
            {({ pressed }) => (
              <View
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      disabled || value <= min
                        ? theme.backgroundElement
                        : pressed
                          ? theme.primary700
                          : theme.primary,
                    width: buttonSize,
                    height: buttonSize,
                    opacity: disabled || value <= min ? 0.5 : 1
                  }
                ]}>
                <ThemedText
                  style={[
                    styles.buttonText,
                    {
                      color:
                        disabled || value <= min ? theme.textSecondary : '#fff'
                    }
                  ]}>
                  −
                </ThemedText>
              </View>
            )}
          </Pressable>
        )}

        <ThemedView
          style={[
            styles.inputContainer,
            {
              borderColor: error ? theme.danger : theme.backgroundSelected,
              backgroundColor: disabled
                ? theme.backgroundElement
                : theme.background,
              height: buttonSize
            }
          ]}>
          <TextInput
            value={inputValue}
            onChangeText={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            keyboardType='numeric'
            editable={!disabled}
            style={[
              styles.input,
              {
                color: theme.text,
                fontSize: fontSize,
                paddingVertical: size === 'small' ? Spacing.one : Spacing.two
              }
            ]}
            textAlign='center'
          />
        </ThemedView>

        {showButtons && (
          <Pressable
            disabled={disabled || value >= max}
            onPress={handleIncrement}>
            {({ pressed }) => (
              <View
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      disabled || value >= max
                        ? theme.backgroundElement
                        : pressed
                          ? theme.primary700
                          : theme.primary,
                    width: buttonSize,
                    height: buttonSize,
                    opacity: disabled || value >= max ? 0.5 : 1
                  }
                ]}>
                <ThemedText
                  style={[
                    styles.buttonText,
                    {
                      color:
                        disabled || value >= max ? theme.textSecondary : '#fff'
                    }
                  ]}>
                  +
                </ThemedText>
              </View>
            )}
          </Pressable>
        )}
      </ThemedView>

      {error && (
        <ThemedText type='small' style={[styles.helperText, styles.errorText]}>
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

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  label: {
    marginBottom: Spacing.one,
    fontWeight: '600'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two
  },
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600'
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: Spacing.two
  },
  input: {
    fontWeight: '600'
  },
  helperText: {
    marginTop: Spacing.one,
    marginLeft: Spacing.one
  },
  errorText: {
    color: '#B00020'
  }
})
