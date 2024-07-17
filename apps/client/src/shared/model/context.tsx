import type { DebouncedFunc } from "lodash"
import { type MutableRefObject, type ReactNode, createContext, useMemo, useRef } from "react"

interface DebouncedItem<T extends (...args: never[]) => void> {
  id: string
  fn: DebouncedFunc<T>
}

interface DebouncedState {
  fns: MutableRefObject<DebouncedItem<() => void>[]>
}

const initialState: DebouncedState = {
  fns: { current: [] },
}

export const DebouncedContext = createContext(initialState)

export function DebouncedProvider({ children }: { children: ReactNode }) {
  const fns = useRef<DebouncedItem<() => void>[]>([])
  const value = useMemo(() => ({ fns }), [])

  return <DebouncedContext.Provider value={value}>{children}</DebouncedContext.Provider>
}
