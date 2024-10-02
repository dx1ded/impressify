import { TooltipTrigger } from "@radix-ui/react-tooltip"
import type { YPresentation } from "@server/hocuspocus/types"
import type { ChangeEvent } from "react"
import { shallowEqual } from "react-redux"
import { toast } from "sonner"

import { updateImageProps, TAKE_SCREENSHOT_ID, MAX_IMAGE_SIZE, NOT_SELECTED } from "~/entities/presentation"
import { Toaster } from "~/shared/ui-kit/sonner"
import type { ModeProps } from "~/widgets/toolbar/lib"
import { convertFileToDataUrl, uploadImageToStorage } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"
import { Tooltip, TooltipContent } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function ImageMode({ isActive }: ModeProps) {
  const { presentationId, currentSlide, selectedId, isEditor } = useAppSelector(
    (state) => ({
      presentationId: state.presentation.presentation.id,
      currentSlide: state.presentation.currentSlide,
      selectedId: state.presentation.selectedId,
      isEditor: state.presentationUser.isEditor,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()
  const { call } = useDebouncedFunctions()
  const { getMap } = useYjs()

  const replaceImageHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (!files || !files.length) return
    if (files[0].size > MAX_IMAGE_SIZE)
      return toast(`File cannot be larger than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`, { position: "top-right" })
    const dataUrl = await convertFileToDataUrl(files[0])
    const uploadedImageUrl = await uploadImageToStorage(dataUrl, `${presentationId}/${currentSlide}/${selectedId}`)

    dispatch(updateImageProps({ imageUrl: uploadedImageUrl }))

    if (selectedId === NOT_SELECTED) return
    call(TAKE_SCREENSHOT_ID)

    getMap<YPresentation>()
      .get("slides")
      ?.get(currentSlide)
      ?.get("elements")
      ?.toArray()
      .find((_element) => _element.get("id") === selectedId)
      ?.set("imageUrl", uploadedImageUrl)
  }

  return (
    <ToolbarGroup style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <Toaster />
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <ToolbarButton disabled={!isEditor}>
              <label htmlFor="replace-image" className="cursor-pointer">
                Replace image
              </label>
            </ToolbarButton>
            <input type="file" className="hidden" id="replace-image" accept="image/*" onChange={replaceImageHandler} />
          </div>
        </TooltipTrigger>
        <TooltipContent>Replace selected image</TooltipContent>
      </Tooltip>
    </ToolbarGroup>
  )
}
