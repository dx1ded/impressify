import { useMutation } from "@apollo/client"

import type { SendHelpRequestMutation, SendHelpRequestMutationVariables } from "~/__generated__/graphql"
import { SEND_HELP_REQUEST } from "~/features/get-help/api"
import type { ChildrenAsCallbackWithApolloMutation } from "~/shared/lib"

export function GetHelp({
  children,
}: ChildrenAsCallbackWithApolloMutation<SendHelpRequestMutation, SendHelpRequestMutationVariables>) {
  const [sendHelpRequest, result] = useMutation<SendHelpRequestMutation, SendHelpRequestMutationVariables>(
    SEND_HELP_REQUEST,
  )

  return children(sendHelpRequest, result)
}
