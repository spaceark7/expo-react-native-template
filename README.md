# Buku Belanja - React Native App Template 📱

A production-ready React Native application template built with Expo, featuring a comprehensive UI component library, theme management, and modern navigation patterns.

## 🎯 Overview

This is a base template application designed to accelerate React Native development. It provides a solid foundation with pre-built components, theme system, and navigation setup that follows modern best practices.

## ✨ Features

### 🎨 Theme System

- **Dark/Light Mode Support** - Seamless theme switching with system preference detection
- **Theme Persistence** - User preferences saved using AsyncStorage
- **Dynamic Theme Provider** - Context-based theme management
- **Native Navigation Bar Styling** - Automatic adjustment for Android navigation bar
- **Responsive Font Sizing** - Automatic font scaling for tablets and larger devices
  - Phone: Optimized for mobile screens (< 600dp)
  - Tablet: Scaled up for tablet displays (600-1024dp)
  - Desktop: Large format for desktop/web (> 1024dp)

### 🧩 UI Component Library

#### Input Components

- **ThemedInput** - Versatile text input with multiple variants and sizes
  - Password input with eye toggle button
  - Auto-detect `secureTextEntry` prop
  - Support for icons, error states, and helper text
  - Variants: `outline` and `filled`
  - Sizes: `small`, `medium`, `large`

- **ThemedNumericInput** - Specialized numeric input with increment/decrement buttons
  - Optional show/hide buttons
  - Min/max value validation
  - Graceful max value handling
  - Responsive font sizing

#### Button Components

- **ThemedButton** - Flexible button component
  - Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `success`
  - Sizes: `small`, `medium`, `large`
  - Icon support: `leftIcon`, `rightIcon`, `iconOnly` mode
  - Loading state support
  - Disabled state handling

#### Other Components

- **ThemedText** - Typography component with consistent styling
- **ThemedView** - Container component with theme-aware backgrounds
- **ThemeToggle** - UI control for switching between light/dark/system modes
- **Collapsible** - Animated expandable sections

### 🧭 Navigation

#### Tab Bar System

- **Native Tabs** - Using Expo Router's Native Tabs for optimal performance
- **Auto-Hide Tab Bar** - Automatically hides on nested screens
  - Smart pathname detection
  - Works for any new tab without configuration
  - Zero boilerplate required

#### Screen Organization

- File-based routing with Expo Router
- Organized tab structure: Home, Explore, Settings
- Stack navigation within each tab
- Demo screens for component showcase

### � HTTP Client (`useFetch`)

- **Framework-agnostic core** — `infrastructure/http-client/core/http/` has zero framework imports, reusable for Vue or any future adapter
- **`useFetch` hook** — Nuxt-inspired data fetching hook with `{ data, loading, error, status, refetch }`
- **Auto-fetch on mount** — `immediate: true` by default; set `false` for lazy/manual trigger
- **Pull-to-refresh integration** — pass `refreshing={loading}` + `onRefresh={refetch}` to `ScrollViewRefresh`
- **Request deduplication** — `dedupe: true` shares in-flight Promises across concurrent callers
- **Abort on unmount** — uses `AbortController` to cancel in-flight requests when component unmounts
- **`onSuccess` / `onError` callbacks** — stable refs, never cause re-fetch loops
- **Automatic token refresh** — 401 responses with `Require-Token: true` trigger a token refresh flow
  - Concurrent 401s are queued and flushed together after one successful refresh
  - After 3 failed refresh attempts → force logout (Alert + navigation)
- **Zustand auth store** — tokens persisted to AsyncStorage via Zustand `persist` middleware
- **Fully overridable** — swap token source, logout handler, or base URL per instance
- **Vue-ready** — adapter stubs in `src/adapters/vue/` ready to implement with Pinia + Vue Router

> See [docs/http-client.md](docs/http-client.md) for full API reference and usage examples.

### �🎭 Animations

- Animated splash screen overlay
- Smooth theme transitions
- Collapsible component animations using react-native-reanimated

### 📱 Platform Support

