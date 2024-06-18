import { PaintBucketIcon, PencilIcon } from "lucide-react"

import { DEFAULT_FILL_COLOR, DEFAULT_STROKE_COLOR } from "~/entities/presentation"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ColorPicker } from "~/shared/ui/ColorPicker"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function ShapeMode() {
  return (
    <ToolbarGroup>
      <ColorPicker defaultColor={DEFAULT_FILL_COLOR}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToolbarButton Icon={PaintBucketIcon} />
          </TooltipTrigger>
          <TooltipContent>Fill color</TooltipContent>
        </Tooltip>
      </ColorPicker>
      <ColorPicker defaultColor={DEFAULT_STROKE_COLOR}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToolbarButton Icon={PencilIcon} />
          </TooltipTrigger>
          <TooltipContent>Stroke color</TooltipContent>
        </Tooltip>
      </ColorPicker>
    </ToolbarGroup>
  )
}
