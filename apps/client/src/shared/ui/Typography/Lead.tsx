import type { ElementType } from "react"

import { cn, type PolymorphicProps } from "~/shared/lib"

export function Lead<T extends ElementType = "p">({ as, children, className, ...props }: PolymorphicProps<T>) {
  const Component = as || "p"
  return (
    <Component className={cn("text-lg max-lg:text-base", className)} {...props}>
      {children}
    </Component>
  )
}
