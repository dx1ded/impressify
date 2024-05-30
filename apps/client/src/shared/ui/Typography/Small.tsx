import type { ElementType } from "react"

import type { PolymorphicProps } from "~/shared"

export function Small<T extends ElementType = "small">({ as, children, className, ...props }: PolymorphicProps<T>) {
  const Component = as || "small"
  return (
    <Component className={`text-sm font-medium leading-none ${className || ""}`} {...props}>
      {children}
    </Component>
  )
}
