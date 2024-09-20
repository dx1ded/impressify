import { transformNormalizedToYSlide } from "@server/hocuspocus/transform"
import type { UserAwareness, YPresentation } from "@server/hocuspocus/types"
import { forwardRef } from "react"

import { duplicateSlide, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useDebouncedFunctions, useYjs } from "~/shared/model"

export const DuplicateSlide = forwardRef<HTMLElement, ChildrenAsCallbackWithFn<[string]>>(function DuplicateSlide(
  { children },
  _,
) {
  const dispatch = useAppDispatch()
  const { flush, flushWithPattern, deleteWithPattern, deleteDebounced } = useDebouncedFunctions()
  const { getMap, updateAwareness } = useYjs()

  const _duplicateSlide = (id: string) => {
    flushWithPattern(EDIT_ELEMENT_ID)
    flush(TAKE_SCREENSHOT_ID)
    deleteWithPattern(EDIT_ELEMENT_ID)
    deleteDebounced(TAKE_SCREENSHOT_ID)
    const { newSlide, newIndex } = dispatch(duplicateSlide(id))
    getMap<YPresentation>()
      .get("slides")
      ?.insert(newIndex, [transformNormalizedToYSlide(newSlide)])
    updateAwareness<UserAwareness>({ currentSlideId: newSlide.id })
  }

  return children(_duplicateSlide)
})
