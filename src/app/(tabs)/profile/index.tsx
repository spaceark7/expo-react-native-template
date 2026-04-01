import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import React from 'react'

export default function Profile() {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type='title'>Profile Screen</ThemedText>
    </ThemedView>
  )
}
