import { transformNormalizedToYElement } from "@server/hocuspocus/transform"
import type { YElement, YPresentation } from "@server/hocuspocus/types"
import * as Y from "yjs"

import { applyHistoryStep, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import type { HistoryActionProps } from "~/features/apply-history/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"

export function useUndoHistory() {
  const currentSlide = useAppSelector((state) => state.presentation.currentSlide)
  const dispatch = useAppDispatch()
  const { call, flushWithPattern } = useDebouncedFunctions()
  const { getMap } = useYjs()

  return () => {
    flushWithPattern(EDIT_ELEMENT_ID)
    const newElements = dispatch(applyHistoryStep("UNDO"))
    if (!newElements) return
    const yElements = new Y.Array<YElement>()
    yElements.push(newElements.map((_element) => transformNormalizedToYElement(_element)))
    getMap<YPresentation>().get("slides")?.get(currentSlide)?.set("elements", yElements)
    call(TAKE_SCREENSHOT_ID)
  }
}

export function UndoHistory({ children }: HistoryActionProps) {
  const undoStack = useAppSelector((state) => state.history.undoStack)

  return children(useUndoHistory(), undoStack.length !== 0)
}
