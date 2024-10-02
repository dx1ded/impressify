import { forwardRef } from "react"

import { setIsCreating, setMode } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"

// forwardRef is used because it may be used in Tooltip which passed forwardRef and then throws an error it's absent
export const InsertShape = forwardRef<HTMLElement, ChildrenAsCallbackWithFn>(function InsertShape({ children }, _) {
  const isCreating = useAppSelector((state) => state.presentation.isCreating)
  const dispatch = useAppDispatch()

  const insertShape = () => {
    dispatch(setMode("shape"))
    if (!isCreating) dispatch(setIsCreating(true))
  }

  return children(insertShape)
})
