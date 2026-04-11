import {
    AxiosError,
    type AxiosAdapter,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from 'axios'

import type { AuthEntity } from '@/infrastructure/http-client/core/http/types'

type MockLoginPayload = {
  email?: string
  password?: string
}

export type MockAuthUser = {
  id: string
  name: string
  email: string
  role: string
}

export type MockAuthResponse = AuthEntity & {
  user: MockAuthUser
}

export type MockSessionResponse = {
  message: string
  user: MockAuthUser
  issuedAt: string
}

export const MOCK_AUTH_CREDENTIALS = {
  email: 'demo@spaceark.test',
  password: 'password123'
} as const

const MOCK_USER: MockAuthUser = {
  id: 'user_demo_01',
  name: 'Demo Shopper',
  email: MOCK_AUTH_CREDENTIALS.email,
  role: 'tester'
}

const ACCESS_TOKEN = 'mock-access-token-demo-shopper'
const REFRESH_TOKEN = 'mock-refresh-token-demo-shopper'

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const parsePayload = <T>(data: unknown): T => {
  if (typeof data === 'string') {
    return JSON.parse(data) as T
  }

  return (data ?? {}) as T
}

const buildResponse = <T>(
  config: InternalAxiosRequestConfig,
  status: number,
  data: T
): AxiosResponse<T> => ({
  data,
  status,
  statusText: status >= 400 ? 'Error' : 'OK',
  headers: {},
  config
})

const buildError = <T>(
  config: InternalAxiosRequestConfig,
  status: number,
  message: string,
  data: T
) => {
  const response = buildResponse(config, status, data)

  return new AxiosError(message, `ERR_${status}`, config, null, response)
}

const readAuthorizationHeader = (config: InternalAxiosRequestConfig) => {
  const headers = config.headers as Record<string, unknown> | undefined
  const authorization = headers?.Authorization ?? headers?.authorization

  return typeof authorization === 'string' ? authorization : null
}

export const mockAuthAdapter: AxiosAdapter = async (config) => {
  await wait(650)

  if (config.url?.endsWith('/mock/auth/login')) {
    const payload = parsePayload<MockLoginPayload>(config.data)

    if (!payload.email || !payload.password) {
      throw buildError(config, 400, 'Email and password are required.', {
        message: 'Email and password are required.'
      })
    }

    if (
      payload.email !== MOCK_AUTH_CREDENTIALS.email ||
      payload.password !== MOCK_AUTH_CREDENTIALS.password
    ) {
      throw buildError(config, 401, 'Invalid demo credentials.', {
        message: 'Use the demo credentials shown on the screen.'
      })
    }

    return buildResponse<MockAuthResponse>(config, 200, {
      accessToken: ACCESS_TOKEN,
      refreshToken: REFRESH_TOKEN,
      user: MOCK_USER
    })
  }

  if (config.url?.endsWith('/mock/auth/session')) {
    const authorization = readAuthorizationHeader(config)

    if (authorization !== `Bearer ${ACCESS_TOKEN}`) {
      throw buildError(config, 401, 'Missing or invalid access token.', {
        message: 'This mock endpoint expects a signed-in user.'
      })
    }

    return buildResponse<MockSessionResponse>(config, 200, {
      message: 'Authenticated through the mock server request.',
      user: MOCK_USER,
      issuedAt: new Date().toISOString()
    })
  }

  throw buildError(config, 404, 'Mock auth route not found.', {
    message: 'Unknown mock auth endpoint.'
  })
}
