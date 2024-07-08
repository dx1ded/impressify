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

import { setMode, Mode as IMode, type Shapes, setShape } from "~/entities/presentation"
import { useAppDispatch, useAppSelector } from "~/shared/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton } from "~/shared/ui/Toolbar"
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/shared/ui-kit/select"
import { ToggleGroup, ToggleGroupItem } from "~/shared/ui-kit/toggle-group"

export function Mode() {
  const { toolbar } = useAppSelector((state) => state.presentation)
  const dispatch = useAppDispatch()

  return (
    <ToggleGroup
      className="gap-2"
      type="single"
      value={toolbar.mode}
      onValueChange={(value: IMode) => dispatch(setMode(value))}>
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
                  toolbar.shape === "line"
                    ? MinusIcon
                    : toolbar.shape === "square"
                      ? SquareIcon
                      : toolbar.shape === "rectangle"
                        ? RectangleHorizontalIcon
                        : toolbar.shape === "circle"
                          ? CircleIcon
                          : toolbar.shape === "arrow"
                            ? ArrowRightIcon
                            : StarIcon
                }
              />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Shape</TooltipContent>
        </Tooltip>
        <Select defaultValue={toolbar.shape} onValueChange={(value: Shapes) => dispatch(setShape(value))}>
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
