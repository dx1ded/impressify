import { forwardRef } from "react"

import {
  addSlide,
  setIsSaving,
  EDIT_ELEMENT_ID,
  SAVE_SLIDES_ID,
  SYNCHRONIZE_STATE_ID,
  TAKE_SCREENSHOT_ID,
} from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useDebouncedFunctions } from "~/shared/model"

export const AddSlide = forwardRef<HTMLElement, ChildrenAsCallbackWithFn>(function AddSlide({ children }, _) {
  const dispatch = useAppDispatch()
  const { flush, flushWithPattern, call } = useDebouncedFunctions()

  const _addSlide = () => {
    flush(TAKE_SCREENSHOT_ID)
    flushWithPattern(EDIT_ELEMENT_ID)
    dispatch(addSlide())
    call(SAVE_SLIDES_ID)
    dispatch(setIsSaving(true))
    call(SYNCHRONIZE_STATE_ID)
  }

  return children(_addSlide)
})
