import { MinusIcon, PlusIcon } from "lucide-react"
import { type ComponentPropsWithoutRef, useRef } from "react"

import { cn } from "~/shared/lib"

export function Counter({ defaultValue, className, ...props }: ComponentPropsWithoutRef<"input">) {
  const counterRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="text-md h-4 w-4"
        aria-label="Decrease counter"
        onClick={() => counterRef.current?.stepDown.call(counterRef.current)}>
        <MinusIcon className="h-full w-full" />
      </button>
      <input
        ref={counterRef}
        type="number"
        className={cn(
          "h-6 flex-1 rounded border border-gray-400 bg-transparent text-center text-xs font-semibold",
          className,
        )}
        defaultValue={defaultValue}
        {...props}
      />
      <button
        type="button"
        className="text-md h-4 w-4"
        aria-label="Increase counter"
        onClick={() => counterRef.current?.stepUp.call(counterRef.current)}>
        <PlusIcon className="h-full w-full" />
      </button>
    </div>
  )
}
