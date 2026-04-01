/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

const primary = {
  50: '#E8F1F9',
  100: '#D1E3F3',
  200: '#A3C7E7',
  300: '#75ABDB',
  400: '#478FCE',
  500: '#185FA5', // Base Blue
  600: '#14508C',
  700: '#104172',
  800: '#0C3159',
  900: '#08213F',
};

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    primary50: primary[50],
    primary100: primary[100],
    primary200: primary[200],
    primary300: primary[300],
    primary400: primary[400],
    primary: primary[500],
    primary600: primary[600],
    primary700: primary[700],
    primary800: primary[800],
    primary900: primary[900],
    secondary: '#647896',
    tertiary: '#3B6D11',
    success: '#3B6D11',
    neutral: '#75777D',
    danger: '#B00020',
    appBarText: '#185FA5',
    appBarIcon: '#185FA5',
    appBarIndicator: primary[100],
  },
  dark: {
    text: '#ffffff',
    background: '#131B2E',
    backgroundElement: '#1E293B',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    primary50: primary[50],
    primary100: primary[100],
    primary200: primary[200],
    primary300: primary[300],
    primary400: primary[400],
    primary: primary[500],
    primary600: primary[600],
    primary700: primary[700],
    primary800: primary[800],
    primary900: primary[900],
    secondary: '#3B6D11',
    tertiary: '#924B00',
    success: '#3B6D11',
    neutral: '#0F172A',
    danger: '#B00020',
    appBarText: '#ffffff',
    appBarIcon: '#ffffff',
    appBarIndicator: '#185FA5',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
