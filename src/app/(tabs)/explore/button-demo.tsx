import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Platform, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedButton } from '@/components/themed-button'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { BottomTabInset, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

export default function ButtonDemoScreen() {
  const safeAreaInsets = useSafeAreaInsets()
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three
  }
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)

  const handleLoadingTest = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
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
        <ThemedText type='subtitle' style={styles.title}>
          Themed Button Demo
        </ThemedText>
        <ThemedText themeColor='textSecondary' style={styles.subtitle}>
          Explore different button variants, sizes, and states
        </ThemedText>

        {/* Variants Section */}
        <ThemedView style={styles.section}>
          <ThemedText type='default' style={styles.sectionTitle}>
            Variants
          </ThemedText>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='primary'
              onPress={() => console.log('Primary pressed')}>
              Primary
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='secondary'
              onPress={() => console.log('Secondary pressed')}>
              Secondary
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='outline'
              onPress={() => console.log('Outline pressed')}>
              Outline
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='ghost'
              onPress={() => console.log('Ghost pressed')}>
              Ghost
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='success'
              onPress={() => console.log('Success pressed')}>
              Success
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='danger'
              onPress={() => console.log('Danger pressed')}>
              Danger
            </ThemedButton>
          </ThemedView>
        </ThemedView>

        {/* Sizes Section */}
        <ThemedView style={styles.section}>
          <ThemedText type='default' style={styles.sectionTitle}>
            Sizes
          </ThemedText>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton size='small' onPress={() => console.log('Small')}>
              Small Button
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton size='medium' onPress={() => console.log('Medium')}>
              Medium Button
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton size='large' onPress={() => console.log('Large')}>
              Large Button
            </ThemedButton>
          </ThemedView>
        </ThemedView>

        {/* States Section */}
        <ThemedView style={styles.section}>
          <ThemedText type='default' style={styles.sectionTitle}>
            States
          </ThemedText>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton disabled onPress={() => console.log('Disabled')}>
              Disabled Button
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              loading={loading}
              onPress={handleLoadingTest}
              variant='primary'>
              {loading ? 'Loading...' : 'Test Loading'}
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='outline'
              disabled
              onPress={() => console.log('Disabled outline')}>
              Disabled Outline
            </ThemedButton>
          </ThemedView>
        </ThemedView>

        {/* Combinations Section */}
        <ThemedView style={styles.section}>
          <ThemedText type='default' style={styles.sectionTitle}>
            Combinations
          </ThemedText>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='success'
              size='small'
              onPress={() => console.log('Small success')}>
              Small Success
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='danger'
              size='large'
              onPress={() => console.log('Large danger')}>
              Large Danger Action
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='outline'
              size='small'
              onPress={() => console.log('Small outline')}>
              Small Outline
            </ThemedButton>
          </ThemedView>
        </ThemedView>

        {/* Icons Section */}
        <ThemedView style={styles.section}>
          <ThemedText type='default' style={styles.sectionTitle}>
            With Icons
          </ThemedText>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='primary'
              leftIcon={<Ionicons name='add' size={20} color='#fff' />}
              onPress={() => console.log('Add new')}>
              Add New
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='secondary'
              rightIcon={
                <Ionicons name='arrow-forward' size={20} color={theme.text} />
              }
              onPress={() => console.log('Next')}>
              Next
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='outline'
              leftIcon={
                <Ionicons name='download' size={20} color={theme.primary} />
              }
              onPress={() => console.log('Download')}>
              Download
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='ghost'
              iconOnly
              size='small'
              onPress={() => console.log('Settings')}>
              <Ionicons name='settings' size={24} color={theme.text} />
            </ThemedButton>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='danger'
              leftIcon={<Ionicons name='trash' size={20} color='#fff' />}
              onPress={() => console.log('Delete')}>
              Delete
            </ThemedButton>
          </ThemedView>
        </ThemedView>

        {/* Navigation Test */}
        <ThemedView style={styles.section}>
          <ThemedText type='default' style={styles.sectionTitle}>
            Navigation
          </ThemedText>

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant='ghost'
              onPress={() => router.back()}
              size='small'>
              ← Back to Explore
            </ThemedButton>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    padding: Spacing.four
  },
  title: {
    marginBottom: Spacing.one
  },
  subtitle: {
    marginBottom: Spacing.four
  },
  section: {
    marginBottom: Spacing.five,
    width: '100%'
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: Spacing.three
  },
  buttonRow: {
    marginBottom: Spacing.two,
    width: '100%'
  }
})
