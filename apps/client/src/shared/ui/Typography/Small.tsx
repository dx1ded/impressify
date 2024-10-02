import type { ElementType } from "react"

import type { PolymorphicProps } from "~/shared/lib"

export function Small<T extends ElementType = "small">({ as, children, className, ...props }: PolymorphicProps<T>) {
  const Component = as || "small"
  return (
    <Component className={`text-sm font-medium leading-tight ${className || ""}`} {...props}>
      {children}
    </Component>
  )
}
