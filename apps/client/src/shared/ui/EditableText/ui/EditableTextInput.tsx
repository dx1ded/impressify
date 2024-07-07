import { type ComponentPropsWithoutRef, useEffect, useRef } from "react"
import { Html } from "react-konva-utils"
import type { TextConfig } from "konva/lib/shapes/Text"

interface EditableTextInputProps extends Omit<TextConfig, "draggable">, ComponentPropsWithoutRef<"div"> {}

export function EditableTextInput({
  x,
  y,
  width,
  height,
  fill,
  fontSize,
  fontFamily,
  fontStyle,
  textDecoration,
  lineHeight,
  align,
  rotation,
  value,
  onBlur,
  onInput,
  onKeyDown,
}: EditableTextInputProps) {
  const divRef = useRef<HTMLDivElement>(null)
  // textValue is created to avoid div rerender once the value is changed
  const textValue = useRef<string>(value)

  const [style, weight] = fontStyle!.split(" ")

  // Autofocus on mount
  useEffect(() => {
    if (!divRef.current) return

    const range = document.createRange()
    const selection = window.getSelection()
    if (!selection) return
    range.selectNodeContents(divRef.current)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }, [])

  return (
    <Html groupProps={{ x, y, rotation }} divProps={{ style: { width: `${width}px`, height: `${height}px` } }}>
      <div
        ref={divRef}
        className="m-0 flex h-full w-full items-center whitespace-pre-wrap break-all border-2 border-blue-300 bg-none p-0 outline-0"
        role="textbox"
        aria-multiline="true"
        aria-label="Editable text area"
        aria-placeholder="Enter text here"
        tabIndex={0}
        style={{
          color: fill,
          fontSize,
          fontFamily,
          fontWeight: +weight,
          fontStyle: style,
          textDecoration,
          lineHeight,
          justifyContent: align === "center" ? "center" : align === "end" ? "flex-end" : "flex-start",
        }}
        contentEditable
        suppressContentEditableWarning
        onBlur={onBlur}
        onInput={onInput}
        onKeyDown={onKeyDown}>
        {textValue.current}
      </div>
    </Html>
  )
}
