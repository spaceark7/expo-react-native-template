export const APP_CONFIG = {
  THEME_STORAGE_KEY: '@app_theme_mode'
}

export const HTTP_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
  API_KEY_NAME: process.env.EXPO_PUBLIC_API_KEY_NAME ?? 'x-api-key',
  API_KEY_VALUE: process.env.EXPO_PUBLIC_API_KEY_VALUE ?? '',
  REFRESH_TOKEN_ENDPOINT: 'auth/refresh-token',
  REQUEST_TIMEOUT: 30_000
}
