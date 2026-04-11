import * as Device from 'expo-device'
import { Platform, StyleSheet } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import Badge from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import ScrollViewRefresh from '@/components/ui/scrollview-refresh'
import { WebBadge } from '@/components/web-badge'
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import { useFetch } from '@/infrastructure/http-client/adapters/react/use-fetch'
import { verifyInstallation } from 'nativewind'
import React from 'react'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type='small'>use browser devtools</ThemedText>
  }
  if (Device.isDevice) {
    return (
      <ThemedText type='small'>
        shake device or press <ThemedText type='code'>m</ThemedText> in terminal
      </ThemedText>
    )
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d'
  return (
    <ThemedText type='small'>
      press <ThemedText type='code'>{shortcut}</ThemedText>
    </ThemedText>
  )
}

export default function HomeScreen() {
  const { theme } = useTheme()
  const [randomQuote, setRandomQuote] = React.useState<
    'love' | 'life' | 'person' | undefined
  >()

  const {
    data: posts,
    loading,
    error
  } = useFetch<{ posts: Post[] }>('https://dummyjson.com/posts/search', {
    method: 'GET',
    headers: { 'Require-Token': false },
    params: { limit: 5, q: randomQuote },
    immediate: true,
    dedupe: true
  })

  const handleRefetch = () => {
    setRandomQuote((prev) => {
      if (prev === 'love') return 'life'
      if (prev === 'life') return 'person'
      if (prev === 'person') return undefined
      return 'love'
    })
  }

  verifyInstallation()

  return (
    <ScrollViewRefresh
      enablePullToRefresh
      refreshing={loading}
      onRefresh={handleRefetch}>
      <ThemedView style={styles.container}>
        <ThemedText
          type='caption'
          themeColor='textSecondary'
          style={{ alignSelf: 'flex-start', marginBottom: Spacing.two }}>
          LATEST POSTS (jsonplaceholder)
        </ThemedText>
        <Card
          className='!bg-transparent'
          style={{
            ...styles.cardContainer,
            marginBottom: Spacing.five,
            padding: 0,
            shadowOpacity: 0,
            elevation: 0
          }}>
          {loading && (
            <ThemedText type='small' themeColor='textSecondary'>
              Loading...
            </ThemedText>
          )}
          {!!error && (
            <ThemedText type='small' style={{ color: theme.error }}>
              Error: {error.message}
            </ThemedText>
          )}
          {!loading &&
            !error &&
            posts?.posts.map((post) => (
              <ThemedView
                key={post.id}
                style={{
                  backgroundColor: theme.surfaceVariant,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.outline,
                  padding: Spacing.two,
                  display: 'flex',
                  marginBottom: Spacing.two
                }}>
                <ThemedText
                  style={{ color: theme.onSurface }}
                  type='smallBold'
                  numberOfLines={1}>
                  {post.id}. {post.title}
                </ThemedText>
                <ThemedText
                  type='small'
                  themeColor='textSecondary'
                  numberOfLines={2}>
                  {post.body}
                </ThemedText>
              </ThemedView>
            ))}
        </Card>

        <Card style={{ ...styles.cardContainer, marginBottom: Spacing.five }}>
          <ThemedText
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 1,
              color: theme.onSurfaceVariant
            }}>
            ANALISIS MINGGUAN
          </ThemedText>
          <ThemedText style={{ fontSize: 24, fontWeight: '700' }}>
            -12%{' '}
            <ThemedText
              style={{ color: theme.success, fontSize: 14, fontWeight: '400' }}>
              Hemat dari minggu lalu
            </ThemedText>
          </ThemedText>
          <ThemedView
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 8,
              height: 100,
              marginTop: 20
            }}>
            {[40, 60, 35, 85, 55, 95, 20].map((h, i) => (
              <ThemedView
                key={i}
                style={[
                  { flex: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
                  {
                    height: h,
                    backgroundColor:
                      i === 6 ? theme.secondaryFixed : theme.primary,
                    opacity: i === 6 ? 1 : 0.4 + i * 0.1
                  }
                ]}
              />
            ))}
          </ThemedView>
        </Card>

        <ThemedText
          type='caption'
          themeColor='textSecondary'
          style={{
            marginTop: Spacing.five,
            alignSelf: 'flex-start',
            marginBottom: Spacing.two
          }}>
          SESI BERJALAN
        </ThemedText>

        <Card borderLeft style={styles.cardContainer}>
          <ThemedView className='!justify-between flex-row w-full !bg-transparent'>
            <ThemedView className='!bg-transparent'>
              <ThemedText>
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </ThemedText>
              <ThemedText
                type='small'
                style={{ color: theme.onSurfaceVariant }}>
                3 item
              </ThemedText>
            </ThemedView>
            <Badge variant='primary'>Rp 150.000</Badge>
          </ThemedView>
          <ThemedText
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 1,
              color: theme.onSurfaceVariant
            }}>
            ANALISIS MINGGUAN
          </ThemedText>
          <ThemedText style={{ fontSize: 24, fontWeight: '700' }}>
            -12%{' '}
            <ThemedText
              style={{ color: theme.success, fontSize: 14, fontWeight: '400' }}>
              Hemat dari minggu lalu
            </ThemedText>
          </ThemedText>
          <ThemedView
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 8,
              height: 100,
              marginTop: 20
            }}>
            {[40, 60, 35, 85, 55, 95, 20].map((h, i) => (
              <ThemedView
                key={i}
                style={[
                  { flex: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
                  {
                    height: h,
                    backgroundColor:
                      i === 6 ? theme.secondaryFixed : theme.primary,
                    opacity: i === 6 ? 1 : 0.4 + i * 0.1
                  }
                ]}
              />
            ))}
          </ThemedView>
        </Card>

        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollViewRefresh>
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
    alignItems: 'center',
    gap: Spacing.three,
    maxWidth: MaxContentWidth
  },
  cardContainer: {
    gap: Spacing.two,
    width: '100%',
    flexDirection: 'column'
  },
  title: {
    textAlign: 'center'
  },
  code: {
    textTransform: 'uppercase'
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four
  }
})