import { forwardRef } from "react"

import {
  setImageProps,
  selectElementThunk,
  DEFAULT_IMAGE_WIDTH,
  NOT_SELECTED,
  setIsCreating,
  setMode,
} from "~/entities/presentation"
import { type ChildrenAsCallbackWithFn, convertFileToDataUrl, getNormalizedImageHeight } from "~/shared/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"

// forwardRef is used because it may be used in Tooltip which passed forwardRef and then throws an error it's absent
export const InsertImage = forwardRef<HTMLElement, ChildrenAsCallbackWithFn>(function InsertImage({ children }, _) {
  const isCreating = useAppSelector((state) => state.presentation.isCreating)
  const dispatch = useAppDispatch()

  const insertImage = () => {
    dispatch(setMode("image"))
    if (!isCreating) dispatch(setIsCreating(true))
    const _ = document.createElement("input")
    _.type = "file"
    _.accept = "image/*"
    _.click()
    _.onchange = async (e) => {
      const target = e.target as HTMLInputElement
      if (!target.files?.length) return
      const dataUrl = await convertFileToDataUrl(target.files[0])
      const height = await getNormalizedImageHeight(dataUrl, DEFAULT_IMAGE_WIDTH)
      dispatch(selectElementThunk(NOT_SELECTED))
      dispatch(setImageProps({ imageUrl: dataUrl, height }))
    }
    _.oncancel = () => {
      dispatch(setMode("cursor"))
      dispatch(setIsCreating(false))
    }
  }

  return children(insertImage)
})
