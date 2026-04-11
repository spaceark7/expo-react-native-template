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
  clearAllShoppingItemDraftStores,
  clearShoppingItemDraftStore,
  ensureShoppingItemDraftStore,
  getShoppingItemDraftStoreKeys,
  getShoppingItemDraftStoreLifecycle,
  hasShoppingItemDraftStore,
  useClearShoppingItemDraftStoresOnBlur,
  useShoppingItemDraftActions,
  useShoppingItemDraftNote,
  useShoppingItemDraftQuantity,
  useShoppingItemDraftUpdatedAt,
  type ShoppingItemDraftLifecycle
} from '@/infrastructure/store/examples/shopping-item-draft-store'

const EXAMPLE_ITEMS = [
  {
    id: 'apple',
    title: 'Apple',
    description: 'Fresh produce draft keyed by item ID.'
  },
  {
    id: 'coffee',
    title: 'Coffee',
    description: 'A second entity keeps its own quantity and note.'
  },
  {
    id: 'rice',
    title: 'Rice',
    description: 'Use cleanup to drop the cached draft instance.'
  }
] as const

type ExampleItemId = (typeof EXAMPLE_ITEMS)[number]['id']

type DraftPreviewCardProps = {
  itemId: ExampleItemId
  title: string
  isActive: boolean
  onOpen: (itemId: ExampleItemId) => void
}

const formatLifecycle = (lifecycle: ShoppingItemDraftLifecycle | null) => {
  if (lifecycle === 'destroy-on-route-leave') {
    return 'Auto-clear on leave'
  }

  if (lifecycle === 'persist') {
    return 'Persistent'
  }

  return 'Choose on create'
}

const describeLifecycle = (lifecycle: ShoppingItemDraftLifecycle | null) => {
  if (lifecycle === 'destroy-on-route-leave') {
    return 'Changes are cleared when you leave this screen.'
  }

  if (lifecycle === 'persist') {
    return 'Changes stay saved when you leave this screen.'
  }

  return 'Pick a mode to create the draft.'
}

function DraftPreviewCard({
  itemId,
  title,
  isActive,
  onOpen
}: DraftPreviewCardProps) {
  const lifecycle = getShoppingItemDraftStoreLifecycle(itemId)
  const quantity = useShoppingItemDraftQuantity(itemId)
  const note = useShoppingItemDraftNote(itemId)
  const updatedAt = useShoppingItemDraftUpdatedAt(itemId)

  return (
    <Card borderLeft={isActive} style={styles.previewCard}>
      <ThemedView style={styles.previewHeader}>
        <ThemedText type='default'>{title}</ThemedText>
        <ThemedText type='small' themeColor='textSecondary'>
          key: {itemId}
        </ThemedText>
      </ThemedView>

      <ThemedText type='small'>Quantity: {quantity}</ThemedText>
      <ThemedText type='small' themeColor='textSecondary'>
        Lifecycle: {formatLifecycle(lifecycle)}
      </ThemedText>
      <ThemedText type='small' themeColor='textSecondary'>
        {describeLifecycle(lifecycle)}
      </ThemedText>
      <ThemedText type='small' themeColor='textSecondary'>
        Note: {note || 'No note yet'}
      </ThemedText>
      <ThemedText type='small' themeColor='textSecondary'>
        Updated:{' '}
        {updatedAt ? new Date(updatedAt).toLocaleTimeString() : 'Never'}
      </ThemedText>

      <ThemedButton
        variant={isActive ? 'secondary' : 'outline'}
        size='small'
        onPress={() => onOpen(itemId)}>
        {isActive ? 'Currently Editing' : 'Open This Draft'}
      </ThemedButton>
    </Card>
  )
}

type CurrentDraftEditorProps = {
  itemId: ExampleItemId
  title: string
  description: string
  lifecycle: ShoppingItemDraftLifecycle
  onRemoveDraftStore: () => void
}

