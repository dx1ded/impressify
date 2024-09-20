import { transformNormalizedToYElement } from "@server/hocuspocus/transform"
import type { YElement, YPresentation } from "@server/hocuspocus/types"
import * as Y from "yjs"

import { applyHistoryStep, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import type { HistoryActionProps } from "~/features/apply-history/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"

export function RedoHistory({ children }: HistoryActionProps) {
  const redoStack = useAppSelector((state) => state.history.redoStack)
  const currentSlide = useAppSelector((state) => state.presentation.currentSlide)
  const dispatch = useAppDispatch()
  const { call, flushWithPattern } = useDebouncedFunctions()
  const { getMap } = useYjs()

  const redoHistoryFn = () => {
    flushWithPattern(EDIT_ELEMENT_ID)
    const newElements = dispatch(applyHistoryStep("REDO"))
    if (!newElements) return
    const yElements = new Y.Array<YElement>()
    yElements.push(newElements.map((_element) => transformNormalizedToYElement(_element)))
    getMap<YPresentation>().get("slides")?.get(currentSlide)?.set("elements", yElements)
    call(TAKE_SCREENSHOT_ID)
  }

  return children(redoHistoryFn, redoStack.length !== 0)
}
