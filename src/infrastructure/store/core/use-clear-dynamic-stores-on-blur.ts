import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'

import type { RouteLeaveAwareDynamicStore } from './create-dynamic-store'

export const useClearDynamicStoresOnBlur = <TKey>(
  storeRegistry: RouteLeaveAwareDynamicStore<TKey>,
  keys: TKey[]
) => {
  const keysRef = useRef(keys)

  useEffect(() => {
    keysRef.current = keys
  }, [keys])

  const { clearStore, shouldDestroyStoreOnRouteLeave } = storeRegistry

  useFocusEffect(
    useCallback(() => {
      return () => {
        for (const key of keysRef.current) {
          if (shouldDestroyStoreOnRouteLeave(key)) {
            clearStore(key)
          }
        }
      }
    }, [clearStore, shouldDestroyStoreOnRouteLeave])
  )
}
