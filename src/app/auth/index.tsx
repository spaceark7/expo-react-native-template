import { AntDesign, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Alert, Platform, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedButton } from '@/components/themed-button'
import { ThemedInput } from '@/components/themed-input'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Card } from '@/components/ui/card'
import { BottomTabInset, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import { useFetch } from '@/infrastructure/http-client/adapters/react/use-fetch'
import {
  MOCK_AUTH_CREDENTIALS,
  mockAuthAdapter,
  type MockAuthResponse,
  type MockSessionResponse
} from '@/infrastructure/http-client/mocks/auth'
import {
  logout,
  setAuthTokens,
  useAuth,
  useIsAuthenticated
} from '@/infrastructure/store/auth'

const getErrorMessage = (message?: unknown, fallback?: string) => {
  if (typeof message === 'string' && message.trim()) {
    return message
  }

  return fallback ?? 'Something went wrong.'
}

export default function AuthScreen() {
  const safeAreaInsets = useSafeAreaInsets()
  const { theme } = useTheme()
  const auth = useAuth()
  const isAuthenticated = useIsAuthenticated()
  const [email, setEmail] = useState<string>(MOCK_AUTH_CREDENTIALS.email)
  const [password, setPassword] = useState<string>(
    MOCK_AUTH_CREDENTIALS.password
  )

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

  const loginPayload = useMemo(
    () => ({
      email: email.trim(),
      password
    }),
    [email, password]
  )

  const {
    loading: isSigningIn,
    error: loginError,
    refetch: submitLogin
  } = useFetch<MockAuthResponse>('/mock/auth/login', {
    method: 'POST',
    headers: { 'Require-Token': false },
    data: loginPayload,
    adapter: mockAuthAdapter,
    immediate: false,
    onSuccess: (response) => {
      void setAuthTokens(response).then(() => {
        router.replace('/(tabs)/home')
      })
    }
  })

  const {
    data: session,
    loading: isLoadingSession,
    error: sessionError,
    status: sessionStatus,
    refetch: refetchSession
  } = useFetch<MockSessionResponse>('/mock/auth/session', {
    method: 'GET',
    headers: { 'Require-Token': true },
    adapter: mockAuthAdapter,
    immediate: isAuthenticated
  })

  const handleUseDemoCredentials = () => {
    setEmail(MOCK_AUTH_CREDENTIALS.email)
    setPassword(MOCK_AUTH_CREDENTIALS.password)
  }

  const handleSignOut = () => {
    logout()
  }

  const handleGoogleLogin = () => {
    Alert.alert(
      'Google Sign-In',
      'Google sign-in UI is ready, but the provider integration has not been implemented yet.'
    )
  }

  const handleForgotPassword = () => {
    Alert.alert(
      'Lupa Kata Sandi',
      'Alur reset kata sandi belum diimplementasikan di boilerplate ini.'
    )
  }

  const handleHelp = () => {
    Alert.alert(
      'Bantuan Login',
      'Gunakan akun demo untuk mencoba alur autentikasi, atau siapkan integrasi provider untuk tombol Google.'
    )
  }

  const handleContactAdmin = () => {
    Alert.alert(
      'Hubungi Admin',
      'Tautan dukungan belum dihubungkan. Tambahkan kontak admin yang sesuai untuk project Anda.'
    )
  }

  const loginErrorMessage =
    loginError &&
    getErrorMessage(
      loginError.response?.data &&
        typeof loginError.response.data === 'object' &&
        'message' in loginError.response.data
        ? loginError.response.data.message
        : loginError.message,
      'Unable to sign in.'
    )

  const sessionErrorMessage =
    sessionError &&
    getErrorMessage(sessionError.message, 'Unable to load session.')

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView
          style={[
            styles.backgroundOrb,
            styles.backgroundOrbTop,
            { backgroundColor: theme.primary }
          ]}
        />
        <ThemedView
          style={[
            styles.backgroundOrb,
            styles.backgroundOrbBottom,
            { backgroundColor: theme.secondaryContainer }
          ]}
        />

        <ThemedView style={styles.authShell}>
          <ThemedView style={styles.topBar}>
            <ThemedText style={[styles.brand, { color: theme.primary }]}>
              BukuBelanja
            </ThemedText>

            <ThemedButton
              iconOnly
              variant='ghost'
              size='small'
              style={styles.helpButton}
              containerStyle={({ pressed }) => [
                styles.helpButtonContainer,
                {
                  backgroundColor: theme.surfaceContainerLow,
                  opacity: pressed ? 0.8 : 1
                }
              ]}
              onPress={handleHelp}>
              <Ionicons
                name='help-circle-outline'
                size={20}
                color={theme.textSecondary}
              />
            </ThemedButton>
          </ThemedView>

          <ThemedView style={StyleSheet.flatten([styles.loginCard])}>
            <ThemedView
              style={[styles.logoTile, { backgroundColor: theme.primary }]}>
              <Ionicons
                name='wallet-outline'
                size={24}
                color={theme.onPrimary}
              />
            </ThemedView>

            <ThemedView style={styles.headerBlock}>
              <ThemedText style={styles.title}>
                Selamat Datang di Buku Belanja
              </ThemedText>
              <ThemedText themeColor='textSecondary' style={styles.subtitle}>
                Masuk untuk mengelola belanja harian Anda.
              </ThemedText>
            </ThemedView>

            <ThemedButton
              variant='outline'
              size='small'
              onPress={handleUseDemoCredentials}
              style={styles.demoButton}>
              <ThemedView style={styles.demoButtonContent}>
                <Ionicons
                  name='flash-outline'
                  size={16}
                  color={theme.primary}
                />
                <ThemedText type='smallBold' style={{ color: theme.primary }}>
                  Isi Akun Demo
                </ThemedText>
              </ThemedView>
            </ThemedButton>

            <ThemedInput
              label='Email / Username'
              autoCapitalize='none'
              keyboardType='email-address'
              placeholder='Contoh: demo@spaceark.test'
              value={email}
              onChangeText={setEmail}
              variant='filled'
              helperText={`Demo: ${MOCK_AUTH_CREDENTIALS.email}`}
              leftIcon={
                <Ionicons
                  name='person-outline'
                  size={18}
                  color={theme.textSecondary}
                />
              }
            />

            <ThemedInput
              label='Kata Sandi'
              placeholder='password123'
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              variant='filled'
              leftIcon={
                <Ionicons
                  name='lock-closed-outline'
                  size={18}
                  color={theme.textSecondary}
                />
              }
            />

            <ThemedButton
              variant='ghost'
              size='small'
              style={styles.linkButton}
              containerStyle={styles.linkButtonContainer}
              onPress={handleForgotPassword}>
              <ThemedText style={[styles.linkText, { color: theme.primary }]}>
                Lupa Kata Sandi?
              </ThemedText>
            </ThemedButton>

            {!!loginErrorMessage && (
              <ThemedView
                style={[
                  styles.inlineNotice,
                  { backgroundColor: theme.errorContainer }
                ]}>
                <ThemedText
                  type='small'
                  style={{ color: theme.onErrorContainer }}>
                  {loginErrorMessage}
                </ThemedText>
              </ThemedView>
            )}

            <ThemedButton
              variant='primary'
              loading={isSigningIn}
              disabled={!email.trim() || !password.trim()}
              style={styles.primaryActionButton}
              containerStyle={({ pressed }) => [
                styles.primaryAction,
                {
                  backgroundColor: theme.primary,
                  opacity:
                    isSigningIn || !email.trim() || !password.trim()
                      ? 0.55
                      : pressed
                        ? 0.86
                        : 1
                }
              ]}
              rightIcon={
                <Ionicons
                  name='arrow-forward'
                  size={20}
                  color={theme.onPrimary}
                />
              }
              onPress={submitLogin}>
              {isSigningIn ? 'Memproses...' : 'Masuk'}
            </ThemedButton>

            <ThemedButton
              variant='outline'
              style={styles.googleButtonWrapper}
              containerStyle={({ pressed }) => [
                styles.googleButton,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.outlineVariant,
                  opacity: pressed ? 0.9 : 1
                }
              ]}
              leftIcon={
                <AntDesign name='google' size={18} color={theme.error} />
              }
              onPress={handleGoogleLogin}>
              Sign in with Google
            </ThemedButton>

            <ThemedView
              style={[
                styles.securityPill,
                { backgroundColor: theme.secondaryContainer }
              ]}>
              <Ionicons
                name='shield-checkmark'
                size={14}
                color={theme.onSecondaryContainer}
              />
              <ThemedText
                style={{ color: theme.onSecondaryContainer, fontSize: 12 }}>
                KEAMANAN TERJAMIN OLEH BUKU BELANJA
              </ThemedText>
            </ThemedView>

            <ThemedText style={styles.footerText}>
              Belum punya akun?{' '}
              <ThemedText
                type='smallBold'
                style={{ color: theme.primary }}
                onPress={handleContactAdmin}>
                Hubungi Admin
              </ThemedText>
            </ThemedText>

            <ThemedButton
              variant='ghost'
              size='small'
              style={styles.backButton}
              containerStyle={styles.linkButtonContainer}
              onPress={() => router.replace('/')}>
              <ThemedText type='small' themeColor='textSecondary'>
                Kembali ke halaman awal
              </ThemedText>
            </ThemedButton>
          </ThemedView>
        </ThemedView>

        {isAuthenticated && (
          <Card style={styles.sectionCard}>
            <ThemedText type='default'>Sesi Aktif</ThemedText>
            <ThemedText type='small' themeColor='textSecondary'>
              User: {String(auth?.user?.name ?? 'Unknown user')}
            </ThemedText>
            <ThemedText type='small' themeColor='textSecondary'>
              Access token:{' '}
              {auth?.accessToken
                ? `${auth.accessToken.slice(0, 18)}...`
                : 'None'}
            </ThemedText>

            <ThemedView style={styles.sessionActions}>
              <ThemedButton
                variant='secondary'
                onPress={() => router.replace('/(tabs)/home')}>
                Buka Main App
              </ThemedButton>
              <ThemedButton
                variant='ghost'
                loading={isLoadingSession}
                onPress={refetchSession}>
                Refresh Session
              </ThemedButton>
              <ThemedButton variant='outline' onPress={handleSignOut}>
                Sign Out
              </ThemedButton>
            </ThemedView>

            <ThemedText type='small' themeColor='textSecondary'>
              Session status: {sessionStatus ?? 'Signed in'}
            </ThemedText>

            {!!sessionErrorMessage && (
              <ThemedText type='small' style={{ color: theme.error }}>
                {sessionErrorMessage}
              </ThemedText>
            )}

            {session && (
              <ThemedView style={styles.sessionSummary}>
                <ThemedText type='small'>{session.message}</ThemedText>
                <ThemedText type='small' themeColor='textSecondary'>
                  {session.user.name} · {session.user.role}
                </ThemedText>
                <ThemedText type='small' themeColor='textSecondary'>
                  Issued at: {new Date(session.issuedAt).toLocaleString()}
                </ThemedText>
              </ThemedView>
            )}
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
    flexGrow: 1,
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    gap: Spacing.four,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.four,
    position: 'relative'
  },
  authShell: {
    alignSelf: 'center',
    gap: Spacing.three,
    maxWidth: 440,
    position: 'relative',
    width: '100%',
    zIndex: 1
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.three
  },
  brand: {
    fontSize: 22,
    fontWeight: '700'
  },
  helpButton: {
    alignSelf: 'flex-end'
  },
  helpButtonContainer: {
    alignItems: 'center',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34
  },
  backgroundOrb: {
    borderRadius: 999,
    height: 240,
    opacity: 0.18,
    position: 'absolute',
    width: 240
  },
  backgroundOrbTop: {
    right: -50,
    top: -30
  },
  backgroundOrbBottom: {
    bottom: 20,
    left: -60
  },
  loginCard: {
    // borderRadius: 28,
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five
  },
  logoTile: {
    alignItems: 'center',
    borderRadius: 18,
    height: 60,
    justifyContent: 'center',
    width: 60
  },
  headerBlock: {
    gap: Spacing.two
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28
  },
  demoButton: {
    alignSelf: 'flex-start',
    borderRadius: 999
  },
  demoButtonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
    justifyContent: 'center'
  },
  inlineNotice: {
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two
  },
  linkButton: {
    alignItems: 'flex-end'
  },
  linkButtonContainer: {
    alignSelf: 'flex-end',
    minHeight: 0,
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  linkText: {
    fontSize: 15,
    fontWeight: '700'
  },
  primaryActionButton: {
    borderRadius: 14
  },
  primaryAction: {
    borderRadius: 14,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12
  },
  primaryActionContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 56
  },
  primaryActionText: {
    fontSize: 20,
    fontWeight: '700'
  },
  googleButton: {
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 56
  },
  googleButtonWrapper: {
    borderRadius: 14
  },
  googleContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 56
  },
  googleText: {
    fontSize: 18,
    fontWeight: '600'
  },
  securityPill: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center'
  },
  backButton: {
    alignSelf: 'center'
  },
  sectionCard: {
    alignSelf: 'center',
    gap: Spacing.two,
    maxWidth: 440,
    width: '100%'
  },
  sessionActions: {
    gap: Spacing.two
  },
  sessionSummary: {
    gap: Spacing.one
  }
})
