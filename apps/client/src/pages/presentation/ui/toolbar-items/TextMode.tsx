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

import { changeTextProps, DEFAULT_FONT_LIST } from "~/entities/presentation"
import { useAppDispatch, useAppSelector } from "~/shared/model"
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
  const {
    toolbar: { textProps },
  } = useAppSelector((state) => state.presentation)
  const dispatch = useAppDispatch()

  return (
    <>
      <ToolbarGroup>
        <ColorPicker
          defaultColor={textProps.fillColor}
          onChange={(value) => dispatch(changeTextProps({ fillColor: value }))}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToolbarButton Icon={PaintBucketIcon} />
            </TooltipTrigger>
            <TooltipContent>Fill color</TooltipContent>
          </Tooltip>
        </ColorPicker>
        <ColorPicker
          defaultColor={textProps.borderColor}
          onChange={(value) => dispatch(changeTextProps({ borderColor: value }))}>
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
        <Select
          defaultValue={textProps.fontFamily}
          onValueChange={(value) => dispatch(changeTextProps({ fontFamily: value }))}>
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
        <Counter
          className="w-10"
          defaultValue={textProps.fontSize}
          onChange={(value) => dispatch(changeTextProps({ fontSize: value }))}
        />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToggleGroup
        type="multiple"
        className="gap-2"
        defaultValue={[
          textProps.bold ? "bold" : "",
          textProps.italic ? "italic" : "",
          textProps.underlined ? "underlined" : "",
        ]}
        onValueChange={(values) =>
          dispatch(
            changeTextProps({
              bold: values.includes("bold"),
              italic: values.includes("italic"),
              underlined: values.includes("underlined"),
            }),
          )
        }>
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
        <ColorPicker
          defaultColor={textProps.textColor}
          onChange={(value) => dispatch(changeTextProps({ textColor: value }))}>
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
        <Select
          defaultValue={textProps.alignment}
          onValueChange={(value) => dispatch(changeTextProps({ alignment: value }))}>
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
        <Select
          defaultValue={`${textProps.lineHeight}`}
          onValueChange={(value) => dispatch(changeTextProps({ lineHeight: +value }))}>
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
