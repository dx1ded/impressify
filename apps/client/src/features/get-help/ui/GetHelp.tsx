import { type MutationFunctionOptions, useMutation } from "@apollo/client"

import { Result, type SendHelpRequestMutation, type SendHelpRequestMutationVariables } from "~/__generated__/graphql"
import { SEND_HELP_REQUEST } from "~/features/get-help/api"
import type { ChildrenAsCallbackWithApolloMutation } from "~/shared/lib"

interface GetHelpProps
  extends ChildrenAsCallbackWithApolloMutation<SendHelpRequestMutation, SendHelpRequestMutationVariables> {
  onSuccess?: () => void
}

export function GetHelp({ onSuccess, children }: GetHelpProps) {
  const [sendHelpRequest, result] = useMutation<SendHelpRequestMutation, SendHelpRequestMutationVariables>(
    SEND_HELP_REQUEST,
  )

  const _sentHelpRequest = async (
    options?: MutationFunctionOptions<SendHelpRequestMutation, SendHelpRequestMutationVariables>,
  ) => {
    const request = await sendHelpRequest(options)
    if (request.data?.sendHelpRequest === Result.Success && onSuccess) onSuccess()
    return request
  }

  return children(_sentHelpRequest, result)
}
