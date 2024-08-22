import { type MutationResult, useMutation } from "@apollo/client"
import { type ReactNode, useCallback } from "react"
import { useNavigate } from "react-router-dom"

import type { CreatePresentationMutation, CreatePresentationMutationVariables } from "~/__generated__/graphql"
import { CREATE_PRESENTATION } from "~/features/create-presentation/api"
import { DEFAULT_NAME } from "~/entities/presentation"
import { useAppDispatch, clear } from "~/shared/model"

interface CreatePresentationProps {
  children(
    createPresentation: (template: string) => void,
    result: MutationResult<CreatePresentationMutation>,
  ): ReactNode
}

export function CreatePresentation({ children }: CreatePresentationProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [sendCreatePresentation, result] = useMutation<CreatePresentationMutation, CreatePresentationMutationVariables>(
    CREATE_PRESENTATION,
  )

  const createPresentation = useCallback(
    async (template: string) => {
      const result = await sendCreatePresentation({
        variables: {
          name: DEFAULT_NAME,
          template,
        },
      })

      const data = result.data?.createPresentation
      if (!data) return
      dispatch(clear())
      navigate(`/presentation/${data.id}`)
    },
    [navigate, dispatch, sendCreatePresentation],
  )

  return children(createPresentation, result)
}
