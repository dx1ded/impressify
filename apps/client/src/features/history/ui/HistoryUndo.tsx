import {
  applyHistory,
  EDIT_ELEMENT_ID,
  SAVE_SLIDES_ID,
  setIsSaving,
  SYNCHRONIZE_STATE_ID,
  TAKE_SCREENSHOT_ID,
} from "~/entities/presentation"
import type { HistoryActionProps } from "~/features/history/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

export function HistoryUndo({ children }: HistoryActionProps) {
  const undoStack = useAppSelector((state) => state.presentation.history.undoStack)
  const dispatch = useAppDispatch()
  const { call, flushWithPattern } = useDebouncedFunctions()

  const historyUndoFn = () => {
    flushWithPattern(EDIT_ELEMENT_ID)
    dispatch(applyHistory("UNDO"))
    call(TAKE_SCREENSHOT_ID)
    call(SAVE_SLIDES_ID)
    dispatch(setIsSaving(true))
    call(SYNCHRONIZE_STATE_ID)
  }

  return children(historyUndoFn, undoStack.length !== 0)
}
