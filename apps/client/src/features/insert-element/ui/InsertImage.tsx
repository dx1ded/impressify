import { forwardRef } from "react"
import { toast } from "sonner"

import {
  setImageProps,
  selectElement,
  DEFAULT_IMAGE_WIDTH,
  NOT_SELECTED,
  setIsCreating,
  setMode,
  MAX_IMAGE_SIZE,
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
      if (target.files[0].size > MAX_IMAGE_SIZE) {
        dispatch(setIsCreating(false))
        dispatch(setMode("cursor"))
        return toast(`File cannot be larger than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`, { position: "top-right" })
      }
      const dataUrl = await convertFileToDataUrl(target.files[0])
      const height = await getNormalizedImageHeight(dataUrl, DEFAULT_IMAGE_WIDTH)
      dispatch(selectElement(NOT_SELECTED))
      dispatch(setImageProps({ imageUrl: dataUrl, height }))
    }
    _.oncancel = () => {
      dispatch(setMode("cursor"))
      dispatch(setIsCreating(false))
    }
  }

  return children(insertImage)
})
