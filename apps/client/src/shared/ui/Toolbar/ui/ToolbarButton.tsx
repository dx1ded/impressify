import type { LucideIcon } from "lucide-react"
import { type ComponentPropsWithoutRef, forwardRef } from "react"

import { cn } from "~/shared/lib"

interface ToolbarButtonProps extends ComponentPropsWithoutRef<"button"> {
  Icon?: LucideIcon
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(function ToolbarButton(
  { children, className, Icon, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-6 items-center justify-center rounded text-gray-700 hover:bg-gray-200 [&[aria-checked=true]]:bg-blue-100 [&[aria-pressed=true]]:bg-blue-100",
        children ? "" : "w-6",
      )}
      aria-hidden
      {...props}>
      {Icon ? <Icon className="h-3/4 w-3/4" /> : <span className="p-0.5 text-xs font-semibold">{children}</span>}
    </button>
  )
})
