import { type ChangeEvent, type ComponentPropsWithoutRef, useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface ResizableInputProps extends ComponentPropsWithoutRef<"input"> {
  maxLength?: number
  // Redefined value because HTMLAttributes has value as string | null | undefined | readonly string
  value: string
}

/**
 * To use this component you have to insert <Toaster /> in your main file
 */
export function ResizableInput({ maxLength, value, className, onChange, ...props }: ResizableInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  const changeValue = useCallback((value: string) => {
    if (!inputRef.current || !spanRef.current) return
    inputRef.current.value = value
    spanRef.current.textContent = value
  }, [])

  const changeInputWidth = useCallback(() => {
    if (!spanRef.current || !inputRef.current) return
    inputRef.current.style.width = `${spanRef.current.offsetWidth}px`
  }, [])

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputRef.current && maxLength && maxLength === e.target.value.length) {
      return toast.error(`${inputRef.current.dataset.toast} cannot be more than ${maxLength} symbols`, {
        position: "top-right",
      })
    }
    changeValue(e.target.value)
    changeInputWidth()
    if (onChange) onChange(e)
  }

  useEffect(() => {
    changeValue(value)
    changeInputWidth()
  }, [changeInputWidth, changeValue, value])

  return (
    <div className="inline-block">
      <span ref={spanRef} className={`invisible absolute whitespace-pre ${className}`} />
      <input
        type="text"
        ref={inputRef}
        defaultValue={value}
        className={className}
        {...props}
        onChange={inputChangeHandler}
      />
    </div>
  )
}
