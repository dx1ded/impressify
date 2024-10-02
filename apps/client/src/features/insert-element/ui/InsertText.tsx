import { forwardRef } from "react"

import { setIsCreating, setMode } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"

// forwardRef is used because it may be used in Tooltip which passed forwardRef and then throws an error it's absent
export const InsertText = forwardRef<HTMLElement, ChildrenAsCallbackWithFn>(function InsertText({ children }, _) {
  const isCreating = useAppSelector((state) => state.presentation.isCreating)
  const dispatch = useAppDispatch()

  const insertText = () => {
    dispatch(setMode("text"))
    if (!isCreating) dispatch(setIsCreating(true))
  }

  return children(insertText)
})
