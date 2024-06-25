import { useMutation } from "@apollo/client"
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"

import type { DeletePresentationMutation, DeletePresentationMutationVariables } from "~/__generated__/graphql"
import { setRecentPresentations } from "~/entities/presentation"
import { DELETE_PRESENTATION } from "~/features/delete-presentation/model"
import type { ChildrenAsCallback } from "~/shared/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"

export function DeletePresentation({ children }: ChildrenAsCallback<[string]>) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { recentPresentations } = useAppSelector((state) => state.recentPresentations)
  const [sendDeletePresentation, { loading }] = useMutation<
    DeletePresentationMutation,
    DeletePresentationMutationVariables
  >(DELETE_PRESENTATION)

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

  return children(deletePresentation, loading)
}
