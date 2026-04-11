import { useTabBar } from '@/contexts/tabbar-context'
import { useTheme } from '@/hooks/use-theme'
import { NativeTabs } from 'expo-router/build/native-tabs'
import React from 'react'

export default function AppTabs() {
  const { theme } = useTheme()
  const { isVisible } = useTabBar()

  return (
    <NativeTabs
      hidden={!isVisible}
      backgroundColor={theme.background}
      indicatorColor={theme.appBarIndicator}
      labelStyle={{
        selected: { color: theme.appBarText },
        default: { color: theme.textSecondary }
      }}
      iconColor={{
        default: theme.textSecondary,
        selected: theme.appBarIcon
      }}
      rippleColor={theme.primary}>
      <NativeTabs.Trigger name='home'>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode='template'
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='explore'>
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode='template'
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='setting'>
        <NativeTabs.Trigger.Label>Setting</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            selected: 'gear',
            default: 'gearshape'
          }}
          md='settings'
          renderingMode='template'
        />
      </NativeTabs.Trigger>
      {/* <NativeTabs.Trigger
        name='profile'
        children={undefined}></NativeTabs.Trigger> */}
    </NativeTabs>
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: theme.appBarIcon,
    //     tabBarInactiveTintColor: theme.textSecondary,
    //     tabBarStyle: { backgroundColor: theme.background },
    //     headerStyle: { backgroundColor: theme.background },
    //     headerTitleStyle: { color: theme.text }
    //   }}>
    //   <Tabs.Screen
    //     name='index'
    //     options={{
    //       title: 'Home',
    //       tabBarIcon: ({ color, size }) => (
    //         <MaterialIcons name='home' size={size} color={color} />
    //       )
    //     }}
    //   />
    //   <Tabs.Screen
    //     name='explore'
    //     options={{
    //       title: 'Explore',
    //       tabBarIcon: ({ color, size }) => (
    //         <MaterialIcons name='explore' size={size} color={color} />
    //       )
    //     }}
    //   />
    //   <Tabs.Screen
    //     name='setting'
    //     options={{
    //       title: 'Setting',
    //       tabBarIcon: ({ color, size }) => (
    //         <MaterialIcons name='settings' size={size} color={color} />
    //       )
    //     }}
    //   />
    // </Tabs>
  )
}
