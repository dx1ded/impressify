import type { YPresentation } from "@server/hocuspocus/types"
import { PaintBucketIcon, PencilIcon } from "lucide-react"
import { shallowEqual } from "react-redux"

import { type ShapeProps, updateShapeProps, TAKE_SCREENSHOT_ID, NOT_SELECTED } from "~/entities/presentation"
import type { ModeProps } from "~/widgets/toolbar/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ColorPicker } from "~/shared/ui/ColorPicker"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function ShapeMode({ isActive }: ModeProps) {
  const shapeProps = useAppSelector((state) => state.toolbar.shapeProps)
  const { currentSlide, selectedId, isEditor } = useAppSelector(
    (state) => ({
      currentSlide: state.presentation.currentSlide,
      selectedId: state.presentation.selectedId,
      isEditor: state.presentationUser.isEditor,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()
  const { call } = useDebouncedFunctions()
  const { getMap } = useYjs()

  const applyShapeChanges = (props: Partial<ShapeProps>) => {
    dispatch(updateShapeProps(props))

    if (selectedId === NOT_SELECTED) return
    call(TAKE_SCREENSHOT_ID)

    const element = getMap<YPresentation>()
      .get("slides")
      ?.get(currentSlide)
      ?.get("elements")
      ?.toArray()
      .find((_element) => _element.get("id") === selectedId)

    Object.keys(props).forEach((key) => {
      const typedKey = key as keyof ShapeProps
      const typedValue = props[typedKey]
      if (!typedValue) return
      element?.set(typedKey, typedValue)
    })
  }

  return (
    <ToolbarGroup style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <ColorPicker
        color={shapeProps.fillColor}
        disabled={!isEditor}
        onChange={(value) => applyShapeChanges({ fillColor: value })}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToolbarButton Icon={PaintBucketIcon} />
          </TooltipTrigger>
          <TooltipContent>Fill color</TooltipContent>
        </Tooltip>
      </ColorPicker>
      <ColorPicker
        color={shapeProps.strokeColor}
        disabled={!isEditor}
        hasTransparent={false}
        onChange={(value) => applyShapeChanges({ strokeColor: value })}>
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
