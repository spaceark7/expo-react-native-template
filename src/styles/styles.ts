import { responsiveFontSize, Spacing } from "@/constants/theme"
import { StyleSheet } from "react-native"

// Card Styles
export const CardStyles = StyleSheet.create({
  container: {
    borderRadius: Spacing.two,
    padding: Spacing.four,
    gap: Spacing.four,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1
  },
  title: {
    fontSize: responsiveFontSize('default'),
    fontWeight: 'bold'
  },
  description: {
    fontSize: responsiveFontSize('medium'),
    color: '#666'
  }
})

// Common Styles
export const CommonStyles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  padded: {
    padding: Spacing.four
  },
  rounded: {
    borderRadius: Spacing.four
  }
})