import { useQuery } from "@apollo/client"

import type { GetPresentationInfoQuery, GetPresentationInfoQueryVariables } from "~/__generated__/graphql"
import { GET_PRESENTATION_INFO } from "~/features/get-presentation-info/model"
import type { ChildrenAsCallbackWithApolloQuery } from "~/shared/lib"

interface GetPresentationInfoProps
  extends ChildrenAsCallbackWithApolloQuery<GetPresentationInfoQuery, GetPresentationInfoQueryVariables> {
  presentationId: string
}

export function GetPresentationInfo({ presentationId, children }: GetPresentationInfoProps) {
  const result = useQuery<GetPresentationInfoQuery, GetPresentationInfoQueryVariables>(GET_PRESENTATION_INFO, {
    variables: { id: presentationId },
    fetchPolicy: "network-only",
  })

  return children(result)
}
