import type { ElementType } from "react"

import { cn, type PolymorphicProps } from "~/shared/lib"

export function Text<T extends ElementType = "p">({ as, children, className, ...props }: PolymorphicProps<T>) {
  const Component = as || "p"
  return (
    <Component className={cn("leading-7 max-md:text-sm", className)} {...props}>
      {children}
    </Component>
  )
}
