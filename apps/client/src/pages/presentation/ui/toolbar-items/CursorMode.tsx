import type { ModeProps } from "~/pages/presentation/lib"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup, ToolbarSeparator } from "~/shared/ui/Toolbar"

export function CursorMode({ isActive }: ModeProps) {
  return (
    <div style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <ToolbarGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToolbarButton>Background</ToolbarButton>
          </TooltipTrigger>
          <TooltipContent>Slide background</TooltipContent>
        </Tooltip>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToolbarButton>Transition</ToolbarButton>
          </TooltipTrigger>
          <TooltipContent>Slide transition</TooltipContent>
        </Tooltip>
      </ToolbarGroup>
    </div>
  )
}
