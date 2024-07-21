import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"

export type PolymorphicProps<T extends ElementType> = {
  as?: T
} & ComponentPropsWithoutRef<T>

export type FeatureCallback<CallbackArguments extends unknown[] = []> = (
  ...args: CallbackArguments
) => unknown | Promise<unknown>

export type ChildrenAsCallback<CallbackArguments extends unknown[] = []> = {
  children(_: FeatureCallback<CallbackArguments>, loading: boolean): ReactNode
}

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never
