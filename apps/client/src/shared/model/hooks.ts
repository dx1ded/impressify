import { useCallback, useContext, useMemo } from "react"
import { useDispatch, type TypedUseSelectorHook, useSelector } from "react-redux"

import type { AppDispatch, AppStore } from "~/app/model"
import { debounce } from "~/shared/lib"
import { DebouncedContext } from "~/shared/model"

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppStore> = useSelector

export const useDebouncedFunctions = () => {
  const { fns } = useContext(DebouncedContext)

  const register = useCallback(
    <Func extends (...args: any[]) => void>(id: string, fn: Func, ms: number, deps?: any[]) => {
      const item = fns.current.find((item) => item.id === id)
      const newItem = {
        id,
        fn: debounce(fn, ms),
        deps,
      }
      if (item) {
        const depsChanged = deps && item.deps && !deps.every((dep, index) => dep === item.deps![index])
        if (!depsChanged) return item.fn
        if (item.fn.pending()) {
          newItem.fn(...(item.fn.lastArgs() as unknown as Parameters<Func>))
          item.fn.cancel()
        }
        fns.current = fns.current.filter((item) => item.id !== id)
      }
      fns.current.push(newItem)
      return newItem.fn
    },
    [fns],
  )

  const call = useCallback(
    (ids: string | string[]) => {
      if (Array.isArray(ids)) {
        fns.current.forEach((item) => ids.includes(item.id) && item.fn())
      } else {
        const item = fns.current.find((item) => item.id === ids)
        if (!item) return
        item.fn()
      }
    },
    [fns],
  )

  const cancel = useCallback(
    (ids: string | string[]) => {
      if (Array.isArray(ids)) {
        fns.current.forEach((item) => ids.includes(item.id) && item.fn.cancel())
      } else {
        const item = fns.current.find((item) => item.id === ids)
        if (!item) return
        item.fn.cancel()
      }
    },
    [fns],
  )

  const flush = useCallback(
    (ids: string | string[]) => {
      if (Array.isArray(ids)) {
        fns.current.forEach((item) => ids.includes(item.id) && item.fn.flush())
      } else {
        const item = fns.current.find((item) => item.id === ids)
        if (!item) return
        item.fn.flush()
      }
    },
    [fns],
  )

  const flushWithPattern = useCallback(
    (id: string) => {
      fns.current.forEach((item) => item.id.startsWith(id) && item.fn.flush())
    },
    [fns],
  )

  const flushAll = useCallback(() => {
    fns.current.forEach((item) => item.fn.flush())
  }, [fns])

  const deleteDebounced = useCallback(
    (ids: string | string[]) => {
      let _ids = ids
      if (!Array.isArray(ids)) {
        _ids = [ids]
      }
      fns.current = fns.current.filter((item) => {
        if (_ids.includes(item.id)) item.fn.cancel()
        return !_ids.includes(item.id)
      })
    },
    [fns],
  )

  const deleteWithPattern = useCallback(
    (id: string) => {
      fns.current = fns.current.filter((item) => {
        if (item.id.startsWith(id)) item.fn.cancel()
        return !item.id.startsWith(id)
      })
    },
    [fns],
  )

  const deleteAll = useCallback(() => {
    fns.current.forEach((item) => item.fn.cancel())
    fns.current = []
  }, [fns])

  return useMemo(
    () => ({
      register,
      call,
      cancel,
      flush,
      flushWithPattern,
      flushAll,
      deleteDebounced,
      deleteWithPattern,
      deleteAll,
    }),
    [register, call, cancel, flush, flushWithPattern, flushAll, deleteDebounced, deleteWithPattern, deleteAll],
  )
}