function CurrentDraftEditor({
  itemId,
  title,
  description,
  lifecycle,
  onRemoveDraftStore
}: CurrentDraftEditorProps) {
  const quantity = useShoppingItemDraftQuantity(itemId)
  const note = useShoppingItemDraftNote(itemId)
  const updatedAt = useShoppingItemDraftUpdatedAt(itemId)
  const draftActions = useShoppingItemDraftActions(itemId)

  return (
    <Card borderLeft style={styles.editorCard}>
      <ThemedView style={styles.editorHeader}>
        <ThemedText type='subtitle'>{title} Draft</ThemedText>
        <ThemedText type='small' themeColor='textSecondary'>
          {description}
        </ThemedText>
        <ThemedText type='small' themeColor='textSecondary'>
          Lifecycle: {formatLifecycle(lifecycle)}
        </ThemedText>
        <ThemedText type='small' themeColor='textSecondary'>
          {describeLifecycle(lifecycle)}
        </ThemedText>
      </ThemedView>

      <ThemedNumericInput
        label='Quantity'
        value={quantity}
        onValueChange={(value) => {
          console.log(
            `Setting quantity to ${value} for item ${itemId} in editor`
          ) // Debug log
          draftActions.setQuantity(value)
        }}
        min={0}
        max={99}
        helperText='Try changing this number, then switch to another item to compare states.'
      />

      <ThemedInput
        label='Draft Note'
        placeholder='Write something specific to this item...'
        value={note}
        onChangeText={draftActions.setNote}
        helperText='Type a note here. It belongs only to this item.'
      />

      <ThemedView style={styles.inlineActions}>
        <ThemedButton variant='outline' onPress={draftActions.decrement}>
          Decrement
        </ThemedButton>
        <ThemedButton variant='secondary' onPress={draftActions.increment}>
          Increment
        </ThemedButton>
      </ThemedView>

      <ThemedView style={styles.inlineActions}>
        <ThemedButton variant='ghost' onPress={draftActions.reset}>
          Reset This Draft
        </ThemedButton>
        <ThemedButton variant='outline' onPress={onRemoveDraftStore}>
          Delete This Draft
        </ThemedButton>
      </ThemedView>

      <ThemedText type='small' themeColor='textSecondary'>
        Last updated:{' '}
        {updatedAt ? new Date(updatedAt).toLocaleTimeString() : 'Never'}
      </ThemedText>
    </Card>
  )
}

