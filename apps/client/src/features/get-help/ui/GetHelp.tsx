import { type MutationFunction, type MutationResult, useMutation } from "@apollo/client"
import type { ReactNode } from "react"

import type { GetHelpMutation, GetHelpMutationVariables } from "~/__generated__/graphql"
import { GET_HELP } from "~/features/get-help/model"

export function GetHelp({
  children,
}: {
  children: (
    sendHelpRequest: MutationFunction<GetHelpMutation, GetHelpMutationVariables>,
    result: MutationResult<GetHelpMutation>,
  ) => ReactNode
}) {
  const [sendHelpRequest, result] = useMutation<GetHelpMutation, GetHelpMutationVariables>(GET_HELP)

  return children(sendHelpRequest, result)
}
