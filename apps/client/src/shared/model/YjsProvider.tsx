import { HocuspocusProvider } from "@hocuspocus/provider"
import type { Doc } from "yjs"
import {
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  memo,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react"
import type { TypedMap } from "yjs-types"

import { AWARENESS_VALUE_FIELD, useStableCallback } from "~/shared/model"

interface YjsProviderProps {
  url: string
  name: string
  token?: string
  children: ReactNode
  onUpdate?: (provider: HocuspocusProvider) => void
  onAwarenessChange?: (users: any[]) => void
  onAuthenticated?: () => void
  setExternalProvider?: Dispatch<SetStateAction<HocuspocusProvider | null>>
  setInitialAwareness?: (document: Doc) => any
}

interface YjsState {
  provider: HocuspocusProvider | null
  getMap<YMap extends TypedMap<Record<string, unknown>>>(fieldName?: string): YMap
  updateAwareness<T>(newProps: Partial<T>): void
}

const initialState: YjsState = {
  provider: null,
  getMap: (_fieldName) => {
    throw new Error("Provider is not initialized yet")
  },
  updateAwareness(_newProps) {
    throw new Error("Provider is not initialized yet")
  },
}
const YjsContext = createContext(initialState)

export function useYjs() {
  return useContext(YjsContext)
}

export const YjsProvider = memo<YjsProviderProps>(function YjsProvider({
  url,
  token,
  name,
  children,
  onUpdate,
  onAwarenessChange,
  onAuthenticated,
  setExternalProvider,
  setInitialAwareness,
}) {
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null)
  const isInitialized = useRef(false)

  const stableOnAwarenessChange = useStableCallback(onAwarenessChange || (() => {}))
  const stableOnUpdate = useStableCallback(onUpdate || (() => {}))

  useEffect(() => {
    if (isInitialized.current) return

    const _provider = new HocuspocusProvider({
      url,
      token,
      name,
      onAwarenessChange(data) {
        if (onAwarenessChange)
          stableOnAwarenessChange(
            data.states.filter((item) => item[AWARENESS_VALUE_FIELD]).map((item) => item[AWARENESS_VALUE_FIELD]),
          )
      },
      onAuthenticated() {
        if (onAuthenticated) onAuthenticated()
      },
    })

    // `update` is more preferable than `onChange` which is defined in HocuspocusProvider by default because `onChange` also includes awareness update which we obviously don't want
    _provider.document.on("update", () => {
      if (onUpdate) stableOnUpdate(_provider)

      // Setting initial awareness if provider + not set yet
      const localState = _provider.awareness?.getLocalState()
      if (localState && !Object.keys(localState).length && setInitialAwareness) {
        _provider.setAwarenessField(AWARENESS_VALUE_FIELD, setInitialAwareness(_provider.document))
      }
    })

    isInitialized.current = true
    setProvider(_provider)

    // If the parent component needs the provider, update its state
    if (setExternalProvider) setExternalProvider(_provider)

    return () => {
      if (provider) {
        _provider.disconnect()
        isInitialized.current = false
        setProvider(null)
        if (setExternalProvider) setExternalProvider(null)
      }
    }
  }, [
    token,
    url,
    name,
    provider,
    setInitialAwareness,
    setExternalProvider,
    onUpdate,
    onAwarenessChange,
    onAuthenticated,
    stableOnAwarenessChange,
    stableOnUpdate,
  ])

  const getMap = useCallback(
    <T,>(fieldName?: string): T => {
      if (!provider) throw new Error("Provider is not initialized yet")
      return provider.document.getMap(fieldName) as T
    },
    [provider],
  )

  const updateAwareness = useCallback(
    <T,>(updatedProps: Partial<T>) => {
      if (!provider) throw new Error("Provider is not initialized yet")
      const localState = provider.awareness?.getLocalState()
      provider.setAwarenessField(AWARENESS_VALUE_FIELD, {
        ...(localState && localState[AWARENESS_VALUE_FIELD] ? localState[AWARENESS_VALUE_FIELD] : {}),
        ...updatedProps,
      })
    },
    [provider],
  )

  const value = useMemo<YjsState>(
    () => ({
      provider,
      getMap,
      updateAwareness,
    }),
    [provider, getMap, updateAwareness],
  )

  return <YjsContext.Provider value={value}>{children}</YjsContext.Provider>
})
