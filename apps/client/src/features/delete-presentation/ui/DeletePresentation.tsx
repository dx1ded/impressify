import { type MutationResult, useMutation } from "@apollo/client"
import type { YPresentation } from "@server/hocuspocus/types"
import * as Y from "yjs"
import { type ReactNode, useCallback } from "react"
import { useNavigate } from "react-router-dom"

import {
  type DeletePresentationMutation,
  type DeletePresentationMutationVariables,
  Result,
} from "~/__generated__/graphql"
import { DELETE_PRESENTATION } from "~/features/delete-presentation/api"
import { useYjs } from "~/shared/model"

interface DeletePresentationProps {
  children(deletePresentation: (id: string) => void, result: MutationResult<DeletePresentationMutation>): ReactNode
}

export function DeletePresentation({ children }: DeletePresentationProps) {
  const navigate = useNavigate()
  const [sendDeletePresentation, result] = useMutation<DeletePresentationMutation, DeletePresentationMutationVariables>(
    DELETE_PRESENTATION,
  )
  const { getMap } = useYjs()

  const deletePresentation = useCallback(
    async (id: string) => {
      const request = await sendDeletePresentation({
        variables: { presentationId: id },
      })

      if (request.data?.deletePresentation === Result.Success) {
        const yPresentation = getMap() as YPresentation
        // Setting `users` as an empty array so other users will be disconnected because they're not in the array
        yPresentation.set("users", new Y.Array())
        navigate("/home")
      }
    },
    [navigate, getMap, sendDeletePresentation],
  )

  return children(deletePresentation, result)
}
