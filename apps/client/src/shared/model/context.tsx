import { type MutableRefObject, type ReactNode, createContext, useMemo, useRef } from "react"

import type { CustomDebouncedFunc } from "~/shared/lib"

interface DebouncedItem<T extends (...args: any[]) => any> {
  id: string
  fn: CustomDebouncedFunc<T>
  deps?: any[] // Add deps property to the DebouncedItem interface
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
