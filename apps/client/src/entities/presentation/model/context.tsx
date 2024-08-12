import { useMutation } from "@apollo/client"
import { type ReactNode, createContext, useCallback, useMemo, useContext, useState } from "react"

import type {
  SynchronizePresentationStateMutation,
  SynchronizePresentationStateMutationVariables,
  PresentationStateInput,
} from "~/__generated__/graphql"
import { SYNCHRONIZE_PRESENTATION_STATE } from "~/entities/presentation"
import { useAppSelector } from "~/shared/model"

interface ISynchronizeStateContext {
  synchronize: (changes: Omit<PresentationStateInput, "id" | "_userUpdatedStateId">) => void
  isSynchronizing: boolean
}

const initialState: ISynchronizeStateContext = {
  synchronize() {},
  isSynchronizing: false,
}

const SynchronizeStateContext = createContext(initialState)

export function SynchronizeStateProvider({ children }: { children: ReactNode }) {
  const presentationId = useAppSelector((state) => state.presentation.presentation.id)
  const users = useAppSelector((state) => state.presentation.presentation.users)
  const userId = useAppSelector((state) => state.user.userId)
  const [isSynchronizing, setIsSynchronizing] = useState(false)
  const [sendSynchronizePresentationState] = useMutation<
    SynchronizePresentationStateMutation,
    SynchronizePresentationStateMutationVariables
  >(SYNCHRONIZE_PRESENTATION_STATE)

  const synchronize = useCallback(
    async (changes: Omit<PresentationStateInput, "id" | "_userUpdatedStateId">) => {
      // We won't send any request if there's only 1 person working on the presentation
      if (users.length < 2) return
      setIsSynchronizing(true)
      await sendSynchronizePresentationState({
        variables: {
          changes: {
            ...changes,
            id: presentationId,
            _userUpdatedStateId: userId || "",
          },
        },
      })
      setIsSynchronizing(false)
    },
    [presentationId, sendSynchronizePresentationState, userId, users],
  )

  const value = useMemo(
    () => ({
      synchronize,
      isSynchronizing,
    }),
    [synchronize, isSynchronizing],
  )

  return <SynchronizeStateContext.Provider value={value}>{children}</SynchronizeStateContext.Provider>
}

export function useSynchronizeState() {
  return useContext(SynchronizeStateContext)
}
