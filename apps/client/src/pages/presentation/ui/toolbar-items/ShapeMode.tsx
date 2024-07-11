import { PaintBucketIcon, PencilIcon } from "lucide-react"

import { changeShapeProps } from "~/entities/presentation"
import type { ModeProps } from "~/pages/presentation/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ColorPicker } from "~/shared/ui/ColorPicker"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function ShapeMode({ isActive }: ModeProps) {
  const shapeProps = useAppSelector((state) => state.presentation.toolbar.shapeProps)
  const dispatch = useAppDispatch()

  return (
    <ToolbarGroup style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <ColorPicker color={shapeProps.fillColor} onChange={(value) => dispatch(changeShapeProps({ fillColor: value }))}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToolbarButton Icon={PaintBucketIcon} />
          </TooltipTrigger>
          <TooltipContent>Fill color</TooltipContent>
        </Tooltip>
      </ColorPicker>
      <ColorPicker
        color={shapeProps.strokeColor}
        onChange={(value) => dispatch(changeShapeProps({ strokeColor: value }))}>
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
