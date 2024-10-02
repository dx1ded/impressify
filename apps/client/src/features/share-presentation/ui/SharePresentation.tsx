import { useMutation } from "@apollo/client"

import type { InviteMutation, InviteMutationVariables } from "~/__generated__/graphql"
import { INVITE_USER } from "~/entities/presentation-user"
import type { ChildrenAsCallbackWithApolloMutation } from "~/shared/lib"

export function SharePresentation({
  children,
}: ChildrenAsCallbackWithApolloMutation<InviteMutation, InviteMutationVariables>) {
  const [sharePresentation, result] = useMutation<InviteMutation, InviteMutationVariables>(INVITE_USER)

  return children(sharePresentation, result)
}
