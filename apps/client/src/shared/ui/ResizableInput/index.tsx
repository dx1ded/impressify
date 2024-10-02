import { type ChangeEvent, type ComponentPropsWithoutRef, useCallback, useEffect, useRef } from "react"

import { cn } from "~/shared/lib"
import { PreserveCursorInput } from "~/shared/ui/PreserveCursorInput"

interface ResizableInputProps extends ComponentPropsWithoutRef<"input"> {
  // Redefined value because HTMLAttributes has value as string | null | undefined | readonly string
  value: string
}

export function ResizableInput({ value, className, onChange, ...props }: ResizableInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  const resizeInput = useCallback(() => {
    if (!spanRef.current || !inputRef.current) return
    spanRef.current.textContent = inputRef.current.value
    inputRef.current.style.width = `${spanRef.current.offsetWidth}px`
  }, [])

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    resizeInput()
    if (onChange) onChange(e)
  }

  useEffect(() => {
    resizeInput()
  }, [resizeInput, value])

  return (
    <div className="inline-block">
      <span ref={spanRef} className={cn("invisible absolute whitespace-pre", className)} />
      <PreserveCursorInput
        ref={inputRef}
        type="text"
        className={className}
        value={value}
        {...props}
        onChange={inputChangeHandler}
      />
    </div>
  )
}
