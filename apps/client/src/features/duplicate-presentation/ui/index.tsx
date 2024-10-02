import { type MutationResult, useMutation } from "@apollo/client"
import { type ReactNode, useCallback } from "react"
import { useNavigate } from "react-router-dom"

import type { DuplicatePresentationMutation, DuplicatePresentationMutationVariables } from "~/__generated__/graphql"
import { DUPLICATE_PRESENTATION } from "~/features/duplicate-presentation/api"
import { useAppDispatch, useDebouncedFunctions, clear } from "~/shared/model"

interface DuplicatePresentationProps {
  children(
    duplicatePresentation: (id: string) => void,
    result: MutationResult<DuplicatePresentationMutation>,
  ): ReactNode
}

export function DuplicatePresentation({ children }: DuplicatePresentationProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { flushAll, deleteAll } = useDebouncedFunctions()
  const [sendDuplicatePresentation, result] = useMutation<
    DuplicatePresentationMutation,
    DuplicatePresentationMutationVariables
  >(DUPLICATE_PRESENTATION)

  const duplicatePresentation = useCallback(
    async (id: string) => {
      flushAll()
      deleteAll()
      const result = await sendDuplicatePresentation({
        variables: { id },
      })

      const data = result.data?.duplicatePresentation
      if (!data) return
      dispatch(clear())
      navigate(`/presentation/${data.id}`)
    },
    [flushAll, deleteAll, navigate, dispatch, sendDuplicatePresentation],
  )

  return children(duplicatePresentation, result)
}
