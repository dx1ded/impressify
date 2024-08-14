import {
  generateEditElementId,
  pasteElement,
  setIsSaving,
  TAKE_SCREENSHOT_ID,
  SAVE_SLIDES_ID,
  SYNCHRONIZE_STATE_ID,
} from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

export function PasteElement({ children }: ChildrenAsCallbackWithFn) {
  const selectedId = useAppSelector((state) => state.presentation.selectedId)
  const dispatch = useAppDispatch()
  const { flush, call } = useDebouncedFunctions()

  const EDIT_SELECTED_ELEMENT_ID = generateEditElementId(selectedId)

  const _pasteElement = () => {
    flush(EDIT_SELECTED_ELEMENT_ID)
    dispatch(pasteElement())
    call(TAKE_SCREENSHOT_ID)
    call(SAVE_SLIDES_ID)
    dispatch(setIsSaving(true))
    call(SYNCHRONIZE_STATE_ID)
  }

  return children(_pasteElement)
}