export default function DynamicStoreDemoScreen() {
  const safeAreaInsets = useSafeAreaInsets()
  const [currentItemId, setCurrentItemId] = useState<ExampleItemId | null>(null)
  const [autoClearItemIds, setAutoClearItemIds] = useState<ExampleItemId[]>([])
  const { theme } = useTheme()

  useClearShoppingItemDraftStoresOnBlur(autoClearItemIds)

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

  const syncAutoClearTracking = (
    itemId: ExampleItemId,
    lifecycle: ShoppingItemDraftLifecycle
  ) => {
    setAutoClearItemIds((currentKeys) => {
      if (lifecycle === 'destroy-on-route-leave') {
        return currentKeys.includes(itemId)
          ? currentKeys
          : [...currentKeys, itemId]
      }

      return currentKeys.filter((key) => key !== itemId)
    })
  }

  const handleOpenDraft = (
    itemId: ExampleItemId,
    lifecycle: ShoppingItemDraftLifecycle
  ) => {
    const existingLifecycle = getShoppingItemDraftStoreLifecycle(itemId)

    if (existingLifecycle && existingLifecycle !== lifecycle) {
      clearShoppingItemDraftStore(itemId)
    }

    ensureShoppingItemDraftStore(itemId, { lifecycle })
    syncAutoClearTracking(itemId, lifecycle)
    setCurrentItemId(itemId)
  }

  const handleRemoveCurrentDraft = () => {
    if (!currentItemId) {
      return
    }

    clearShoppingItemDraftStore(currentItemId)
    setAutoClearItemIds((currentKeys) =>
      currentKeys.filter((key) => key !== currentItemId)
    )
    setCurrentItemId(null)
  }

  const handleClearAllDrafts = () => {
    clearAllShoppingItemDraftStores()
    setAutoClearItemIds([])
    setCurrentItemId(null)
  }

  const activeDraftKeys = getShoppingItemDraftStoreKeys() as ExampleItemId[]
  const activeCurrentItemId =
    currentItemId && hasShoppingItemDraftStore(currentItemId)
      ? currentItemId
      : null
  const currentItem =
    EXAMPLE_ITEMS.find((item) => item.id === activeCurrentItemId) ?? null
  const currentItemLifecycle = currentItem
    ? getShoppingItemDraftStoreLifecycle(currentItem.id)
    : null

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type='subtitle'>Dynamic Store Demo</ThemedText>
          <ThemedText themeColor='textSecondary' style={styles.heroCopy}>
            Use this screen to compare two behaviors for item-based drafts: one
            that stays saved after you leave, and one that clears when you leave
            the screen.
          </ThemedText>
        </ThemedView>

        <Card style={styles.sectionCard}>
          <ThemedText type='default'>What To Try</ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            1. Create a draft for any item using either Persistent or
            Auto-Clear.
          </ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            2. Change the quantity and note, then switch to another item.
          </ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            3. Leave this screen and come back. Persistent drafts should stay.
            Auto-Clear drafts should reset.
          </ThemedText>
        </Card>

        <Card style={styles.sectionCard}>
          <ThemedText type='default'>Current Screen State</ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            Active drafts: {activeDraftKeys.length}
          </ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            Auto-clear drafts: {autoClearItemIds.length}
          </ThemedText>
          <ThemedText type='small' themeColor='textSecondary'>
            Selected item: {currentItem?.title ?? 'None selected'}
          </ThemedText>
        </Card>

        <ThemedView style={styles.selectionGrid}>
          {EXAMPLE_ITEMS.map((item) => (
            <Card key={item.id} style={styles.selectionCard}>
              <ThemedText type='default'>{item.title}</ThemedText>
              <ThemedText type='small' themeColor='textSecondary'>
                {item.description}
              </ThemedText>
              <ThemedText type='small' themeColor='textSecondary'>
                Draft:{' '}
                {hasShoppingItemDraftStore(item.id)
                  ? 'Ready'
                  : 'Not created yet'}
              </ThemedText>
              <ThemedText type='small' themeColor='textSecondary'>
                Mode:{' '}
                {formatLifecycle(getShoppingItemDraftStoreLifecycle(item.id))}
              </ThemedText>
              <ThemedText type='small' themeColor='textSecondary'>
                {describeLifecycle(getShoppingItemDraftStoreLifecycle(item.id))}
              </ThemedText>

              <ThemedView style={styles.selectionActions}>
                <ThemedButton
                  variant={
                    activeCurrentItemId === item.id ? 'secondary' : 'primary'
                  }
                  onPress={() => handleOpenDraft(item.id, 'persist')}>
                  {hasShoppingItemDraftStore(item.id)
                    ? 'Use Persistent Mode'
                    : 'Create Persistent Draft'}
                </ThemedButton>

                <ThemedButton
                  variant='outline'
                  onPress={() =>
                    handleOpenDraft(item.id, 'destroy-on-route-leave')
                  }>
                  {hasShoppingItemDraftStore(item.id)
                    ? 'Use Auto-Clear Mode'
                    : 'Create Auto-Clear Draft'}
                </ThemedButton>
              </ThemedView>
            </Card>
          ))}
        </ThemedView>

        {currentItem && currentItemLifecycle ? (
          <CurrentDraftEditor
            itemId={currentItem.id}
            title={currentItem.title}
            description={currentItem.description}
            lifecycle={currentItemLifecycle}
            onRemoveDraftStore={handleRemoveCurrentDraft}
          />
        ) : (
          <Card style={styles.sectionCard}>
            <ThemedText type='default'>Choose An Item To Start</ThemedText>
            <ThemedText type='small' themeColor='textSecondary'>
              Start by picking one item above. Create it as Persistent if you
              want it to stay after navigation, or Auto-Clear if you want it to
              reset when you leave this screen.
            </ThemedText>
          </Card>
        )}

        <Card style={styles.sectionCard}>
          <ThemedView style={styles.registryHeader}>
            <ThemedText type='default'>Created Drafts</ThemedText>
            <ThemedButton
              variant='ghost'
              size='small'
              onPress={handleClearAllDrafts}>
              Delete All Drafts
            </ThemedButton>
          </ThemedView>

          {activeDraftKeys.length === 0 ? (
            <ThemedText type='small' themeColor='textSecondary'>
              No drafts have been created yet.
            </ThemedText>
          ) : (
            <ThemedView style={styles.previewGrid}>
              {activeDraftKeys.map((itemId) => {
                const item = EXAMPLE_ITEMS.find((entry) => entry.id === itemId)
                if (!item) {
                  return null
                }

                return (
                  <DraftPreviewCard
                    key={itemId}
                    itemId={itemId}
                    title={item.title}
                    isActive={activeCurrentItemId === itemId}
                    onOpen={(nextItemId) => {
                      const lifecycle =
                        getShoppingItemDraftStoreLifecycle(nextItemId) ??
                        'persist'
                      handleOpenDraft(nextItemId, lifecycle)
                    }}
                  />
                )
              })}
            </ThemedView>
          )}
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
  selectionGrid: {
    gap: Spacing.three
  },
  selectionCard: {
    gap: Spacing.two
  },
  selectionActions: {
    gap: Spacing.two
  },
  editorCard: {
    gap: Spacing.three
  },
  editorHeader: {
    gap: Spacing.one
  },
  inlineActions: {
    flexDirection: 'row',
    gap: Spacing.two
  },
  registryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two
  },
  previewGrid: {
    gap: Spacing.three
  },
  previewCard: {
    gap: Spacing.two
  },
  previewHeader: {
    gap: Spacing.one
  }
})