- **iOS** - Full support with native components
- **Android** - Optimized with native navigation bar styling
- **Web** - Responsive web version included

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI
- For physical device testing: Android device with WiFi debugging enabled

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm start
   ```

3. **Run on device/emulator**

   ```bash
   # Android
   npx expo run:android

   # iOS
   npx expo run:ios

   # Web
   npm run web
   ```

### WiFi Debugging Setup (Android)

1. Enable Developer Options on your Android device
2. Enable "Wireless debugging"
3. Connect using ADB:
   ```bash
   adb connect <device-ip>:<port>
   ```
4. Verify connection:
   ```bash
   adb devices
   ```

## 📂 Project Structure

```
src/
├── app/
│   ├── (tabs)/               # Tab-based navigation
│   │   ├── (index)/          # Home tab
│   │   ├── explore/          # Explore tab with demos
│   │   └── setting/          # Settings tab
│   └── profile/              # Profile stack screens
├── components/
│   ├── themed-input.tsx
│   ├── themed-numeric-input.tsx
│   ├── themed-button.tsx
│   ├── theme-toggle.tsx
│   ├── app-tabs.tsx
│   └── ui/                   # Specialized UI components
├── contexts/
│   ├── theme-context.tsx
│   └── tabbar-context.tsx
├── infrastructure/
│   └── http-client/
│       ├── core/
│       │   └── http/         # Framework-agnostic HTTP core
│       │       ├── types.ts      # AuthEntity, HttpConfig, UseFetchOptions
│       │       ├── interceptors.ts
│       │       ├── axios-instance.ts
│       │       └── request.ts    # executeRequest + dedup cache
│       └── adapters/
│           ├── react/        # React Native / Expo bindings
│           │   ├── auth-store.ts # Zustand + AsyncStorage
│           │   ├── force-logout.ts
│           │   ├── setup-http.ts
│           │   └── use-fetch.ts  # useFetch hook
│           └── vue/          # Future Vue bindings (stubs)
├── hooks/
│   ├── use-theme.ts
│   ├── use-hide-tabbar.ts
│   └── use-color-scheme.ts
├── styles/
│   └── styles.ts
└── constants/
    ├── theme.ts              # Color definitions
    └── config.ts             # App + HTTP configuration
```

### Documentation

```
docs/
└── http-client.md        # useFetch & HTTP client full reference
```

## 🎨 Customization

### Responsive Font Sizes

The template includes automatic responsive font sizing. You can use it in your custom components:

```typescript
import { responsiveFontSize, responsiveLineHeight } from '@/constants/theme'

const styles = StyleSheet.create({
  text: {
    fontSize: responsiveFontSize('default'), // Auto-scales: 16/18/20
    lineHeight: responsiveLineHeight(responsiveFontSize('default'))
  },
  heading: {
    fontSize: responsiveFontSize('title'), // Auto-scales: 32/40/48
    lineHeight: responsiveLineHeight(responsiveFontSize('title'))
  }
})
```

### Adding a New Theme Color

Edit `src/constants/theme.ts`:

```typescript
export const Colors = {
  light: {
    // Add your color
    myColor: '#123456'
  },
  dark: {
    // Add dark variant
    myColor: '#654321'
  }
}
```

### Creating a New Tab

1. Create folder in `src/app/(tabs)/`
2. Add `_layout.tsx` and `index.tsx`
3. Tab bar automatically handles visibility!

### Using Components

```typescript
import { ThemedInput } from '@/components/themed-input'
import { ThemedButton } from '@/components/themed-button'
import { Ionicons } from '@expo/vector-icons'

function MyScreen() {
  return (
    <>
      {/* Password input - auto-detects and shows eye button */}
      <ThemedInput
        label="Password"
        placeholder="Enter password"
        secureTextEntry
      />

      {/* Primary button */}
      <ThemedButton variant="primary" onPress={handleSubmit}>
        Submit
      </ThemedButton>

      {/* Button with left icon */}
      <ThemedButton
        variant="outline"
        leftIcon={<Ionicons name="add" size={20} color="#185FA5" />}
        onPress={handleAdd}>
        Add Item
      </ThemedButton>

      {/* Icon-only button */}
      <ThemedButton
        variant="ghost"
        iconOnly
        onPress={handleSettings}>
        <Ionicons name="settings" size={24} color="#000" />
      </ThemedButton>
    </>
  )
}
```

## 🛠️ Built With

- [Expo](https://expo.dev/) - React Native framework
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based navigation
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animations
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) - Data persistence

## 📝 Key Concepts

### Responsive Font Sizing

All text components automatically scale based on device size:

```typescript
import { responsiveFontSize } from '@/constants/theme'

// Get responsive font size
const fontSize = responsiveFontSize('default')
// Phone: 16, Tablet: 18, Desktop: 20

// Available sizes: tiny, small, default, medium, large, xlarge, title, display
```

Device size detection based on screen width:

- **Phone**: < 600dp width
- **Tablet**: 600-1024dp width
- **Desktop**: > 1024dp width

All themed components (ThemedText, ThemedInput, ThemedButton, etc.) use responsive sizing automatically.

### Automatic Tab Bar Hiding

The tab bar automatically hides on nested screens using smart pathname detection:

- Root screens (/, /explore, /setting) → Tabs visible
- Nested screens (/explore/demo, /setting/profile) → Tabs hidden
- No manual configuration needed for new tabs!

### Theme Management

Theme is managed through React Context and persists across app restarts:

```typescript
const { theme, themeMode, setThemeMode, toggleTheme } = useTheme()

// Switch to dark mode
setThemeMode('dark')

// Toggle between light/dark
toggleTheme()
```

## 🤝 Contributing

This is a template project. Feel free to fork and customize for your needs!

## 👨‍💻 Author

**Hasbi**

- GitHub: [@spaceark7](https://github.com/spaceark7)
- Template created for rapid React Native development

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with Expo's excellent framework and tools
- Inspired by modern React Native best practices
- Component design influenced by popular UI libraries

---

**Happy Coding!** 🚀
