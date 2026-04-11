import { router } from 'expo-router'
import React from 'react'
import { Platform, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedButton } from '@/components/themed-button'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Card } from '@/components/ui/card'
import { BottomTabInset, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import { useAuth, useIsAuthenticated } from '@/infrastructure/store/auth'

const FEATURE_SECTIONS = [
  {
    title: 'Main App',
    description:
      'The protected tab app is the real boilerplate shell for shopping, explore, and settings.'
  },
  {
    title: 'Authentication',
    description:
      'A mocked sign-in flow uses useFetch and stores tokens in the shared auth state.'
  },
  {
    title: 'State Management',
    description:
      'The boilerplate includes shared Zustand state plus dynamic store demos for feature-level state.'
  },
  {
    title: 'Networking Demos',
    description:
      'The app already includes useFetch examples and mocked authenticated requests for testing flows.'
  }
] as const

export default function EntryScreen() {
  const safeAreaInsets = useSafeAreaInsets()
  const { theme } = useTheme()
  const isAuthenticated = useIsAuthenticated()
  const auth = useAuth()

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three
  }

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four
    }
  })

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type='subtitle'>Expo Boilerplate Entry</ThemedText>
          <ThemedText themeColor='textSecondary' style={styles.heroCopy}>
            This is the public entry screen for the boilerplate. It gives a
            quick overview of the app, shows the current auth state, and lets
            testers move into sign-in or the protected main app.
          </ThemedText>
        </ThemedView>

        <Card borderLeft style={styles.sectionCard}>
          <ThemedText type='default'>Current Status</ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            Signed in: {isAuthenticated ? 'Yes' : 'No'}
          </ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            User: {String(auth?.user?.name ?? 'Guest user')}
          </ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            Main app route: /home, /explore, /setting inside the protected tab
            shell.
          </ThemedText>
        </Card>

        <Card style={styles.sectionCard}>
          <ThemedText type='default'>What This Boilerplate Includes</ThemedText>
          {FEATURE_SECTIONS.map((feature) => (
            <ThemedView key={feature.title} style={styles.featureItem}>
              <ThemedText type='smallBold'>{feature.title}</ThemedText>
              <ThemedText type='small' themeColor='textSecondary'>
                {feature.description}
              </ThemedText>
            </ThemedView>
          ))}
        </Card>

        <Card style={styles.sectionCard}>
          <ThemedText type='default'>Next Step</ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            If you are signed out, start with the auth screen. If you are
            already signed in, open the protected main app.
          </ThemedText>

          <ThemedView style={styles.buttonColumn}>
            {!isAuthenticated ? (
              <ThemedButton
                variant='primary'
                onPress={() => router.push('/auth')}>
                Sign In
              </ThemedButton>
            ) : (
              <ThemedButton
                variant='primary'
                onPress={() => router.push('/(tabs)/home')}>
                Open Main App
              </ThemedButton>
            )}

            <ThemedButton
              variant='outline'
              onPress={() => router.push('/auth')}>
              Open Auth Screen
            </ThemedButton>

            {isAuthenticated && (
              <ThemedButton
                variant='secondary'
                onPress={() => router.push('/profile')}>
                Open Profile
              </ThemedButton>
            )}
          </ThemedView>
        </Card>
      </ThemedView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    gap: Spacing.four,
    paddingHorizontal: Spacing.four
  },
  heroSection: {
    gap: Spacing.two
  },
  heroCopy: {
    lineHeight: 22
  },
  sectionCard: {
    gap: Spacing.two
  },
  featureItem: {
    gap: Spacing.one
  },
  buttonColumn: {
    gap: Spacing.two
  }
})
