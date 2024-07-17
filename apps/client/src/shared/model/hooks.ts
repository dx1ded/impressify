import _ from "lodash"
import { useCallback, useContext, useMemo } from "react"
import { useDispatch, type TypedUseSelectorHook, useSelector } from "react-redux"

import type { AppDispatch, AppStore } from "~/app/model"
import { DebouncedContext } from "~/shared/model"

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppStore> = useSelector

export const useDebouncedFunctions = () => {
  const { fns } = useContext(DebouncedContext)

  const register = useCallback(
    <Func extends (...args: never[]) => void>(id: string, fn: Func, ms: number) => {
      const item = fns.current.find((item) => item.id === id)
      if (item) return item.fn
      const newItem = { id, fn: _.debounce(fn, ms) }
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
