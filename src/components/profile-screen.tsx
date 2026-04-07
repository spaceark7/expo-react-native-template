import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import React from 'react'

/**
 * Shared Profile Screen Component
 * Used across all tabs to maintain DRY principle
 */
export function ProfileScreen() {
  return (
    <ThemedView
      type='background'
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type='title'>Profile Screen</ThemedText>
      <ThemedText themeColor='textSecondary' style={{ marginTop: 16 }}>
        This is a shared component used across all tabs
      </ThemedText>
    </ThemedView>
  )
}
