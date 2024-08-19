import {
  applyHistory,
  EDIT_ELEMENT_ID,
  SAVE_SLIDES_ID,
  setIsSaving,
  SYNCHRONIZE_STATE_ID,
  TAKE_SCREENSHOT_ID,
} from "~/entities/presentation"
import type { HistoryActionProps } from "~/features/undo-redo-history/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

export function HistoryRedo({ children }: HistoryActionProps) {
  const redoStack = useAppSelector((state) => state.presentation.history.redoStack)
  const dispatch = useAppDispatch()
  const { call, flushWithPattern } = useDebouncedFunctions()

  const historyRedoFn = () => {
    flushWithPattern(EDIT_ELEMENT_ID)
    dispatch(applyHistory("REDO"))
    call(TAKE_SCREENSHOT_ID)
    call(SAVE_SLIDES_ID)
    dispatch(setIsSaving(true))
    call(SYNCHRONIZE_STATE_ID)
  }

  return children(historyRedoFn, redoStack.length !== 0)
}