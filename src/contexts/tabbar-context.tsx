import { usePathname } from 'expo-router'
import React, { createContext, useContext, useEffect, useState } from 'react'

type TabBarContextType = {
  isVisible: boolean
  setVisible: (visible: boolean) => void
  hide: () => void
  show: () => void
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined)

export function TabBarProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()
  const exceptionScreens = ['profile'] // Screens that should never show the tab bar

  // Auto-detect if we're on a nested screen
  useEffect(() => {
    // Root/tab screens that should show the tab bar are detected by:
    // 1. Exact root "/" (home)
    // 2. Paths ending with "/index" (any tab's index screen)
    // 3. Single-level paths like "/explore", "/setting", "/profile" etc.
    //    (but NOT deeper paths like "/explore/button-demo")

    const pathSegments = pathname
      .split('/')
      .filter((seg) => seg !== '' && !seg.startsWith('('))

    console.log('Path segments:', pathSegments) // Debug log to see path segments

    const isRootScreen =
      pathname === '/' || // Home root
      pathname.endsWith('/index') || // Any index screen
      (pathSegments.length === 1 && // Single-level path (root tabs) ||
        !pathSegments.some((segment) => exceptionScreens.includes(segment))) // Exclude exception screens from showing tab bar

    setIsVisible(isRootScreen)
  }, [pathname])

  const setVisible = (visible: boolean) => {
    setIsVisible(visible)
  }

  const hide = () => setIsVisible(false)
  const show = () => setIsVisible(true)

  return (
    <TabBarContext.Provider value={{ isVisible, setVisible, hide, show }}>
      {children}
    </TabBarContext.Provider>
  )
}

export function useTabBar() {
  const context = useContext(TabBarContext)
  if (context === undefined) {
    throw new Error('useTabBar must be used within a TabBarProvider')
  }
  return context
}
