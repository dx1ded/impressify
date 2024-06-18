import { PlusIcon } from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function Add() {
  return (
    <ToolbarGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToolbarButton Icon={PlusIcon} />
        </TooltipTrigger>
        <TooltipContent>New slide (Ctrl+M)</TooltipContent>
      </Tooltip>
    </ToolbarGroup>
  )
}
