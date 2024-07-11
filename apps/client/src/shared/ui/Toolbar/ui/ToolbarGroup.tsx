import type { ComponentPropsWithoutRef } from "react"

import { cn } from "~/shared/lib"

export function ToolbarGroup({ children, className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}
