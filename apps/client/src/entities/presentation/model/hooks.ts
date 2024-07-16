import { useContext } from "react"

import { ScreenshotContext } from "~/entities/presentation"

export function useScreenshot() {
  return useContext(ScreenshotContext)
}
