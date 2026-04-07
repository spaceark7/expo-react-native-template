import { View, type ViewProps } from 'react-native'

import { ThemeColor } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

export type ThemedViewProps = ViewProps & {
  lightColor?: string
  darkColor?: string
  type?: ThemeColor
  className?: string
}

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type,
  className,
  ...otherProps
}: ThemedViewProps) {
  const { theme } = useTheme()

  // Only apply background color if type is explicitly set
  const backgroundStyle = type ? { backgroundColor: theme[type] } : {}

  return (
    <View
      className={className}
      style={[backgroundStyle, style]}
      {...otherProps}
    />
  )
}
