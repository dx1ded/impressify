import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  IndentIcon,
  ItalicIcon,
  PaintBucketIcon,
  PencilIcon,
  TypeIcon,
  UnderlineIcon,
} from "lucide-react"
import { SelectTrigger as NativeSelectTrigger } from "@radix-ui/react-select"
import { Fragment } from "react"

import {
  DEFAULT_BORDER_COLOR,
  DEFAULT_FILL_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_LIST,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_COLOR,
} from "~/entities/presentation"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/shared/ui-kit/select"
import { ToggleGroup, ToggleGroupItem } from "~/shared/ui-kit/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ColorPicker } from "~/shared/ui/ColorPicker"
import { Counter } from "~/shared/ui/Counter"
import { ToolbarButton, ToolbarGroup, ToolbarSeparator } from "~/shared/ui/Toolbar"

export function TextMode() {
  return (
    <>
      <ToolbarGroup>
        <ColorPicker defaultColor={DEFAULT_FILL_COLOR}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToolbarButton Icon={PaintBucketIcon} />
            </TooltipTrigger>
            <TooltipContent>Fill color</TooltipContent>
          </Tooltip>
        </ColorPicker>
        <ColorPicker defaultColor={DEFAULT_BORDER_COLOR}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToolbarButton Icon={PencilIcon} />
            </TooltipTrigger>
            <TooltipContent>Border color</TooltipContent>
          </Tooltip>
        </ColorPicker>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <Select defaultValue={DEFAULT_FONT_FAMILY}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="h-6 gap-4 border-none bg-transparent font-medium">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent>Font</TooltipContent>
          </Tooltip>
          <SelectContent>
            {DEFAULT_FONT_LIST.map(({ label, fonts }, i) => (
              <Fragment key={label}>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {fonts.map((font) => (
                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectGroup>
                {i !== DEFAULT_FONT_LIST.length - 1 && <SelectSeparator />}
              </Fragment>
            ))}
          </SelectContent>
        </Select>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <Counter className="w-10" defaultValue={DEFAULT_FONT_SIZE} />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToggleGroup className="gap-2" type="multiple">
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="bold" asChild>
              <ToolbarButton Icon={BoldIcon} />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Bold (⌘+B)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="italic" asChild>
              <ToolbarButton Icon={ItalicIcon} />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Italic (⌘+I)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="underlined" asChild>
              <ToolbarButton Icon={UnderlineIcon} />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Underlined (⌘+U)</TooltipContent>
        </Tooltip>
        <ColorPicker defaultColor={DEFAULT_TEXT_COLOR}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToolbarButton Icon={TypeIcon} />
            </TooltipTrigger>
            <TooltipContent>Text color</TooltipContent>
          </Tooltip>
        </ColorPicker>
      </ToggleGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <Select defaultValue="left">
          <Tooltip>
            <TooltipTrigger asChild>
              <NativeSelectTrigger asChild>
                <ToolbarButton Icon={AlignLeftIcon} />
              </NativeSelectTrigger>
            </TooltipTrigger>
            <TooltipContent>Align</TooltipContent>
          </Tooltip>
          <SelectContent>
            <SelectItem value="left">
              <AlignLeftIcon className="mr-2 inline-block h-5 w-5" />
              Left
            </SelectItem>
            <SelectItem value="center">
              <AlignCenterIcon className="mr-2 inline-block h-5 w-5" />
              Center
            </SelectItem>
            <SelectItem value="right">
              <AlignRightIcon className="mr-2 inline-block h-5 w-5" />
              Right
            </SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="1">
          <Tooltip>
            <TooltipTrigger asChild>
              <NativeSelectTrigger asChild>
                <ToolbarButton Icon={IndentIcon} />
              </NativeSelectTrigger>
            </TooltipTrigger>
            <TooltipContent>Line spacing</TooltipContent>
          </Tooltip>
          <SelectContent>
            <SelectItem value="1">Single</SelectItem>
            <SelectItem value="1.15">1.15</SelectItem>
            <SelectItem value="1.5">1.5</SelectItem>
            <SelectItem value="2">Double</SelectItem>
          </SelectContent>
        </Select>
      </ToolbarGroup>
    </>
  )
}
