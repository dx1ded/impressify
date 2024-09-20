import { type MutationResult, useMutation } from "@apollo/client"
import { type ReactNode, useCallback } from "react"

import type { RenamePresentationMutation, RenamePresentationMutationVariables } from "~/__generated__/graphql"
import { setRecentPresentations } from "~/entities/presentation"
import { RENAME_PRESENTATION } from "~/features/rename-presentation/api"
import { useAppDispatch, useAppSelector } from "~/shared/model"

interface RenamePresentationProps {
  children(
    renamePresentation: (id: string, name: string) => void,
    result: MutationResult<RenamePresentationMutation>,
  ): ReactNode
}

export function RenamePresentation({ children }: RenamePresentationProps) {
  const dispatch = useAppDispatch()
  const recentPresentations = useAppSelector((state) => state.recentPresentations.items)
  const [sendRenamePresentation, result] = useMutation<RenamePresentationMutation, RenamePresentationMutationVariables>(
    RENAME_PRESENTATION,
  )

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

  return children(renamePresentation, result)
}
