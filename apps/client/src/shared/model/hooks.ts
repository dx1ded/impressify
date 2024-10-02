import { useRef, useCallback } from "react"
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import type { AppDispatch, AppStore } from "~/app/model"

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppStore> = useSelector

export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef<T>(callback)

  // Always keep the callback reference up-to-date
  callbackRef.current = callback

  // Return a stable function that always calls the latest callback
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args)
  }, []) as T
}
