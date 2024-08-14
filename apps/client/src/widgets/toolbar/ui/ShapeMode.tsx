import { PaintBucketIcon, PencilIcon } from "lucide-react"

import {
  type ShapeProps,
  changeShapeProps,
  TAKE_SCREENSHOT_ID,
  SAVE_SLIDES_ID,
  setIsSaving,
  SYNCHRONIZE_STATE_ID,
} from "~/entities/presentation"
import type { ModeProps } from "~/widgets/toolbar/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ColorPicker } from "~/shared/ui/ColorPicker"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function ShapeMode({ isActive }: ModeProps) {
  const shapeProps = useAppSelector((state) => state.presentation.toolbar.shapeProps)
  const dispatch = useAppDispatch()
  const { call } = useDebouncedFunctions()

  const applyShapeChanges = (props: Partial<ShapeProps>) => {
    dispatch(changeShapeProps(props))
    call(TAKE_SCREENSHOT_ID)
    call(SAVE_SLIDES_ID)
    dispatch(setIsSaving(true))
    call(SYNCHRONIZE_STATE_ID)
  }

  return (
    <ToolbarGroup style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <ColorPicker color={shapeProps.fillColor} onChange={(value) => applyShapeChanges({ fillColor: value })}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToolbarButton Icon={PaintBucketIcon} />
          </TooltipTrigger>
          <TooltipContent>Fill color</TooltipContent>
        </Tooltip>
      </ColorPicker>
      <ColorPicker color={shapeProps.strokeColor} onChange={(value) => applyShapeChanges({ strokeColor: value })}>
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
