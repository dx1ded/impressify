import { type MutationResult, useMutation } from "@apollo/client"
import { type ReactNode, useCallback } from "react"

import type { RenamePresentationMutation, RenamePresentationMutationVariables } from "~/__generated__/graphql"
import { RENAME_PRESENTATION } from "~/features/rename-presentation/api"

interface RenamePresentationProps {
  children(
    renamePresentation: (id: string, name: string) => void,
    result: MutationResult<RenamePresentationMutation>,
  ): ReactNode
}

export function RenamePresentation({ children }: RenamePresentationProps) {
  const [sendRenamePresentation, result] = useMutation<RenamePresentationMutation, RenamePresentationMutationVariables>(
    RENAME_PRESENTATION,
  )

  const renamePresentation = useCallback(
    async (id: string, name: string) => {
      await sendRenamePresentation({
        variables: { presentationId: id, name },
      })
    },
    [sendRenamePresentation],
  )

  return children(renamePresentation, result)
}
