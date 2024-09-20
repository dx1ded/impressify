import type { YPresentation } from "@server/hocuspocus/types"
import { forwardRef } from "react"

import { deleteSlide, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"

export const DeleteSlide = forwardRef<HTMLElement, ChildrenAsCallbackWithFn<[string]>>(function DeleteSlide(
  { children },
  _,
) {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const currentSlide = useAppSelector((state) => state.presentation.currentSlide)
  const dispatch = useAppDispatch()
  const { deleteDebounced, deleteWithPattern } = useDebouncedFunctions()
  const { getMap } = useYjs()

  const _deleteSlide = (id: string) => {
    const index = slides.findIndex((slide) => slide.id === id)!
    if (index === currentSlide) {
      deleteDebounced(TAKE_SCREENSHOT_ID)
      deleteWithPattern(EDIT_ELEMENT_ID)
    }
    const newId = dispatch(deleteSlide(id))
    if (!newId) return
    getMap<YPresentation>().get("slides")?.delete(index)
    // Not updating awareness because it will be handled in `updateHandler`
  }

  return children(_deleteSlide)
})
