import { PlusIcon } from "lucide-react"

import { AddSlide } from "~/features/add-slide"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function Add() {
  return (
    <ToolbarGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <AddSlide>{(addSlide) => <ToolbarButton Icon={PlusIcon} onClick={addSlide} />}</AddSlide>
        </TooltipTrigger>
        <TooltipContent>New slide (Ctrl+M)</TooltipContent>
      </Tooltip>
    </ToolbarGroup>
  )
}
