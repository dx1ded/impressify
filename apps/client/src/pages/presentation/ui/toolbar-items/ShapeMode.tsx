import { PaintBucketIcon, PencilIcon } from "lucide-react"

import { DEFAULT_FILL_COLOR, DEFAULT_STROKE_COLOR } from "~/entities/presentation"
import type { ModeProps } from "~/pages/presentation/lib"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ColorPicker } from "~/shared/ui/ColorPicker"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function ShapeMode({ isActive }: ModeProps) {
  return (
    <div style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <ToolbarGroup>
        <ColorPicker color={DEFAULT_FILL_COLOR}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToolbarButton Icon={PaintBucketIcon} />
            </TooltipTrigger>
            <TooltipContent>Fill color</TooltipContent>
          </Tooltip>
        </ColorPicker>
        <ColorPicker color={DEFAULT_STROKE_COLOR}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToolbarButton Icon={PencilIcon} />
            </TooltipTrigger>
            <TooltipContent>Stroke color</TooltipContent>
          </Tooltip>
        </ColorPicker>
      </ToolbarGroup>
    </div>
  )
}
