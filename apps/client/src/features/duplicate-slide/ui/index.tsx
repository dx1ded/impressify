import { forwardRef } from "react"

import {
  duplicateSlideThunk,
  EDIT_ELEMENT_ID,
  SAVE_SLIDES_ID,
  setIsSaving,
  SYNCHRONIZE_STATE_ID,
  TAKE_SCREENSHOT_ID,
} from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useDebouncedFunctions } from "~/shared/model"

export const DuplicateSlide = forwardRef<HTMLElement, ChildrenAsCallbackWithFn<[string]>>(function DuplicateSlide(
  { children },
  _,
) {
  const dispatch = useAppDispatch()
  const { flush, flushWithPattern, deleteWithPattern, deleteDebounced, call } = useDebouncedFunctions()

  const _duplicateSlide = (id: string) => {
    flushWithPattern(EDIT_ELEMENT_ID)
    flush(TAKE_SCREENSHOT_ID)
    deleteWithPattern(EDIT_ELEMENT_ID)
    deleteDebounced(TAKE_SCREENSHOT_ID)
    dispatch(duplicateSlideThunk(id))
    call(SAVE_SLIDES_ID)
    dispatch(setIsSaving(true))
    call(SYNCHRONIZE_STATE_ID)
  }

  return children(_duplicateSlide)
})
