import { shallowEqual } from "react-redux"

import { changeShapeProps, NOT_SELECTED, selectElement, setIsCreating, setMode } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"

// I put this component in features/insert-element because it clearly depends on inserting shapes
export function ChangeShapesType({ children }: ChildrenAsCallbackWithFn<[string]>) {
  const { shape, mode } = useAppSelector(
    (state) => ({
      shape: state.presentation.toolbar.shapeProps.type,
      mode: state.presentation.toolbar.mode,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()

  const changeShapesType = (newShape: string) => {
    if (shape !== newShape) {
      dispatch(selectElement(NOT_SELECTED))
      dispatch(changeShapeProps({ type: newShape }))
      dispatch(setIsCreating(true))
    }
    if (mode !== "shape") dispatch(setMode("shape"))
  }

  return children(changeShapesType)
}
