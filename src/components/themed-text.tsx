import { Platform, StyleSheet, Text, type TextProps } from 'react-native'

import {
  Fonts,
  responsiveFontSize,
  responsiveLineHeight,
  ThemeColor
} from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'caption'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code'
  themeColor?: ThemeColor
  className?: string
}

export function ThemedText({
  style,
  type = 'default',
  themeColor,
  className,
  ...rest
}: ThemedTextProps) {
  const { theme } = useTheme()

  return (
    <Text
      className={className}
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'caption' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  caption: {
    fontSize: responsiveFontSize('tiny'),
    lineHeight: responsiveLineHeight(responsiveFontSize('tiny'))
  },
  small: {
    fontSize: responsiveFontSize('small'),
    lineHeight: responsiveLineHeight(responsiveFontSize('small')),
    fontWeight: '500'
  },
  smallBold: {
    fontSize: responsiveFontSize('small'),
    lineHeight: responsiveLineHeight(responsiveFontSize('small')),
    fontWeight: '700'
  },
  default: {
    fontSize: responsiveFontSize('default'),
    lineHeight: responsiveLineHeight(responsiveFontSize('default')),
    fontWeight: '500'
  },
  title: {
    fontSize: responsiveFontSize('display'),
    fontWeight: '600',
    lineHeight: responsiveLineHeight(responsiveFontSize('display'))
  },
  subtitle: {
    fontSize: responsiveFontSize('title'),
    lineHeight: responsiveLineHeight(responsiveFontSize('title')),
    fontWeight: '600'
  },
  link: {
    fontSize: responsiveFontSize('small'),
    lineHeight: responsiveLineHeight(responsiveFontSize('small'))
  },
  linkPrimary: {
    fontSize: responsiveFontSize('small'),
    lineHeight: responsiveLineHeight(responsiveFontSize('small')),
    color: '#3c87f7'
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: '700' }) ?? '500',
    fontSize: responsiveFontSize('tiny')
  }
})
