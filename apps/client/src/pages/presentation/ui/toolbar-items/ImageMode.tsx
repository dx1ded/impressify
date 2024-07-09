import type { ModeProps } from "~/pages/presentation/lib"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function ImageMode({ isActive }: ModeProps) {
  return (
    <div style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <ToolbarGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToolbarButton>Replace image</ToolbarButton>
          </TooltipTrigger>
          <TooltipContent>Replace selected image</TooltipContent>
        </Tooltip>
      </ToolbarGroup>
    </div>
  )
}
