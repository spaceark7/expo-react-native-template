import axios, { type AxiosInstance } from 'axios'
import { setupInterceptors } from './interceptors'
import type { HttpConfig } from './types'

export function createHttpInstance(config: HttpConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
      'Require-Token': true
    }
  })

  setupInterceptors(instance, config)

  return instance
}
