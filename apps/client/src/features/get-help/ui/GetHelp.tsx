import { useMutation } from "@apollo/client"

import type { GetHelpMutation, GetHelpMutationVariables } from "~/__generated__/graphql"
import { GET_HELP } from "~/features/get-help/model"
import type { ChildrenAsCallbackWithApolloMutation } from "~/shared/lib"

export function GetHelp({ children }: ChildrenAsCallbackWithApolloMutation<GetHelpMutation, GetHelpMutationVariables>) {
  const [sendHelpRequest, result] = useMutation<GetHelpMutation, GetHelpMutationVariables>(GET_HELP)

  return children(sendHelpRequest, result)
}
