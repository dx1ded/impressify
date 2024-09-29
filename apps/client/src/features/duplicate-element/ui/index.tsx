import { transformNormalizedToYElement } from "@server/hocuspocus/transform"
import type { UserAwareness, YPresentation } from "@server/hocuspocus/types"
import { shallowEqual } from "react-redux"

import { duplicateElement, generateEditElementId, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"

export function useDuplicateElement() {
  const { selectedId, currentSlide } = useAppSelector(
    (state) => ({
      selectedId: state.presentation.selectedId,
      currentSlide: state.presentation.currentSlide,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()
  const { flush, call } = useDebouncedFunctions()
  const { getMap, updateAwareness } = useYjs()

  return () => {
    flush(generateEditElementId(selectedId))
    const newElement = dispatch(duplicateElement())
    call(TAKE_SCREENSHOT_ID)
    getMap<YPresentation>()
      .get("slides")
      ?.get(currentSlide)
      ?.get("elements")
      ?.push([transformNormalizedToYElement(newElement)])
    updateAwareness<UserAwareness>({ selectedId: newElement.id })
  }
}

export function DuplicateElement({ children }: ChildrenAsCallbackWithFn) {
  return children(useDuplicateElement())
}
