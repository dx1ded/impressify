import type { ElementType } from "react"

import type { PolymorphicProps } from "~/shared/lib"

export function Lead<T extends ElementType = "p">({ as, children, className, ...props }: PolymorphicProps<T>) {
  const Component = as || "p"
  return (
    <Component className={`text-lg ${className || ""}`} {...props}>
      {children}
    </Component>
  )
}
