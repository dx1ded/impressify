import { useState, type KeyboardEvent, forwardRef } from "react"
import { Text } from "react-konva"
import type { Text as TextClass, TextConfig } from "konva/lib/shapes/Text"

import { EditableTextInput } from "~/entities/presentation/ui/EditableTextInput"

interface EditableTextInputProps extends TextConfig {
  onChange(value: string): void
  onToggleEdit(isEditing: boolean): void
}

export const EditableText = forwardRef<TextClass, EditableTextInputProps>(function EditableText(
  { onChange, onToggleEdit, ...props },
  ref,
) {
  const [isEditing, setIsEditing] = useState(false)

  const handleEscapeKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
      setIsEditing(false)
      onToggleEdit(false)
    }
  }

  const { x, y, text, width, height, fill, fontSize, fontFamily, fontStyle, textDecoration, lineHeight } = props

  if (isEditing) {
    return (
      <EditableTextInput
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontStyle={fontStyle}
        textDecoration={textDecoration}
        lineHeight={lineHeight}
        value={text}
        onInput={(e) => onChange(e.currentTarget.textContent || "")}
        onKeyDown={handleEscapeKeys}
      />
    )
  }
  return (
    <Text
      ref={ref}
      onDblClick={() => {
        setIsEditing(true)
        onToggleEdit(true)
      }}
      {...props}
    />
  )
})
