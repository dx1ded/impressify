import type { ReactNode } from "react"

export interface HistoryActionProps {
  children(historyActionFn: () => void, isActive: boolean): ReactNode
}
