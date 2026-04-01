import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'

import { useTabBar } from '@/contexts/tabbar-context'

/**
 * Hook to manually hide tab bar when screen is focused and show it when unfocused
 * 
 * NOTE: You don't need this hook in most cases! The TabBarProvider automatically
 * detects nested screens and hides the tab bar. This works for any screen that's
 * not a root tab screen (/, /explore, /setting).
 * 
 * Use this hook ONLY when you need custom control, such as:
 * - Hiding tab bar on a specific root tab screen
 * - Custom show/hide logic based on user interaction
 * 
 * @example
 * ```tsx
 * export default function SpecialRootScreen() {
 *   useHideTabBar() // Force hide tabs on this root screen
 *   return <View>...</View>
 * }
 * ```
 */
export function useHideTabBar() {
  const { hide, show } = useTabBar()

  useFocusEffect(
    useCallback(() => {
      hide()
      return () => {
        show()
      }
    }, [hide, show])
  )
}
