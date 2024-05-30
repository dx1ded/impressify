import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useMemo, useState } from "react"

export type Tab = "home" | "support" | "features" | "benefits" | "pricing"

interface IHeaderContext {
  activeTab: Tab
  setActiveTab: Dispatch<SetStateAction<Tab>>
}

const initialState: IHeaderContext = {
  activeTab: "home",
  setActiveTab() {},
}

const HeaderContext = createContext<IHeaderContext>(initialState)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("home")

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
    }),
    [activeTab, setActiveTab],
  )

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
}

export function useHeader() {
  return useContext(HeaderContext)
}
