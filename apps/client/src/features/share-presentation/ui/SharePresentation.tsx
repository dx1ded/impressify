import { type MutationFunction, type MutationResult, useMutation } from "@apollo/client"
import type { ReactNode } from "react"

import type { InviteMutation, InviteMutationVariables } from "~/__generated__/graphql"
import { INVITE_USER } from "~/features/share-presentation/model"

export function SharePresentation({
  children,
}: {
  children: (
    sharePresentation: MutationFunction<InviteMutation, InviteMutationVariables>,
    result: MutationResult<InviteMutation>,
  ) => ReactNode
}) {
  const [sharePresentation, result] = useMutation<InviteMutation, InviteMutationVariables>(INVITE_USER)

  return children(sharePresentation, result)
}
