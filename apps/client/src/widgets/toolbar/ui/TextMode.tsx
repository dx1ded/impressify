import type { YPresentation } from "@server/hocuspocus/types"
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
import { shallowEqual } from "react-redux"

import { Alignment } from "~/__generated__/graphql"
import {
  type TextProps,
  updateTextProps,
  DEFAULT_FONT_LIST,
  TAKE_SCREENSHOT_ID,
  NOT_SELECTED,
} from "~/entities/presentation"
import type { ModeProps } from "~/widgets/toolbar/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"
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
  const textProps = useAppSelector((state) => state.toolbar.textProps)
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

  const applyTextChanges = (props: Partial<TextProps>) => {
    dispatch(updateTextProps(props))

    if (selectedId === NOT_SELECTED) return
    call(TAKE_SCREENSHOT_ID)

    const element = getMap<YPresentation>()
      .get("slides")
      ?.get(currentSlide)
      ?.get("elements")
      ?.toArray()
      .find((_element) => _element.get("id") === selectedId)

    Object.keys(props).forEach((key) => {
      const typedKey = key as keyof TextProps
      const typedValue = props[typedKey]
      if (typedValue === undefined) return
      element?.set(typedKey, typedValue)
    })
  }

  return (
    <div style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <ToolbarGroup>
        <ColorPicker
          color={textProps.fillColor}
          disabled={!isEditor}
          onChange={(value) => applyTextChanges({ fillColor: value })}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToolbarButton Icon={PaintBucketIcon} />
            </TooltipTrigger>
            <TooltipContent>Fill color</TooltipContent>
          </Tooltip>
        </ColorPicker>
        <ColorPicker
          color={textProps.borderColor}
          disabled={!isEditor}
          hasTransparent={false}
          onChange={(value) => applyTextChanges({ borderColor: value })}>
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
          value={textProps.fontFamily}
          disabled={!isEditor}
          onValueChange={(value) => applyTextChanges({ fontFamily: value })}>
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
          disabled={!isEditor}
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
        disabled={!isEditor}
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
              <ToolbarButton Icon={BoldIcon} disabled={!isEditor} />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Bold (⌘+B)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="italic" asChild>
              <ToolbarButton Icon={ItalicIcon} disabled={!isEditor} />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Italic (⌘+I)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="underlined" asChild>
              <ToolbarButton Icon={UnderlineIcon} disabled={!isEditor} />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Underlined (⌘+U)</TooltipContent>
        </Tooltip>
        <ColorPicker
          color={textProps.textColor}
          disabled={!isEditor}
          hasTransparent={false}
          onChange={(value) => applyTextChanges({ textColor: value })}>
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
          value={textProps.alignment}
          disabled={!isEditor}
          onValueChange={(value: Alignment) => applyTextChanges({ alignment: value })}>
          <Tooltip>
            <TooltipTrigger asChild>
              <NativeSelectTrigger asChild>
                <ToolbarButton
                  Icon={
                    textProps.alignment === Alignment.Left
                      ? AlignLeftIcon
                      : textProps.alignment === Alignment.Center
                        ? AlignCenterIcon
                        : AlignRightIcon
                  }
                />
              </NativeSelectTrigger>
            </TooltipTrigger>
            <TooltipContent>Align</TooltipContent>
          </Tooltip>
          <SelectContent>
            <SelectItem value={Alignment.Left}>
              <AlignLeftIcon className="mr-2 inline-block h-5 w-5" />
              Left
            </SelectItem>
            <SelectItem value={Alignment.Center}>
              <AlignCenterIcon className="mr-2 inline-block h-5 w-5" />
              Center
            </SelectItem>
            <SelectItem value={Alignment.Right}>
              <AlignRightIcon className="mr-2 inline-block h-5 w-5" />
              Right
            </SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={`${textProps.lineHeight}`}
          disabled={!isEditor}
          onValueChange={(value) => applyTextChanges({ lineHeight: +value })}>
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
