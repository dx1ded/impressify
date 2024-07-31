import {
  ArrowRightIcon,
  CircleIcon,
  ImageIcon,
  MinusIcon,
  MousePointer2Icon,
  RectangleHorizontalIcon,
  SquareIcon,
  StarIcon,
  TypeIcon,
} from "lucide-react"
import { shallowEqual } from "react-redux"

import { Mode as IMode, setMode, resetToolbar, NOT_SELECTED, setIsCreating } from "~/entities/presentation"
import { InsertImage, InsertShape, InsertText, ChangeShapesType } from "~/features/insert-element"
import { useAppDispatch, useAppSelector } from "~/shared/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton } from "~/shared/ui/Toolbar"
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/shared/ui-kit/select"
import { ToggleGroup, ToggleGroupItem } from "~/shared/ui-kit/toggle-group"

export function Mode() {
  // Done for optimization. You can use a couple of useSelector or this if all props are primitives like here
  const { mode, shape, selectedId, isCreating } = useAppSelector(
    (state) => ({
      mode: state.presentation.toolbar.mode,
      shape: state.presentation.toolbar.shapeProps.type,
      selectedId: state.presentation.selectedId,
      isCreating: state.presentation.isCreating,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()

  const changeHandler = (newMode: IMode | "") => {
    if (newMode === "") return
    // I only handle cursor here because the other mods are controlled in InsertText / InsertImage / InsertShape
    if (newMode === "cursor") {
      dispatch(setMode("cursor"))
      dispatch(setIsCreating(false))
      if (selectedId === NOT_SELECTED) dispatch(resetToolbar())
    }
  }

  return (
    <ToggleGroup type="single" className="gap-2" value={isCreating ? mode : "cursor"} onValueChange={changeHandler}>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="cursor" asChild>
            <ToolbarButton Icon={MousePointer2Icon} />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Select</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <InsertText>
            {(insertText) => (
              <ToggleGroupItem value="text" asChild>
                <ToolbarButton Icon={TypeIcon} onClick={insertText} />
              </ToggleGroupItem>
            )}
          </InsertText>
        </TooltipTrigger>
        <TooltipContent>Textbox</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <InsertImage>
            {(insertImage) => (
              <ToggleGroupItem value="image" asChild>
                <ToolbarButton Icon={ImageIcon} onClick={insertImage} />
              </ToggleGroupItem>
            )}
          </InsertImage>
        </TooltipTrigger>
        <TooltipContent>Image</TooltipContent>
      </Tooltip>
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <InsertShape>
              {(insertShape) => (
                <ToggleGroupItem value="shape" asChild>
                  <ToolbarButton
                    Icon={
                      shape === "line"
                        ? MinusIcon
                        : shape === "square"
                          ? SquareIcon
                          : shape === "rectangle"
                            ? RectangleHorizontalIcon
                            : shape === "circle"
                              ? CircleIcon
                              : shape === "arrow"
                                ? ArrowRightIcon
                                : StarIcon
                    }
                    onClick={insertShape}
                  />
                </ToggleGroupItem>
              )}
            </InsertShape>
          </TooltipTrigger>
          <TooltipContent>Shape</TooltipContent>
        </Tooltip>
        <ChangeShapesType>
          {(changeShapesType) => (
            <Select value={shape} onValueChange={changeShapesType}>
              <SelectTrigger className="h-6 w-4 justify-center border-none bg-transparent p-0" />
              <SelectContent>
                <SelectItem value="line">
                  <MinusIcon className="mr-2 inline-block h-5 w-5" />
                  Line
                </SelectItem>
                <SelectItem value="square">
                  <SquareIcon className="mr-2 inline-block h-5 w-5" />
                  Square
                </SelectItem>
                <SelectItem value="rectangle">
                  <RectangleHorizontalIcon className="mr-2 inline-block h-5 w-5" />
                  Rectangle
                </SelectItem>
                <SelectItem value="circle">
                  <CircleIcon className="mr-2 inline-block h-5 w-5" />
                  Circle
                </SelectItem>
                <SelectItem value="arrow">
                  <ArrowRightIcon className="mr-2 inline-block h-5 w-5" />
                  Arrow
                </SelectItem>
                <SelectItem value="star">
                  <StarIcon className="mr-2 inline-block h-5 w-5" />
                  Star
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </ChangeShapesType>
      </div>
    </ToggleGroup>
  )
}
