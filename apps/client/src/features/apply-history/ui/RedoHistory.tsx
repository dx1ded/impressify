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

export function RedoHistory({ children }: HistoryActionProps) {
  const redoStack = useAppSelector((state) => state.history.redoStack)
  const dispatch = useAppDispatch()
  const { call, flushWithPattern } = useDebouncedFunctions()

  const redoHistoryFn = () => {
    flushWithPattern(EDIT_ELEMENT_ID)
    dispatch(applyHistoryStepThunk("REDO"))
    call(TAKE_SCREENSHOT_ID)
    call(SAVE_SLIDES_ID)
    dispatch(setIsSaving(true))
    call(SYNCHRONIZE_STATE_ID)
  }

  return children(redoHistoryFn, redoStack.length !== 0)
}
