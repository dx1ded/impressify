import { type KeyboardEvent, forwardRef } from "react"
import { Text } from "react-konva"
import type { DebouncedState } from "use-debounce"
import type { Text as TextClass } from "konva/lib/shapes/Text"

import type { ElementProps } from "~/entities/presentation"
import type { EditableTextConfig } from "~/shared/ui/EditableText"

import { EditableTextInput } from "./EditableTextInput"

interface EditableTextInputProps extends EditableTextConfig {
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
    textColor,
    fill,
    borderColor,
    borderWidth,
    fontSize,
    fontFamily,
    fontStyle,
    textDecoration,
    lineHeight,
    align,
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
        textColor={textColor}
        fill={fill}
        borderColor={borderColor}
        borderWidth={borderWidth}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontStyle={fontStyle}
        textDecoration={textDecoration}
        lineHeight={lineHeight}
        align={align}
        rotation={rotation}
        value={text}
        onBlur={() => debouncedEdit.flush()}
        onInput={(e) => debouncedEdit({ text: e.currentTarget.textContent || "" })}
        onKeyDown={handleEscapeKeys}
      />
    )
  }

  // <Text> uses fill as text color and that's why it's used this way which might be confusing
  // For reference: textColor - fill, bgColor - fill, borderColor - stroke
  return (
    <Text
      ref={ref}
      onDblClick={() => {
        debouncedEdit.flush()
        onToggleEdit(true)
      }}
      strokeEnabled={false}
      // Drawing background & border since <Text> doesn't have this api
      sceneFunc={(context, shape) => {
        context.beginPath()
        context.fillStyle = fill || "transparent"
        context.lineWidth = borderWidth || 1
        context.strokeStyle = borderColor || "transparent"
        context.rect(0, 0, shape.width(), shape.height())
        context.fill()
        context.stroke()
        context.closePath()
        ;(shape as TextClass)._sceneFunc(context)
      }}
      {...props}
      fill={textColor}
    />
  )
})
