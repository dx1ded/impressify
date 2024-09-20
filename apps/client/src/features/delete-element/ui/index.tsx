import { generateEditElementId, deleteElement, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

export function DeleteElement({ children }: ChildrenAsCallbackWithFn) {
  const selectedId = useAppSelector((state) => state.presentation.selectedId)
  const dispatch = useAppDispatch()
  const { call, deleteDebounced } = useDebouncedFunctions()

  const EDIT_SELECTED_ELEMENT_ID = generateEditElementId(selectedId)

  const _deleteElement = () => {
    deleteDebounced(EDIT_SELECTED_ELEMENT_ID)
    dispatch(deleteElement())
    call(TAKE_SCREENSHOT_ID)
  }

  return children(_deleteElement)
}
