import type { ElementType } from "react"

import { cn, type PolymorphicProps } from "~/shared/lib"

export function Subheading<T extends ElementType = "h2">({ as, children, className, ...props }: PolymorphicProps<T>) {
  const Component = as || "h2"
  return (
    <Component
      className={cn("scroll-m-20 pb-2 text-2xl font-bold leading-relaxed first:mt-0 max-xl:text-xl", className)}
      {...props}>
      {children}
    </Component>
  )
}
