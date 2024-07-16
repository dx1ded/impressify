import { TooltipTrigger } from "@radix-ui/react-tooltip"
import type { ChangeEvent } from "react"

import { changeImageProps, useScreenshot } from "~/entities/presentation"
import type { ModeProps } from "~/pages/presentation/lib"
import { convertFileToDataUrl } from "~/shared/lib"
import { useAppDispatch } from "~/shared/model"
import { Tooltip, TooltipContent } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function ImageMode({ isActive }: ModeProps) {
  const dispatch = useAppDispatch()
  const { takeScreenshot } = useScreenshot()

  const replaceImageHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (!files || !files.length) return
    const dataUrl = await convertFileToDataUrl(files[0])
    dispatch(changeImageProps({ imageUrl: dataUrl }))
    if (takeScreenshot) takeScreenshot()
  }

  return (
    <ToolbarGroup style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <ToolbarButton>
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
