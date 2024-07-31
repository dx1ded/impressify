import { forwardRef, type ReactNode } from "react"

import { duplicateSlide, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import { useAppDispatch, useDebouncedFunctions } from "~/shared/model"

export const DuplicateSlide = forwardRef<
  HTMLElement,
  { children: (_duplicateSlide: (id: string) => void) => ReactNode }
>(function DuplicateSlide({ children }, _) {
  const dispatch = useAppDispatch()
  const { flush, flushWithPattern, deleteWithPattern, deleteDebounced } = useDebouncedFunctions()

  const _duplicateSlide = (id: string) => {
    flushWithPattern(EDIT_ELEMENT_ID)
    flush(TAKE_SCREENSHOT_ID)
    deleteWithPattern(EDIT_ELEMENT_ID)
    deleteDebounced(TAKE_SCREENSHOT_ID)
    dispatch(duplicateSlide(id))
  }

  return children(_duplicateSlide)
})
