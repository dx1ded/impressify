import { forwardRef } from "react"

import { deleteSlide, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

export const DeleteSlide = forwardRef<HTMLElement, ChildrenAsCallbackWithFn<[string]>>(function DeleteSlide(
  { children },
  _,
) {
  const currentSlide = useAppSelector((state) => state.presentation.currentSlide)
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const dispatch = useAppDispatch()
  const { deleteDebounced, deleteWithPattern } = useDebouncedFunctions()

  const _deleteSlide = (id: string) => {
    const index = slides.findIndex((slide) => slide.id === id)!
    if (index === currentSlide) {
      deleteDebounced(TAKE_SCREENSHOT_ID)
      deleteWithPattern(EDIT_ELEMENT_ID)
    }
    dispatch(deleteSlide(id))
  }

  return children(_deleteSlide)
})
