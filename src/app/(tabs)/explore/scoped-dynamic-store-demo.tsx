import React, { useState } from 'react'
import { Platform, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedButton } from '@/components/themed-button'
import { ThemedInput } from '@/components/themed-input'
import { ThemedNumericInput } from '@/components/themed-numeric-input'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Card } from '@/components/ui/card'
import { BottomTabInset, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import {
  ScopedShoppingItemDraftProvider,
  useScopedShoppingItemDraftActions,
  useScopedShoppingItemDraftNote,
  useScopedShoppingItemDraftQuantity
} from '@/infrastructure/store/examples/scoped-shopping-item-draft-store'

type ScopedDraftCardProps = {
  title: string
}

function ScopedDraftCard({ title }: ScopedDraftCardProps) {
  const quantity = useScopedShoppingItemDraftQuantity()
  const note = useScopedShoppingItemDraftNote()
  const draftActions = useScopedShoppingItemDraftActions()

  return (
    <Card borderLeft style={styles.editorCard}>
      <ThemedText type='default'>{title}</ThemedText>

      <ThemedNumericInput
        label='Quantity'
        value={quantity}
        onValueChange={draftActions.setQuantity}
        min={0}
        max={99}
        helperText='Each provider owns an isolated store instance.'
      />

      <ThemedInput
        label='Draft Note'
        placeholder='This note lives only inside this provider scope.'
        value={note}
        onChangeText={draftActions.setNote}
      />

      <ThemedView style={styles.inlineActions}>
        <ThemedButton variant='outline' onPress={draftActions.decrement}>
          Decrement
        </ThemedButton>
        <ThemedButton variant='secondary' onPress={draftActions.increment}>
          Increment
        </ThemedButton>
        <ThemedButton variant='ghost' onPress={draftActions.reset}>
          Reset
        </ThemedButton>
      </ThemedView>
    </Card>
  )
}

export default function ScopedDynamicStoreDemoScreen() {
  const safeAreaInsets = useSafeAreaInsets()
  const { theme } = useTheme()
  const [showFirstScope, setShowFirstScope] = useState(true)
  const [showSecondScope, setShowSecondScope] = useState(true)

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
          <ThemedText type='subtitle'>Scoped Dynamic Store Demo</ThemedText>
          <ThemedText themeColor='textSecondary' style={styles.heroCopy}>
            This pattern creates one store instance per mounted provider. It is
            useful for modal flows, editors, or wizard sessions that should not
            be cached globally by key.
          </ThemedText>
        </ThemedView>

        <Card style={styles.sectionCard}>
          <ThemedText type='default'>How This Pattern Works</ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            1. `createScopedDynamicStore` builds a Provider and a
            `useScopedStore` hook.
          </ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            2. Inside the provider, the screen consumes named hooks backed by
            `useStore` subscriptions.
          </ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            3. Unmounting the provider destroys that scoped store instance.
          </ThemedText>
        </Card>

        <ThemedView style={styles.toggleRow}>
          <ThemedButton
            variant={showFirstScope ? 'secondary' : 'outline'}
            onPress={() => setShowFirstScope((value) => !value)}>
            {showFirstScope ? 'Unmount Scope A' : 'Mount Scope A'}
          </ThemedButton>
          <ThemedButton
            variant={showSecondScope ? 'secondary' : 'outline'}
            onPress={() => setShowSecondScope((value) => !value)}>
            {showSecondScope ? 'Unmount Scope B' : 'Mount Scope B'}
          </ThemedButton>
        </ThemedView>

        {showFirstScope ? (
          <ScopedShoppingItemDraftProvider
            initialState={{ quantity: 2, note: 'Scope A starts here.' }}>
            <ScopedDraftCard title='Scoped Draft A' />
          </ScopedShoppingItemDraftProvider>
        ) : (
          <Card style={styles.sectionCard}>
            <ThemedText type='small' themeColor='textSecondary'>
              Scope A is unmounted. Mount it again to recreate its store from
              the initial state.
            </ThemedText>
          </Card>
        )}

        {showSecondScope ? (
          <ScopedShoppingItemDraftProvider
            initialState={{ quantity: 5, note: 'Scope B is independent.' }}>
            <ScopedDraftCard title='Scoped Draft B' />
          </ScopedShoppingItemDraftProvider>
        ) : (
          <Card style={styles.sectionCard}>
            <ThemedText type='small' themeColor='textSecondary'>
              Scope B is unmounted. Its state disappears with the provider.
            </ThemedText>
          </Card>
        )}
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
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.two
  },
  editorCard: {
    gap: Spacing.three
  },
  inlineActions: {
    flexDirection: 'row',
    gap: Spacing.two
  }
})
