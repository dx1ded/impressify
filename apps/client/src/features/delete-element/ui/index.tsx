import type { YPresentation } from "@server/hocuspocus/types"
import { shallowEqual } from "react-redux"

import { generateEditElementId, deleteElement, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"

export function DeleteElement({ children }: ChildrenAsCallbackWithFn) {
  const { selectedId, currentSlide } = useAppSelector(
    (state) => ({
      selectedId: state.presentation.selectedId,
      currentSlide: state.presentation.currentSlide,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()
  const { call, deleteDebounced } = useDebouncedFunctions()
  const { getMap } = useYjs()

  const EDIT_SELECTED_ELEMENT_ID = generateEditElementId(selectedId)

  const _deleteElement = () => {
    deleteDebounced(EDIT_SELECTED_ELEMENT_ID)
    const deleteIndex = dispatch(deleteElement())
    call(TAKE_SCREENSHOT_ID)
    getMap<YPresentation>().get("slides")?.get(currentSlide)?.get("elements")?.delete(deleteIndex)
  }

  return children(_deleteElement)
}
