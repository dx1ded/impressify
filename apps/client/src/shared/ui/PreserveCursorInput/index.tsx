import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"

interface PreserveCursorInputProps extends ComponentPropsWithoutRef<"input"> {
  // Redefined value because HTMLAttributes has value as string | null | undefined | readonly string
  value: string
}

export const PreserveCursorInput = forwardRef<HTMLInputElement, PreserveCursorInputProps>(function PreserveCursorInput(
  { value, onChange, ...props },
  externalInputRef,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const savedCursorPosition = useRef<number | null>(null)

  // Replacing provided ref with local `inputRef`
  useImperativeHandle(externalInputRef, () => inputRef.current as HTMLInputElement, [])

  const update = useCallback(
    (e?: ChangeEvent<HTMLInputElement>) => {
      const input = inputRef.current
      if (!input) return
      let cursorPosition = input.selectionStart
      if (cursorPosition === 0 && savedCursorPosition.current !== null) {
        cursorPosition = savedCursorPosition.current
      }
      input.value = e?.target.value || value
      if (e && onChange) onChange(e)
      input.setSelectionRange(cursorPosition, cursorPosition)
      savedCursorPosition.current = cursorPosition
    },
    [value, onChange],
  )

  useEffect(() => {
    update()
  }, [update])

  return <input ref={inputRef} {...props} defaultValue={value} onChange={update} />
})
