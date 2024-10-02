import { transformNormalizedToYSlide } from "@server/hocuspocus/transform"
import type { UserAwareness, YPresentation } from "@server/hocuspocus/types"
import { forwardRef } from "react"

import { addSlide, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useDebouncedFunctions, useYjs } from "~/shared/model"

export function useAddSlide() {
  const dispatch = useAppDispatch()
  const { flush, flushWithPattern } = useDebouncedFunctions()
  const { getMap, updateAwareness } = useYjs()

  return () => {
    flushWithPattern(EDIT_ELEMENT_ID)
    flush(TAKE_SCREENSHOT_ID)
    const newSlide = dispatch(addSlide())
    getMap<YPresentation>()
      .get("slides")
      ?.push([transformNormalizedToYSlide(newSlide)])
    updateAwareness<UserAwareness>({ currentSlideId: newSlide.id })
  }
}

export const AddSlide = forwardRef<HTMLElement, ChildrenAsCallbackWithFn>(function AddSlide({ children }, _) {
  return children(useAddSlide())
})
