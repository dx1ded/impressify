import { type MutationResult, useMutation } from "@apollo/client"
import { type ReactNode, useCallback } from "react"
import { useNavigate } from "react-router-dom"

import type { DeletePresentationMutation, DeletePresentationMutationVariables } from "~/__generated__/graphql"
import { setRecentPresentations } from "~/entities/presentation"
import { DELETE_PRESENTATION } from "~/features/delete-presentation/model"
import { useAppDispatch, useAppSelector } from "~/shared/model"

interface DeletePresentationProps {
  children(deletePresentation: (id: string) => void, result: MutationResult<DeletePresentationMutation>): ReactNode
}

export function DeletePresentation({ children }: DeletePresentationProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const recentPresentations = useAppSelector((state) => state.recentPresentations.items)
  const [sendDeletePresentation, result] = useMutation<DeletePresentationMutation, DeletePresentationMutationVariables>(
    DELETE_PRESENTATION,
  )

  const deletePresentation = useCallback(
    async (id: string) => {
      await sendDeletePresentation({
        variables: { presentationId: id },
      })

      dispatch(setRecentPresentations(recentPresentations.filter((presentation) => presentation.id !== id)))
      navigate("/home")
    },
    [dispatch, navigate, recentPresentations, sendDeletePresentation],
  )

  return children(deletePresentation, result)
}
