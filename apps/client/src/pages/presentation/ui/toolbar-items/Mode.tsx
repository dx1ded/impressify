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

import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton } from "~/shared/ui/Toolbar"
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/shared/ui-kit/select"
import { ToggleGroup, ToggleGroupItem } from "~/shared/ui-kit/toggle-group"

export function Mode() {
  return (
    <ToggleGroup className="gap-2" type="single">
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
          <ToggleGroupItem value="textbox" asChild>
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
            <ToggleGroupItem value="line" asChild>
              <ToolbarButton Icon={MinusIcon} />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Line</TooltipContent>
        </Tooltip>
        <Select defaultValue="line">
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
