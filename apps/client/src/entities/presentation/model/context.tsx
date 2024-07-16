import { createContext, type PropsWithChildren } from "react"
import type { DebouncedState } from "use-debounce"

export interface IScreenshotContext {
  takeScreenshot: DebouncedState<() => void> | null
}

const initialState: IScreenshotContext = {
  takeScreenshot: null,
}

export const ScreenshotContext = createContext(initialState)

export function ScreenshotProvider({ children, ...props }: PropsWithChildren<IScreenshotContext>) {
  return <ScreenshotContext.Provider value={props}>{children}</ScreenshotContext.Provider>
}
