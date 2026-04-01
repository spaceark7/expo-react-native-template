import { router } from 'expo-router'
import React, { useState } from 'react'
import { Platform, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedButton } from '@/components/themed-button'
import { ThemedInput } from '@/components/themed-input'
import { ThemedNumericInput } from '@/components/themed-numeric-input'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { BottomTabInset, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

export default function InputDemoScreen() {
  const safeAreaInsets = useSafeAreaInsets()
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three
  }
  const { theme } = useTheme()

  // Text input states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')

  // Numeric input states
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(100)
  const [discount, setDiscount] = useState(0)
  const [smallValue, setSmallValue] = useState(10)
  const [mediumValue, setMediumValue] = useState(20)
  const [largeValue, setLargeValue] = useState(30)

  const validateEmail = (text: string) => {
    setEmail(text)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (text && !emailRegex.test(text)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
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
          Input Components Demo
        </ThemedText>
        <ThemedText themeColor='textSecondary' style={styles.subtitle}>
          Explore different input variants and numeric inputs
        </ThemedText>

        {/* Text Inputs Section */}
        <ThemedView style={styles.section}>
          <ThemedText type='default' style={styles.sectionTitle}>
            Text Inputs
          </ThemedText>

          <ThemedView style={styles.inputRow}>
            <ThemedInput
              label='Name'
              placeholder='Enter your name'
              value={name}
              onChangeText={setName}
              helperText='Your full name'
            />
          </ThemedView>

          <ThemedView style={styles.inputRow}>
            <ThemedInput
              label='Email'
              placeholder='email@example.com'
              value={email}
              onChangeText={validateEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              error={emailError}
            />
          </ThemedView>

          <ThemedView style={styles.inputRow}>
            <ThemedInput
              label='Password'
              placeholder='Enter password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              helperText='Minimum 8 characters'
            />
          </ThemedView>
        </ThemedView>

        {/* Input Variants */}
        <ThemedView style={styles.section}>
          <ThemedText type='default' style={styles.sectionTitle}>
            Input Variants
          </ThemedText>

          <ThemedView style={styles.inputRow}>
            <ThemedInput
              variant='outline'
              placeholder='Outline variant (default)'
            />
          </ThemedView>

          <ThemedView style={styles.inputRow}>
            <ThemedInput variant='filled' placeholder='Filled variant' />
          </ThemedView>

          <ThemedView style={styles.inputRow}>
            <ThemedInput
              variant='outline'
              placeholder='Disabled input'
              editable={false}
              value='Read only value'
            />
          </ThemedView>

          <ThemedView style={styles.inputRow}>
            <ThemedInput
              variant='outline'
              placeholder='Input with error'
              error='This field is required'
            />
          </ThemedView>
        </ThemedView>

        {/* Input Sizes */}
        <ThemedView style={styles.section}>
          <ThemedText type='default' style={styles.sectionTitle}>
            Input Sizes
          </ThemedText>

          <ThemedView style={styles.inputRow}>
            <ThemedInput size='small' placeholder='Small input' />
          </ThemedView>

          <ThemedView style={styles.inputRow}>
            <ThemedInput size='medium' placeholder='Medium input (default)' />
          </ThemedView>

          <ThemedView style={styles.inputRow}>
            <ThemedInput size='large' placeholder='Large input' />
          </ThemedView>
        </ThemedView>

        {/* Numeric Inputs Section */}
        <ThemedView style={styles.section}>
          <ThemedText type='default' style={styles.sectionTitle}>
            Numeric Inputs
          </ThemedText>

          <ThemedView style={styles.inputRow}>
            <ThemedNumericInput
              label='No Buttons'
              value={quantity}
              onValueChange={setQuantity}
              min={1}
              max={100}
              helperText='Select quantity (1-100)'
              showButtons={false}
            />
          </ThemedView>
          <ThemedView style={styles.inputRow}>
            <ThemedNumericInput
              label='Quantity'
              value={quantity}
              onValueChange={setQuantity}
              min={1}
              max={100}
              helperText='Select quantity (1-100)'
            />
          </ThemedView>

          <ThemedView style={styles.inputRow}>
            <ThemedNumericInput
              label='Price (Rp)'
              value={price}
              onValueChange={setPrice}
              min={0}
              max={10000}
              step={50}
              helperText='Adjust price in increments of 50'
            />
          </ThemedView>

          <ThemedView style={styles.inputRow}>
            <ThemedNumericInput
              label='Discount (%)'
              value={discount}
              onValueChange={setDiscount}
              min={0}
              max={100}
              step={5}
              helperText='Discount percentage (0-100%)'
            />
          </ThemedView>

          <ThemedView style={styles.inputRow}>
            <ThemedNumericInput
              label='Disabled Numeric Input'
              value={50}
              onValueChange={() => {}}
              disabled
            />
          </ThemedView>
        </ThemedView>

        {/* Numeric Input Sizes */}
        <ThemedView style={styles.section}>
          <ThemedText type='default' style={styles.sectionTitle}>
            Numeric Input Sizes
          </ThemedText>

          <ThemedView style={styles.inputRow}>
            <ThemedNumericInput
              label='Small'
              value={smallValue}
              onValueChange={setSmallValue}
              size='small'
            />
          </ThemedView>

          <ThemedView style={styles.inputRow}>
            <ThemedNumericInput
              label='Medium (default)'
              value={mediumValue}
              onValueChange={setMediumValue}
              size='medium'
            />
          </ThemedView>

          <ThemedView style={styles.inputRow}>
            <ThemedNumericInput
              label='Large'
              value={largeValue}
              onValueChange={setLargeValue}
              size='large'
            />
          </ThemedView>
        </ThemedView>

        {/* Summary Section */}
        <ThemedView style={styles.section}>
          <ThemedText type='default' style={styles.sectionTitle}>
            Form Summary
          </ThemedText>

          <ThemedView type='backgroundElement' style={styles.summaryCard}>
            <ThemedText type='small'>Name: {name || '(empty)'}</ThemedText>
            <ThemedText type='small'>Email: {email || '(empty)'}</ThemedText>
            <ThemedText type='small'>
              Password: {password ? '••••••••' : '(empty)'}
            </ThemedText>
            <ThemedText type='small'>Quantity: {quantity}</ThemedText>
            <ThemedText type='small'>Price: Rp {price}</ThemedText>
            <ThemedText type='small'>Discount: {discount}%</ThemedText>
            <ThemedText type='small'>Small Value: {smallValue}</ThemedText>
            <ThemedText type='small'>Medium Value: {mediumValue}</ThemedText>
            <ThemedText type='small'>Large Value: {largeValue}</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Navigation */}
        <ThemedView style={styles.section}>
          <ThemedButton
            variant='ghost'
            onPress={() => router.back()}
            size='small'>
            ← Back to Explore
          </ThemedButton>
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
  inputRow: {
    marginBottom: Spacing.three,
    width: '100%'
  },
  summaryCard: {
    padding: Spacing.three,
    borderRadius: 8,
    gap: Spacing.one
  }
})
