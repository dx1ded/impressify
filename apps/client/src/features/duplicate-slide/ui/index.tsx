import { transformNormalizedToYSlide } from "@server/hocuspocus/transform"
import type { UserAwareness, YPresentation } from "@server/hocuspocus/types"
import { forwardRef } from "react"

import { duplicateSlide, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import { type ChildrenAsCallbackWithFn, convertImageToDataUrl, isDataUrl } from "~/shared/lib"
import { useAppDispatch, useDebouncedFunctions, useYjs } from "~/shared/model"

export const DuplicateSlide = forwardRef<HTMLElement, ChildrenAsCallbackWithFn<[string]>>(function DuplicateSlide(
  { children },
  _,
) {
  const dispatch = useAppDispatch()
  const { flush, flushWithPattern, deleteWithPattern } = useDebouncedFunctions()
  const { getMap, updateAwareness } = useYjs()

  const _duplicateSlide = async (id: string) => {
    flushWithPattern(EDIT_ELEMENT_ID)
    flush(TAKE_SCREENSHOT_ID)

    const slides = getMap<YPresentation>().get("slides")
    const thumbnailUrl = slides
      ?.toArray()
      .find((_slide) => _slide.get("id") === id)
      ?.get("thumbnailUrl")
    if (!thumbnailUrl) return

    deleteWithPattern(EDIT_ELEMENT_ID)
    const dataUrl = isDataUrl(thumbnailUrl) ? thumbnailUrl : await convertImageToDataUrl(thumbnailUrl)
    const { newSlide, newIndex } = dispatch(duplicateSlide(id, dataUrl))
    updateAwareness<UserAwareness>({ currentSlideId: newSlide.id })
    slides?.insert(newIndex, [transformNormalizedToYSlide(newSlide)])
  }

  return children(_duplicateSlide)
})
