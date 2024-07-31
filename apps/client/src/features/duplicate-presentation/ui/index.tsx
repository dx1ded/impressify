import { useMutation } from "@apollo/client"
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"

import { COPY_PRESENTATION } from "~/features/duplicate-presentation/model"
import type { CopyPresentationMutation, CopyPresentationMutationVariables } from "~/__generated__/graphql"
import { clear } from "~/entities/presentation"
import type { ChildrenAsCallback } from "~/shared/lib"
import { useAppDispatch, useDebouncedFunctions } from "~/shared/model"

export function DuplicatePresentation({ children }: ChildrenAsCallback<[string]>) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { flushAll } = useDebouncedFunctions()
  const [sendCopyPresentation, { loading }] = useMutation<CopyPresentationMutation, CopyPresentationMutationVariables>(
    COPY_PRESENTATION,
  )

  const copyPresentation = useCallback(
    async (id: string) => {
      flushAll()
      const result = await sendCopyPresentation({
        variables: { id },
      })

      const data = result.data?.copyPresentation
      if (!data) return
      dispatch(clear())
      navigate(`/presentation/${data.id}`)
    },
    [flushAll, navigate, dispatch, sendCopyPresentation],
  )

  return children(copyPresentation, loading)
}
