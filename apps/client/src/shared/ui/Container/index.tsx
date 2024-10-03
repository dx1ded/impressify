import type { ComponentPropsWithoutRef } from "react"

import { cn } from "~/shared/lib"

export function Container({ children, className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("container max-md:px-5", className)} {...props}>
      {children}
    </div>
  )
}
