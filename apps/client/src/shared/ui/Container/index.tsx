import type { ComponentPropsWithoutRef } from "react"

export function Container({ children, className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={`container ${className || ""}`} {...props}>
      {children}
    </div>
  )
}
