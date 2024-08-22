import {
  applyHistoryStepThunk,
  EDIT_ELEMENT_ID,
  SAVE_SLIDES_ID,
  setIsSaving,
  SYNCHRONIZE_STATE_ID,
  TAKE_SCREENSHOT_ID,
} from "~/entities/presentation"
import type { HistoryActionProps } from "~/features/apply-history/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

export function UndoHistory({ children }: HistoryActionProps) {
  const undoStack = useAppSelector((state) => state.history.undoStack)
  const dispatch = useAppDispatch()
  const { call, flushWithPattern } = useDebouncedFunctions()

  const undoHistoryFn = () => {
    flushWithPattern(EDIT_ELEMENT_ID)
    dispatch(applyHistoryStepThunk("UNDO"))
    call(TAKE_SCREENSHOT_ID)
    call(SAVE_SLIDES_ID)
    dispatch(setIsSaving(true))
    call(SYNCHRONIZE_STATE_ID)
  }

  return children(undoHistoryFn, undoStack.length !== 0)
}
