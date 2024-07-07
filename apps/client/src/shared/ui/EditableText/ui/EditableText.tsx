import { type KeyboardEvent, forwardRef } from "react"
import { Text } from "react-konva"
import type { DebouncedState } from "use-debounce"
import type { Text as TextClass, TextConfig } from "konva/lib/shapes/Text"

import type { ElementProps } from "~/entities/presentation"

import { EditableTextInput } from "./EditableTextInput"

interface EditableTextInputProps extends TextConfig {
  isEditing: boolean
  debouncedEdit: DebouncedState<(newProps: Partial<ElementProps>) => void>
  onToggleEdit(isEditing: boolean): void
}

export const EditableText = forwardRef<TextClass, EditableTextInputProps>(function EditableText(
  { isEditing, debouncedEdit, onToggleEdit, ...props },
  ref,
) {
  const handleEscapeKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape" || e.key === "Tab") {
      onToggleEdit(false)
    }
  }

  const {
    x,
    y,
    text,
    width,
    height,
    scaleX,
    scaleY,
    fill,
    fontSize,
    fontFamily,
    fontStyle,
    textDecoration,
    lineHeight,
    rotation,
  } = props

  if (isEditing) {
    return (
      <EditableTextInput
        x={x}
        y={y}
        width={width}
        height={height}
        scaleX={scaleX}
        scaleY={scaleY}
        fill={fill}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontStyle={fontStyle}
        textDecoration={textDecoration}
        lineHeight={lineHeight}
        rotation={rotation}
        value={text}
        onBlur={() => debouncedEdit.flush()}
        onInput={(e) => debouncedEdit({ text: e.currentTarget.textContent || "" })}
        onKeyDown={handleEscapeKeys}
      />
    )
  }
  return (
    <Text
      ref={ref}
      onDblClick={() => {
        debouncedEdit.flush()
        onToggleEdit(true)
      }}
      {...props}
    />
  )
})
