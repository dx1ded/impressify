import type { ElementType } from "react"

import { cn, type PolymorphicProps } from "~/shared/lib"

export function Heading<T extends ElementType = "h1">({ as, children, className, ...props }: PolymorphicProps<T>) {
  const Component = as || "h1"
  return (
    <Component
      className={cn("scroll-m-20 text-5xl font-bold !leading-tight tracking-normal max-xl:text-3xl", className)}
      {...props}>
      {children}
    </Component>
  )
}
