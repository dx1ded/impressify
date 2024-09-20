import { shallowEqual } from "react-redux"

import type { ShapeType } from "~/__generated__/graphql"
import { NOT_SELECTED, selectElement, setMode, setIsCreating, setShapeProps } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"

export function ChangeShapesType({ children }: ChildrenAsCallbackWithFn<[ShapeType]>) {
  const { shape, mode } = useAppSelector(
    (state) => ({
      shape: state.toolbar.shapeProps.type,
      mode: state.toolbar.mode,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()

  const changeShapesType = (newShape: ShapeType) => {
    if (shape !== newShape) {
      dispatch(selectElement(NOT_SELECTED))
      dispatch(setShapeProps({ type: newShape }))
      dispatch(setIsCreating(true))
    }
    if (mode !== "shape") dispatch(setMode("shape"))
  }

  return children(changeShapesType)
}
