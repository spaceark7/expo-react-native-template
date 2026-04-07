/**
 * Material Design 3 Theme System
 * Generated from Material Theme Builder with custom seed color #185FA5
 * 
 * Using Material 3 color system for comprehensive theming support
 * Learn more: https://m3.material.io/styles/color/system/overview
 */

import '@/global.css'

import materialTheme from '@/assets/material-theme.json'
import { Dimensions, Platform } from 'react-native'

/**
 * Material Design 3 Color Palettes
 * Tonal palettes provide systematic color variations (0-100)
 */
export const Palettes = {
  primary: materialTheme.palettes.primary,
  secondary: materialTheme.palettes.secondary,
  tertiary: materialTheme.palettes.tertiary,
  neutral: materialTheme.palettes.neutral,
  neutralVariant: materialTheme.palettes['neutral-variant'],
} as const

/**
 * Material Design 3 Color Schemes
 * Complete color system for light and dark themes
 */
export const Colors = {
  light: {
    // Material 3 Primary Colors
    primary: materialTheme.schemes.light.primary,
    onPrimary: materialTheme.schemes.light.onPrimary,
    primaryContainer: materialTheme.schemes.light.primaryContainer,
    onPrimaryContainer: materialTheme.schemes.light.onPrimaryContainer,
    primaryFixed: materialTheme.schemes.light.primaryFixed,
    primaryFixedDim: materialTheme.schemes.light.primaryFixedDim,
    onPrimaryFixed: materialTheme.schemes.light.onPrimaryFixed,
    onPrimaryFixedVariant: materialTheme.schemes.light.onPrimaryFixedVariant,

    // Material 3 Secondary Colors
    secondary: materialTheme.schemes.light.secondary,
    onSecondary: materialTheme.schemes.light.onSecondary,
    secondaryContainer: materialTheme.schemes.light.secondaryContainer,
    onSecondaryContainer: materialTheme.schemes.light.onSecondaryContainer,
    secondaryFixed: materialTheme.schemes.light.secondaryFixed,
    secondaryFixedDim: materialTheme.schemes.light.secondaryFixedDim,
    onSecondaryFixed: materialTheme.schemes.light.onSecondaryFixed,
    onSecondaryFixedVariant: materialTheme.schemes.light.onSecondaryFixedVariant,

    // Material 3 Tertiary Colors
    tertiary: materialTheme.schemes.light.tertiary,
    onTertiary: materialTheme.schemes.light.onTertiary,
    tertiaryContainer: materialTheme.schemes.light.tertiaryContainer,
    onTertiaryContainer: materialTheme.schemes.light.onTertiaryContainer,
    tertiaryFixed: materialTheme.schemes.light.tertiaryFixed,
    tertiaryFixedDim: materialTheme.schemes.light.tertiaryFixedDim,
    onTertiaryFixed: materialTheme.schemes.light.onTertiaryFixed,
    onTertiaryFixedVariant: materialTheme.schemes.light.onTertiaryFixedVariant,

    // Material 3 Error Colors
    error: materialTheme.schemes.light.error,
    onError: materialTheme.schemes.light.onError,
    errorContainer: materialTheme.schemes.light.errorContainer,
    onErrorContainer: materialTheme.schemes.light.onErrorContainer,

    // Material 3 Surface Colors
    surface: materialTheme.schemes.light.surface,
    onSurface: materialTheme.schemes.light.onSurface,
    surfaceDim: materialTheme.schemes.light.surfaceDim,
    surfaceBright: materialTheme.schemes.light.surfaceBright,
    surfaceContainerLowest: materialTheme.schemes.light.surfaceContainerLowest,
    surfaceContainerLow: materialTheme.schemes.light.surfaceContainerLow,
    surfaceContainer: materialTheme.schemes.light.surfaceContainer,
    surfaceContainerHigh: materialTheme.schemes.light.surfaceContainerHigh,
    surfaceContainerHighest: materialTheme.schemes.light.surfaceContainerHighest,
    surfaceVariant: materialTheme.schemes.light.surfaceVariant,
    onSurfaceVariant: materialTheme.schemes.light.onSurfaceVariant,
    surfaceTint: materialTheme.schemes.light.surfaceTint,

    // Material 3 Inverse Colors
    inverseSurface: materialTheme.schemes.light.inverseSurface,
    inverseOnSurface: materialTheme.schemes.light.inverseOnSurface,
    inversePrimary: materialTheme.schemes.light.inversePrimary,

    // Material 3 Outline Colors
    outline: materialTheme.schemes.light.outline,
    outlineVariant: materialTheme.schemes.light.outlineVariant,

    // Material 3 Utility Colors
    shadow: materialTheme.schemes.light.shadow,
    scrim: materialTheme.schemes.light.scrim,

    // Legacy/Convenience Aliases (for backward compatibility)
    text: materialTheme.schemes.light.onSurface,
    background: materialTheme.schemes.light.surface,
    backgroundElement: materialTheme.schemes.light.surfaceContainer,
    backgroundSelected: materialTheme.schemes.light.surfaceContainerHigh,
    textSecondary: materialTheme.schemes.light.onSurfaceVariant,

    // Palette Shortcuts
    primary50: Palettes.primary[5],
    primary100: Palettes.primary[10],
    primary200: Palettes.primary[20],
    primary300: Palettes.primary[30],
    primary400: Palettes.primary[40],
    primary500: Palettes.primary[50],
    primary600: Palettes.primary[60],
    primary700: Palettes.primary[70],
    primary800: Palettes.primary[80],
    primary900: Palettes.primary[90],

    // Custom App Colors
    success: materialTheme.schemes.light.secondary,
    danger: materialTheme.schemes.light.error,
    neutral: materialTheme.schemes.light.surfaceVariant,

    // AppBar Colors
    appBarText: materialTheme.schemes.light.primary,
    appBarIcon: materialTheme.schemes.light.onPrimaryContainer,
    appBarIndicator: materialTheme.schemes.light.primaryContainer,

    // Card Colors
    cardBackground: materialTheme.schemes.light.surfaceContainerHigh,
    cardText: materialTheme.schemes.light.onSurface,
  },
  dark: {
    // Material 3 Primary Colors
    primary: materialTheme.schemes.dark.primary,
    onPrimary: materialTheme.schemes.dark.onPrimary,
    primaryContainer: materialTheme.schemes.dark.primaryContainer,
    onPrimaryContainer: materialTheme.schemes.dark.onPrimaryContainer,
    primaryFixed: materialTheme.schemes.dark.primaryFixed,
    primaryFixedDim: materialTheme.schemes.dark.primaryFixedDim,
    onPrimaryFixed: materialTheme.schemes.dark.onPrimaryFixed,
    onPrimaryFixedVariant: materialTheme.schemes.dark.onPrimaryFixedVariant,

    // Material 3 Secondary Colors
    secondary: materialTheme.schemes.dark.secondary,
    onSecondary: materialTheme.schemes.dark.onSecondary,
    secondaryContainer: materialTheme.schemes.dark.secondaryContainer,
    onSecondaryContainer: materialTheme.schemes.dark.onSecondaryContainer,
    secondaryFixed: materialTheme.schemes.dark.secondaryFixed,
    secondaryFixedDim: materialTheme.schemes.dark.secondaryFixedDim,
    onSecondaryFixed: materialTheme.schemes.dark.onSecondaryFixed,
    onSecondaryFixedVariant: materialTheme.schemes.dark.onSecondaryFixedVariant,

    // Material 3 Tertiary Colors
    tertiary: materialTheme.schemes.dark.tertiary,
    onTertiary: materialTheme.schemes.dark.onTertiary,
    tertiaryContainer: materialTheme.schemes.dark.tertiaryContainer,
    onTertiaryContainer: materialTheme.schemes.dark.onTertiaryContainer,
    tertiaryFixed: materialTheme.schemes.dark.tertiaryFixed,
    tertiaryFixedDim: materialTheme.schemes.dark.tertiaryFixedDim,
    onTertiaryFixed: materialTheme.schemes.dark.onTertiaryFixed,
    onTertiaryFixedVariant: materialTheme.schemes.dark.onTertiaryFixedVariant,

    // Material 3 Error Colors
    error: materialTheme.schemes.dark.error,
    onError: materialTheme.schemes.dark.onError,
    errorContainer: materialTheme.schemes.dark.errorContainer,
    onErrorContainer: materialTheme.schemes.dark.onErrorContainer,

    // Material 3 Surface Colors
    surface: materialTheme.schemes.dark.surface,
    onSurface: materialTheme.schemes.dark.onSurface,
    surfaceDim: materialTheme.schemes.dark.surfaceDim,
    surfaceBright: materialTheme.schemes.dark.surfaceBright,
    surfaceContainerLowest: materialTheme.schemes.dark.surfaceContainerLowest,
    surfaceContainerLow: materialTheme.schemes.dark.surfaceContainerLow,
    surfaceContainer: materialTheme.schemes.dark.surfaceContainer,
    surfaceContainerHigh: materialTheme.schemes.dark.surfaceContainerHigh,
    surfaceContainerHighest: materialTheme.schemes.dark.surfaceContainerHighest,
    surfaceVariant: materialTheme.schemes.dark.surfaceVariant,
    onSurfaceVariant: materialTheme.schemes.dark.onSurfaceVariant,
    surfaceTint: materialTheme.schemes.dark.surfaceTint,

    // Material 3 Inverse Colors
    inverseSurface: materialTheme.schemes.dark.inverseSurface,
    inverseOnSurface: materialTheme.schemes.dark.inverseOnSurface,
    inversePrimary: materialTheme.schemes.dark.inversePrimary,

    // Material 3 Outline Colors
    outline: materialTheme.schemes.dark.outline,
    outlineVariant: materialTheme.schemes.dark.outlineVariant,

    // Material 3 Utility Colors
    shadow: materialTheme.schemes.dark.shadow,
    scrim: materialTheme.schemes.dark.scrim,

    // Legacy/Convenience Aliases (for backward compatibility)
    text: materialTheme.schemes.dark.onSurface,
    background: materialTheme.schemes.dark.surface,
    backgroundElement: materialTheme.schemes.dark.surfaceContainer,
    backgroundSelected: materialTheme.schemes.dark.surfaceContainerHigh,
    textSecondary: materialTheme.schemes.dark.onSurfaceVariant,

    // Palette Shortcuts
    primary50: Palettes.primary[5],
    primary100: Palettes.primary[10],
    primary200: Palettes.primary[20],
    primary300: Palettes.primary[30],
    primary400: Palettes.primary[40],
    primary500: Palettes.primary[50],
    primary600: Palettes.primary[60],
    primary700: Palettes.primary[70],
    primary800: Palettes.primary[80],
    primary900: Palettes.primary[90],

    // Custom App Colors
    success: materialTheme.schemes.dark.secondary,
    danger: materialTheme.schemes.dark.error,
    neutral: materialTheme.schemes.dark.surfaceVariant,

    // AppBar Colors
    appBarText: materialTheme.schemes.dark.onSurface,
    appBarIcon: materialTheme.schemes.dark.onSurface,
    appBarIndicator: materialTheme.schemes.dark.primaryContainer,

    // Card Colors
    cardBackground: materialTheme.schemes.dark.surfaceContainerHigh,
    cardText: materialTheme.schemes.dark.onSurface,
  },
} as const

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark

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

