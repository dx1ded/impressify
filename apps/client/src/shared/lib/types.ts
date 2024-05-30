import type { ComponentPropsWithoutRef, ElementType } from "react"

export type PolymorphicProps<T extends ElementType> = {
  as?: T
} & ComponentPropsWithoutRef<T>
