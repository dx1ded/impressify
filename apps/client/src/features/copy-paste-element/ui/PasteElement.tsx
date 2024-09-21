import { transformNormalizedToYElement } from "@server/hocuspocus/transform"
import type { UserAwareness, YPresentation } from "@server/hocuspocus/types"
import { shallowEqual } from "react-redux"

import { generateEditElementId, pasteElement, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"

export function PasteElement({ children }: ChildrenAsCallbackWithFn) {
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

  const EDIT_SELECTED_ELEMENT_ID = generateEditElementId(selectedId)

  const _pasteElement = () => {
    flush(EDIT_SELECTED_ELEMENT_ID)
    const newElement = dispatch(pasteElement())
    if (!newElement) return
    call(TAKE_SCREENSHOT_ID)
    getMap<YPresentation>()
      .get("slides")
      ?.get(currentSlide)
      ?.get("elements")
      ?.push([transformNormalizedToYElement(newElement)])
    updateAwareness<UserAwareness>({ selectedId: newElement.id })
  }

  return children(_pasteElement)
}