/**
 * Device size breakpoints (width in dp)
 */
export const Breakpoints = {
  phone: 0,      // < 600
  tablet: 600,   // 600 - 1024
  desktop: 1024, // > 1024
} as const;

/**
 * Detect device size category based on screen width
 */
export function getDeviceSize(): 'phone' | 'tablet' | 'desktop' {
  const { width } = Dimensions.get('window');

  if (width >= Breakpoints.desktop) {
    return 'desktop';
  } else if (width >= Breakpoints.tablet) {
    return 'tablet';
  }
  return 'phone';
}

/**
 * Font size scales for different device sizes
 */
export const FontSizes = {
  phone: {
    tiny: 10,
    small: 14,
    default: 16,
    medium: 18,
    large: 20,
    xlarge: 24,
    title: 32,
    display: 48,
  },
  tablet: {
    tiny: 14,
    small: 16,
    default: 18,
    medium: 20,
    large: 24,
    xlarge: 28,
    title: 40,
    display: 56,
  },
  desktop: {
    tiny: 16,
    small: 18,
    default: 20,
    medium: 22,
    large: 26,
    xlarge: 32,
    title: 48,
    display: 64,
  },
} as const;

/**
 * Get responsive font size based on current device size
 */
export function responsiveFontSize(
  size: keyof typeof FontSizes.phone
): number {
  const deviceSize = getDeviceSize();
  return FontSizes[deviceSize][size];
}

/**
 * Line height multiplier for responsive text
 */
export function responsiveLineHeight(fontSize: number): number {
  return Math.round(fontSize * 1.5);
}
