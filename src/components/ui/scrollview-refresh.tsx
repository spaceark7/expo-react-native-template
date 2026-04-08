import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import React, { useMemo } from 'react'
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemedView } from '../themed-view'

type ScrollViewRefreshProps = {
  children: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
  enablePullToRefresh?: boolean
  refreshing?: boolean
  onRefresh?: () => void | Promise<void>
}

export default function ScrollViewRefresh({
  children,
  containerStyle,
  enablePullToRefresh = false,
  refreshing: refreshingProp,
  onRefresh
}: ScrollViewRefreshProps) {
  const [internalRefreshing, setInternalRefreshing] = React.useState(false)

  const { theme } = useTheme()
  const safeAreaInsets = useSafeAreaInsets()

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

  const contentContainerStyles = useMemo(
    () => [styles.contentContainer, contentPlatformStyle, containerStyle],
    [contentPlatformStyle, containerStyle]
  )

  const isRefreshingControlled = refreshingProp !== undefined
  const refreshing = refreshingProp ?? internalRefreshing

  const handleRefresh = React.useCallback(() => {
    if (refreshing) {
      return
    }

    if (!onRefresh) {
      return
    }

    if (!isRefreshingControlled) {
      setInternalRefreshing(true)
    }

    Promise.resolve(onRefresh())
      .catch((error) => {
        console.error('Refresh failed:', error)
      })
      .finally(() => {
        if (!isRefreshingControlled) {
          setInternalRefreshing(false)
        }
      })
  }, [isRefreshingControlled, onRefresh, refreshing])

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          enabled={enablePullToRefresh}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={contentContainerStyles}>
      <ThemedView style={styles.container}>{children}</ThemedView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
    padding: Spacing.four,
    paddingBottom: BottomTabInset,
    maxWidth: MaxContentWidth
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1
  },
  safeArea: {
    flex: 1,
    // paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    // paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth
  }
})
