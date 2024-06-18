import { Redo, Undo } from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function History() {
  return (
    <ToolbarGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToolbarButton Icon={Undo} />
        </TooltipTrigger>
        <TooltipContent>Undo (⌘+Z)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToolbarButton Icon={Redo} />
        </TooltipTrigger>
        <TooltipContent>Redo (⌘+Y)</TooltipContent>
      </Tooltip>
    </ToolbarGroup>
  )
}
