import React from 'react'

import TabLayoutContent from '@/components/ui/tab-layout-content'
import { TabBarProvider } from '@/contexts/tabbar-context'

export default function TabLayout() {
  return (
    <TabBarProvider>
      <TabLayoutContent />
    </TabBarProvider>
  )
}
