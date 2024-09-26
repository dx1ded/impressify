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

import { ShapeType } from "~/__generated__/graphql"
import { Mode as IMode, setMode, resetToolbarElementProps, NOT_SELECTED, setIsCreating } from "~/entities/presentation"
import { InsertImage, InsertShape, InsertText, ChangeShapesType } from "~/features/insert-element"
import { useAppDispatch, useAppSelector } from "~/shared/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton } from "~/shared/ui/Toolbar"
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/shared/ui-kit/select"
import { ToggleGroup, ToggleGroupItem } from "~/shared/ui-kit/toggle-group"

export function Mode() {
  // Done for optimization. You can use a couple of useSelector or this if all props are primitives like here
  const { mode, shape, selectedId, isCreating, isLoading, isEditor } = useAppSelector(
    (state) => ({
      mode: state.toolbar.mode,
      shape: state.toolbar.shapeProps.type,
      selectedId: state.presentation.selectedId,
      isCreating: state.presentation.isCreating,
      isLoading: state.presentation.isLoading,
      isEditor: state.user.isEditor,
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
      if (selectedId === NOT_SELECTED) dispatch(resetToolbarElementProps())
    }
  }

  return (
    <ToggleGroup
      type="single"
      className="gap-2"
      value={isCreating ? mode : "cursor"}
      disabled={!isEditor}
      onValueChange={changeHandler}>
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
                      shape === ShapeType.Line
                        ? MinusIcon
                        : shape === ShapeType.Square
                          ? SquareIcon
                          : shape === ShapeType.Rectangle
                            ? RectangleHorizontalIcon
                            : shape === ShapeType.Circle
                              ? CircleIcon
                              : shape === ShapeType.Arrow
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
            <Select value={shape} disabled={!isEditor || isLoading} onValueChange={changeShapesType}>
              <SelectTrigger className="h-6 w-4 justify-center border-none bg-transparent p-0" />
              <SelectContent>
                <SelectItem value={ShapeType.Line}>
                  <MinusIcon className="mr-2 inline-block h-5 w-5" />
                  Line
                </SelectItem>
                <SelectItem value={ShapeType.Square}>
                  <SquareIcon className="mr-2 inline-block h-5 w-5" />
                  Square
                </SelectItem>
                <SelectItem value={ShapeType.Rectangle}>
                  <RectangleHorizontalIcon className="mr-2 inline-block h-5 w-5" />
                  Rectangle
                </SelectItem>
                <SelectItem value={ShapeType.Circle}>
                  <CircleIcon className="mr-2 inline-block h-5 w-5" />
                  Circle
                </SelectItem>
                <SelectItem value={ShapeType.Arrow}>
                  <ArrowRightIcon className="mr-2 inline-block h-5 w-5" />
                  Arrow
                </SelectItem>
                <SelectItem value={ShapeType.Star}>
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
