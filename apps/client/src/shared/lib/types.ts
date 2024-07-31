import type { MutationFunction, MutationResult, OperationVariables, QueryResult } from "@apollo/client"
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"

export type PolymorphicProps<T extends ElementType> = {
  as?: T
} & ComponentPropsWithoutRef<T>

export type FeatureCallback<CallbackArguments extends unknown[] = []> = (
  ...args: CallbackArguments
) => unknown | Promise<unknown>

// In places where I needed to specify other arguments (except for fn) I just manually specified the type
export type ChildrenAsCallbackWithFn<CallbackArguments extends unknown[] = []> = {
  children(fn: FeatureCallback<CallbackArguments>): ReactNode
}

export type ChildrenAsCallbackWithApolloQuery<Query, Variables extends OperationVariables> = {
  children(result: QueryResult<Query, Variables>): ReactNode
}

export type ChildrenAsCallbackWithApolloMutation<Mutation, Variables> = {
  children(mutationFn: MutationFunction<Mutation, Variables>, result: MutationResult<Mutation>): ReactNode
}

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never
