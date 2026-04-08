import { executeRequest } from '@/infrastructure/http-client/core/http/request'
import type {
    UseFetchOptions,
    UseFetchResult
} from '@/infrastructure/http-client/core/http/types'
import type { AxiosError } from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getHttpInstance } from './setup-http'

export function useFetch<T>(
  url: string,
  options?: UseFetchOptions<T>
): UseFetchResult<T> {
  const { immediate = true, onSuccess, onError, ...restOptions } = options ?? {}

  // Keep callbacks in refs — they must never trigger a re-fetch
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  onSuccessRef.current = onSuccess
  onErrorRef.current = onError

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(immediate)
  const [error, setError] = useState<AxiosError | null>(null)
  const [status, setStatus] = useState<number | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  const fetch = useCallback(() => {
    // Cancel any in-flight request
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)

    const instance = getHttpInstance()

    executeRequest<T>(instance, url, restOptions, controller.signal)
      .then((responseData) => {
        setData(responseData)
        setStatus(200)
        onSuccessRef.current?.(responseData)
      })
      .catch((err: AxiosError) => {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
          return
        }
        setError(err)
        setStatus((err.response?.status as number) ?? null)
        onErrorRef.current?.(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [url, JSON.stringify(restOptions)])

  useEffect(() => {
    if (immediate) {
      fetch()
    }

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [fetch, immediate])

  return { data, loading, error, status, refetch: fetch }
}
