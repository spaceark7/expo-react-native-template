import { router } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

import { ThemedButton } from '@/components/themed-button'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Card } from '@/components/ui/card'
import { Spacing } from '@/constants/theme'
import { useIsAuthenticated } from '@/infrastructure/store/auth'

export default function NotFoundScreen() {
  const isAuthenticated = useIsAuthenticated()

  return (
    <ThemedView type='background' style={styles.screen}>
      <Card borderLeft style={styles.card}>
        <ThemedText type='subtitle'>Page Not Found</ThemedText>
        <ThemedText type='small' themeColor='textSecondary'>
          The route you opened does not exist in this boilerplate. Use one of
          the actions below to recover.
        </ThemedText>

        <ThemedView style={styles.actions}>
          <ThemedButton variant='primary' onPress={() => router.replace('/')}>
            Go To Entry Screen
          </ThemedButton>

          {isAuthenticated && (
            <ThemedButton
              variant='outline'
              onPress={() => router.replace('/(tabs)/home')}>
              Go To Main App
            </ThemedButton>
          )}
        </ThemedView>
      </Card>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.four
  },
  card: {
    gap: Spacing.two
  },
  actions: {
    gap: Spacing.two
  }
})