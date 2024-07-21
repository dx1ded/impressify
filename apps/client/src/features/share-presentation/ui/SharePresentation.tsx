import { useMutation } from "@apollo/client"
import { useCallback } from "react"

import type { InviteMutation, InviteMutationVariables } from "~/__generated__/graphql"
import { INVITE_USER } from "~/features/share-presentation/model"
import type { ChildrenAsCallback } from "~/shared/lib"

export function SharePresentation({ children }: ChildrenAsCallback<[string, string]>) {
  const [sendInvite, { loading }] = useMutation<InviteMutation, InviteMutationVariables>(INVITE_USER)

  const inviteUser = useCallback(
    async (email: string, presentationId: string) => {
      const result = await sendInvite({
        variables: { email, presentationId },
      })

      if (!result.data?.invite) return false
      // After this I should add user to presentation.users. However, I should make it with subscriptions!
      return result.data.invite
    },
    [sendInvite],
  )

  return children(inviteUser, loading)
}
