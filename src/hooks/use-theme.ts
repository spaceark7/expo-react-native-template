/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useThemeContext } from '@/contexts/theme-context';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export function useTheme() {
  const { resolvedTheme, themeMode, setThemeMode, toggleTheme } = useThemeContext();

  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...Colors.light,
    }
  }
  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...Colors.dark,
    }
  }

  return {
    lightTheme,
    darkTheme,
    theme: Colors[resolvedTheme],
    themeMode,
    setThemeMode,
    toggleTheme,
  };
}
