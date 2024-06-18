import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function ImageMode() {
  return (
    <ToolbarGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToolbarButton>Replace image</ToolbarButton>
        </TooltipTrigger>
        <TooltipContent>Replace selected image</TooltipContent>
      </Tooltip>
    </ToolbarGroup>
  )
}
