import { forwardRef } from "react"

import { addSlide, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useDebouncedFunctions } from "~/shared/model"

export const AddSlide = forwardRef<HTMLElement, ChildrenAsCallbackWithFn>(function AddSlide({ children }, _) {
  const dispatch = useAppDispatch()
  const { flush, flushWithPattern } = useDebouncedFunctions()

  const _addSlide = () => {
    flush(TAKE_SCREENSHOT_ID)
    flushWithPattern(EDIT_ELEMENT_ID)
    dispatch(addSlide())
  }

  return children(_addSlide)
})
