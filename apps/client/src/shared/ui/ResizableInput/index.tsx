import { type ChangeEvent, cloneElement, type ReactElement, useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface ResizableInputProps {
  /**
   * Input to render
   */
  children: ReactElement
  maxLength?: number
}

/**
 * To use this component you have to insert <Toaster /> in your main file
 */
export function ResizableInput({ children, maxLength }: ResizableInputProps) {
  const [inputValue, setInputValue] = useState(children.props.defaultValue || "")
  const inputRef = useRef<HTMLInputElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  const changeInputWidth = useCallback(() => {
    if (!spanRef.current || !inputRef.current) return
    inputRef.current.style.width = `${spanRef.current.offsetWidth}px`
  }, [])

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputRef.current && maxLength && maxLength === e.target.value.length) {
      inputRef.current.value = inputValue
      return toast.error(`${inputRef.current.dataset.toast} cannot be more than ${maxLength} symbols`, {
        position: "top-right",
      })
    }
    setInputValue(e.target.value)
    children.props.onChange(e)
  }

  useEffect(() => changeInputWidth(), [changeInputWidth, inputValue])

  return (
    <div className="inline-block">
      <span ref={spanRef} className={`invisible absolute whitespace-pre ${children.props.className}`}>
        {inputValue}
      </span>
      {cloneElement(children, {
        ref: inputRef,
        onChange: inputChangeHandler,
      })}
    </div>
  )
}
