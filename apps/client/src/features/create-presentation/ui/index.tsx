import { useMutation } from "@apollo/client"
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"

import type { CreatePresentationMutation, CreatePresentationMutationVariables } from "~/__generated__/graphql"
import { clear, DEFAULT_NAME } from "~/entities/presentation"
import { CREATE_PRESENTATION } from "~/features/create-presentation/model"
import type { ChildrenAsCallback } from "~/shared/lib"
import { useAppDispatch } from "~/shared/model"

export function CreatePresentation({ children }: ChildrenAsCallback<[string]>) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [sendCreatePresentation, { loading }] = useMutation<
    CreatePresentationMutation,
    CreatePresentationMutationVariables
  >(CREATE_PRESENTATION)

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

  return children(createPresentation, loading)
}
