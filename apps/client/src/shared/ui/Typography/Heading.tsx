import type { ElementType } from "react"

import type { PolymorphicProps } from "~/shared"

export function Heading<T extends ElementType = "h1">({ as, children, className, ...props }: PolymorphicProps<T>) {
  const Component = as || "h1"
  return (
    <Component
      className={`scroll-m-20 text-4xl font-bold !leading-tight tracking-normal lg:text-5xl ${className || ""}`}
      {...props}>
      {children}
    </Component>
  )
}
