import type { ElementType } from "react"

import type { PolymorphicProps } from "~/shared/lib"

export function Subheading<T extends ElementType = "h2">({ as, children, className, ...props }: PolymorphicProps<T>) {
  const Component = as || "h2"
  return (
    <Component
      className={`scroll-m-20 pb-2 text-2xl font-semibold leading-relaxed tracking-tight first:mt-0 ${className || ""}`}
      {...props}>
      {children}
    </Component>
  )
}
