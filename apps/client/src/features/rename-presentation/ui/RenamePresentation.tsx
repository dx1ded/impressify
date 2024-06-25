import { useMutation } from "@apollo/client"
import { useCallback } from "react"

import type { RenamePresentationMutation, RenamePresentationMutationVariables } from "~/__generated__/graphql"
import { setRecentPresentations } from "~/entities/presentation"
import { RENAME_PRESENTATION } from "~/features/rename-presentation/model"
import type { ChildrenAsCallback } from "~/shared/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"

export function RenamePresentation({ children }: ChildrenAsCallback<[string, string]>) {
  const dispatch = useAppDispatch()
  const { recentPresentations } = useAppSelector((state) => state.recentPresentations)
  const [sendRenamePresentation, { loading }] = useMutation<
    RenamePresentationMutation,
    RenamePresentationMutationVariables
  >(RENAME_PRESENTATION)

  const renamePresentation = useCallback(
    async (id: string, name: string) => {
      await sendRenamePresentation({
        variables: { presentationId: id, name },
      })

      dispatch(
        setRecentPresentations(
          recentPresentations.map((presentation) =>
            presentation.id === id ? { ...presentation, name } : presentation,
          ),
        ),
      )
    },
    [dispatch, recentPresentations, sendRenamePresentation],
  )

  return children(renamePresentation, loading)
}
