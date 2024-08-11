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
  type TextProps,
  changeTextProps,
  DEFAULT_FONT_LIST,
  TAKE_SCREENSHOT_ID,
  SAVE_SLIDES_ID,
  setIsSaving,
} from "~/entities/presentation"
import type { ModeProps } from "~/widgets/toolbar/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"
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

export function TextMode({ isActive }: ModeProps) {
  const textProps = useAppSelector((state) => state.presentation.toolbar.textProps)
  const dispatch = useAppDispatch()
  const { call } = useDebouncedFunctions()

  const applyTextChanges = (props: Partial<TextProps>) => {
    dispatch(changeTextProps(props))
    call(TAKE_SCREENSHOT_ID)
    call(SAVE_SLIDES_ID)
    dispatch(setIsSaving(true))
  }

  return (
    <div style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <ToolbarGroup>
        <ColorPicker color={textProps.fillColor} onChange={(value) => applyTextChanges({ fillColor: value })}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToolbarButton Icon={PaintBucketIcon} />
            </TooltipTrigger>
            <TooltipContent>Fill color</TooltipContent>
          </Tooltip>
        </ColorPicker>
        <ColorPicker color={textProps.borderColor} onChange={(value) => applyTextChanges({ borderColor: value })}>
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
        <Select value={textProps.fontFamily} onValueChange={(value) => applyTextChanges({ fontFamily: value })}>
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
          value={textProps.fontSize}
          onChange={(value) => applyTextChanges({ fontSize: value })}
        />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToggleGroup
        type="multiple"
        className="gap-2"
        value={[
          textProps.bold ? "bold" : "",
          textProps.italic ? "italic" : "",
          textProps.underlined ? "underlined" : "",
        ]}
        onValueChange={(values) =>
          applyTextChanges({
            bold: values.includes("bold"),
            italic: values.includes("italic"),
            underlined: values.includes("underlined"),
          })
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
        <ColorPicker color={textProps.textColor} onChange={(value) => applyTextChanges({ textColor: value })}>
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
        <Select value={textProps.alignment} onValueChange={(value) => applyTextChanges({ alignment: value })}>
          <Tooltip>
            <TooltipTrigger asChild>
              <NativeSelectTrigger asChild>
                <ToolbarButton
                  Icon={
                    textProps.alignment === "left"
                      ? AlignLeftIcon
                      : textProps.alignment === "center"
                        ? AlignCenterIcon
                        : AlignRightIcon
                  }
                />
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
        <Select value={`${textProps.lineHeight}`} onValueChange={(value) => applyTextChanges({ lineHeight: +value })}>
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
    </div>
  )
}
