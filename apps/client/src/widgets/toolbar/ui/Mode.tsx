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

import {
  Mode as IMode,
  setMode,
  changeShapeProps,
  resetToolbar,
  NOT_SELECTED,
  setIsCreating,
  changeImageProps,
  DEFAULT_IMAGE_WIDTH,
  selectElement,
} from "~/entities/presentation"
import { convertFileToDataUrl, getNormalizedImageHeight } from "~/shared/lib"
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
    dispatch(setMode(newMode))

    if (newMode !== "cursor" && !isCreating) dispatch(setIsCreating(true))
    else if (newMode === "cursor") {
      dispatch(setIsCreating(false))
      if (selectedId === NOT_SELECTED) dispatch(resetToolbar())
    }

    // selecting image file
    // I made it here as an element creating because ToolbarGroupItem calls e.preventDefault() and file selection doesn't appear
    if (newMode === "image") {
      const _ = document.createElement("input")
      _.type = "file"
      _.accept = "image/*"
      _.click()
      _.onchange = async (e) => {
        const target = e.target as HTMLInputElement
        if (!target.files?.length) return
        const dataUrl = await convertFileToDataUrl(target.files[0])
        const height = await getNormalizedImageHeight(dataUrl, DEFAULT_IMAGE_WIDTH)
        dispatch(selectElement(NOT_SELECTED))
        dispatch(changeImageProps({ imageUrl: dataUrl, height }))
      }
      _.oncancel = () => {
        dispatch(setMode("cursor"))
        dispatch(setIsCreating(false))
      }
    }
  }

  const shapesChangeHandler = (type: string) => {
    if (shape !== type) {
      dispatch(selectElement(NOT_SELECTED))
      dispatch(changeShapeProps({ type }))
      dispatch(setIsCreating(true))
    }
    if (mode !== "shape") dispatch(setMode("shape"))
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
          <ToggleGroupItem value="text" asChild>
            <ToolbarButton Icon={TypeIcon} />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Textbox</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="image" asChild>
            <ToolbarButton Icon={ImageIcon} />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Image</TooltipContent>
      </Tooltip>
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
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
              />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Shape</TooltipContent>
        </Tooltip>
        <Select value={shape} onValueChange={shapesChangeHandler}>
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
      </div>
    </ToggleGroup>
  )
}
