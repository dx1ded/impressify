import {
  duplicateElement,
  generateEditElementId,
  SAVE_SLIDES_ID,
  setIsSaving,
  TAKE_SCREENSHOT_ID,
} from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

export function DuplicateElement({ children }: ChildrenAsCallbackWithFn) {
  const selectedId = useAppSelector((state) => state.presentation.selectedId)
  const dispatch = useAppDispatch()
  const { flush, call } = useDebouncedFunctions()

  const EDIT_SELECTED_ELEMENT_ID = generateEditElementId(selectedId)

  const _duplicateElement = () => {
    flush(EDIT_SELECTED_ELEMENT_ID)
    dispatch(duplicateElement())
    call(TAKE_SCREENSHOT_ID)
    call(SAVE_SLIDES_ID)
    dispatch(setIsSaving(true))
  }

  return children(_duplicateElement)
}
