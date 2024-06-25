import type { ElementType } from "react"

import type { PolymorphicProps } from "~/shared/lib"

export function Text<T extends ElementType = "p">({ as, children, className, ...props }: PolymorphicProps<T>) {
  const Component = as || "p"
  return (
    <Component className={`leading-7 [&:not(:first-child)]:mt-6 ${className || ""}`} {...props}>
      {children}
    </Component>
  )
}
