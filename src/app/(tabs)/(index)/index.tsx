import * as Device from 'expo-device'
import { Platform, ScrollView, StyleSheet } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import Badge from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { WebBadge } from '@/components/web-badge'
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import { verifyInstallation } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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

  verifyInstallation()

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <Card style={styles.cardContainer}>
          <ThemedText
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 1,
              color: theme.onSurfaceVariant
            }}>
            ANALISIS MINGGUAN
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 24,
              fontWeight: '700'
            }}>
            -12%{' '}
            <ThemedText
              style={{
                color: theme.success,
                fontSize: 14,
                fontWeight: '400'
              }}>
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
                  {
                    flex: 1,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4
                  },
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
            <ThemedView className='!bg-transparent '>
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
          <ThemedText
            style={{
              fontSize: 24,
              fontWeight: '700'
            }}>
            -12%{' '}
            <ThemedText
              style={{
                color: theme.success,
                fontSize: 14,
                fontWeight: '400'
              }}>
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
                  {
                    flex: 1,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4
                  },
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
