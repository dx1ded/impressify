import { PlusIcon } from "lucide-react"

import { addSlide, useScreenshot } from "~/entities/presentation"
import { useAppDispatch } from "~/shared/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function Add() {
  const dispatch = useAppDispatch()
  const { takeScreenshot } = useScreenshot()

  return (
    <ToolbarGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToolbarButton
            Icon={PlusIcon}
            onClick={() => {
              takeScreenshot?.flush()
              dispatch(addSlide())
            }}
          />
        </TooltipTrigger>
        <TooltipContent>New slide (Ctrl+M)</TooltipContent>
      </Tooltip>
    </ToolbarGroup>
  )
}
