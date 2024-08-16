import { forwardRef } from "react"
import { shallowEqual } from "react-redux"

import {
  deleteSlide,
  EDIT_ELEMENT_ID,
  SAVE_SLIDES_ID,
  setIsSaving,
  SYNCHRONIZE_STATE_ID,
  TAKE_SCREENSHOT_ID,
} from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

export const DeleteSlide = forwardRef<HTMLElement, ChildrenAsCallbackWithFn<[string]>>(function DeleteSlide(
  { children },
  _,
) {
  const { currentSlide, userId } = useAppSelector(
    (state) => ({
      currentSlide: state.presentation.currentSlide,
      userId: state.user.userId,
    }),
    shallowEqual,
  )
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const dispatch = useAppDispatch()
  const { deleteDebounced, deleteWithPattern, call } = useDebouncedFunctions()

  const _deleteSlide = (id: string) => {
    const index = slides.findIndex((slide) => slide.id === id)!
    if (index === currentSlide) {
      deleteDebounced(TAKE_SCREENSHOT_ID)
      deleteWithPattern(EDIT_ELEMENT_ID)
    }
    dispatch(deleteSlide({ slideId: id, userId: userId! }))
    call(SAVE_SLIDES_ID)
    dispatch(setIsSaving(true))
    call(SYNCHRONIZE_STATE_ID)
  }

  return children(_deleteSlide)
})
