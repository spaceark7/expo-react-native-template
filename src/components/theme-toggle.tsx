import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet } from 'react-native'

import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

import { ThemedButton } from './themed-button'
import { ThemedText } from './themed-text'
import { ThemedView } from './themed-view'

type ThemeToggleProps = {
  showLabel?: boolean
}

export function ThemeToggle({ showLabel = true }: ThemeToggleProps) {
  const { themeMode, setThemeMode, theme } = useTheme()

  const modes = [
    { value: 'light' as const, icon: 'sunny-outline', label: 'Light' },
    { value: 'dark' as const, icon: 'moon-outline', label: 'Dark' },
    {
      value: 'system' as const,
      icon: 'phone-portrait-outline',
      label: 'System'
    }
  ]

  return (
    <ThemedView style={styles.container}>
      {showLabel && (
        <ThemedText type='small' style={styles.label}>
          Theme
        </ThemedText>
      )}
      <ThemedView style={styles.buttonGroup}>
        {modes.map((mode) => (
          <ThemedButton
            key={mode.value}
            variant={themeMode === mode.value ? 'primary' : 'outline'}
            size='medium'
            onPress={() => setThemeMode(mode.value)}
            style={styles.button}
            leftIcon={<Ionicons name={mode.icon as any} size={20} />}>
            {mode.label}
          </ThemedButton>
        ))}
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  label: {
    marginBottom: Spacing.two,
    fontWeight: '600'
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.two
  },
  button: {
    flex: 1
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one
  },
  buttonText: {
    fontWeight: '600'
  }
})
