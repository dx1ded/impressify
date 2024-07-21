import { useQuery } from "@apollo/client"
import type { ReactNode } from "react"

import type { GetPresentationInfoQuery, GetPresentationInfoQueryVariables } from "~/__generated__/graphql"
import { GET_PRESENTATION_INFO } from "~/features/get-presentation-info/model"

export function GetPresentationInfo({
  presentationId,
  children,
}: {
  presentationId: string
  children: (data: GetPresentationInfoQuery["getPresentationInfo"], loading: boolean) => ReactNode
}) {
  const { data, loading } = useQuery<GetPresentationInfoQuery, GetPresentationInfoQueryVariables>(
    GET_PRESENTATION_INFO,
    {
      variables: { id: presentationId },
    },
  )

  return children(data?.getPresentationInfo, loading)
}
