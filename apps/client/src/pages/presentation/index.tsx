import _ from "lodash"
import { useMutation, useQuery, useSubscription } from "@apollo/client"
import type { MouseEvent } from "react"
import { shallowEqual } from "react-redux"
import { useParams } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce"

import type {
  AddRecordMutation,
  AddRecordMutationVariables,
  GetPresentationQuery,
  GetPresentationQueryVariables,
  SaveSlidesMutation,
  SaveSlidesMutationVariables,
  PresentationUpdatedSubscription,
  PresentationUpdatedSubscriptionVariables,
  SynchronizePresentationStateMutation,
  SynchronizePresentationStateMutationVariables,
} from "~/__generated__/graphql"
import {
  type SlideProps,
  transformSlidesIntoInput,
  GET_PRESENTATION,
  PRESENTATION_UPDATED,
  SYNCHRONIZE_PRESENTATION_STATE,
  SAVE_SLIDES,
  SAVE_SLIDES_ID,
  SYNCHRONIZE_STATE_ID,
  setIsLoading,
  setIsSaving,
  setName,
  setPresentation,
  setSlides,
  setConnectedUsers,
  changeConnectedUser,
} from "~/entities/presentation"
import { ADD_RECORD } from "~/entities/record"
import { Slide } from "~/pages/presentation/ui/Slide"
import { SlideList } from "~/pages/presentation/ui/SlideList"
import { Header } from "~/pages/presentation/ui/Header"
import { Cursor } from "~/shared/ui/Cursor"
import { Toolbar } from "~/widgets/toolbar"
import { DebouncedProvider, useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"
import { Toaster } from "~/shared/ui-kit/sonner"
import { TooltipProvider } from "~/shared/ui-kit/tooltip"

export default function PresentationPage() {
  return (
    <DebouncedProvider>
      <Presentation />
    </DebouncedProvider>
  )
}

const DEBOUNCED_SAVE_SLIDES_TIME = 8000
const DEBOUNCED_SYNCHRONIZE_STATE_TIME = 500
const DEBOUNCED_SAVE_CURSOR = 500

function Presentation() {
  const { id } = useParams<{ id: string }>()
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const connectedUsers = useAppSelector((state) => state.presentation.connectedUsers)
  const { name, isSaving, currentSlide, userId } = useAppSelector(
    (state) => ({
      name: state.presentation.presentation.name,
      currentSlide: state.presentation.currentSlide,
      isSaving: state.presentation.isSaving,
      userId: state.user.userId,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()
  const { register, call, cancel } = useDebouncedFunctions()

  const [saveSlides] = useMutation<SaveSlidesMutation, SaveSlidesMutationVariables>(SAVE_SLIDES)
  const [synchronizeStateBetweenConnections] = useMutation<
    SynchronizePresentationStateMutation,
    SynchronizePresentationStateMutationVariables
  >(SYNCHRONIZE_PRESENTATION_STATE)
  // Add new history record (or modify it if present)
  const [addRecord] = useMutation<AddRecordMutation, AddRecordMutationVariables>(ADD_RECORD, {
    variables: { presentationId: id! },
  })

  register(
    SAVE_SLIDES_ID,
    async () => {
      const result = await saveSlides({
        variables: {
          presentationId: id!,
          slides: transformSlidesIntoInput(slides),
        },
      })
      if (!result.data?.saveSlides) return
      // There's no need to update state on data because it's already up-to-date (changes locally + synchronization with other connections)
      // However, I update `slides` because dataUrl are being replaced by simple urls (generated by Firebase Storage), so it's more efficient
      // By the way, I used casting because there's a type issue since elements in the array might be nullable
      dispatch(setSlides(result.data.saveSlides as SlideProps[]))
      dispatch(setIsSaving(false))
      // And then we synchronize the state with other connections
      call(SYNCHRONIZE_STATE_ID)
    },
    DEBOUNCED_SAVE_SLIDES_TIME,
    [slides],
  )

  register(
    SYNCHRONIZE_STATE_ID,
    async () => {
      if (connectedUsers.length < 2) return
      await synchronizeStateBetweenConnections({
        variables: {
          state: {
            id: id!,
            name,
            slides: transformSlidesIntoInput(slides),
            // Omitting `name`, `profilePicUrl` and `__typename` fields because it's not defined in the input
            connectedUser: _.omit(connectedUsers.find((_user) => _user.id === userId)!, [
              "name",
              "profilePicUrl",
              "__typename",
            ]),
            isSaving,
          },
        },
      })
    },
    DEBOUNCED_SYNCHRONIZE_STATE_TIME,
    [slides, name, connectedUsers, userId, isSaving],
  )

  // Fetch presentation
  useQuery<GetPresentationQuery, GetPresentationQueryVariables>(GET_PRESENTATION, {
    skip: !id,
    variables: { presentationId: id! },
    fetchPolicy: "network-only",
    async onCompleted(result) {
      const data = result.getPresentation
      if (!data) return
      dispatch(setPresentation(data))
      dispatch(setIsLoading(false))
      await addRecord()
    },
  })

  // Subscription to update presentation state
  useSubscription<PresentationUpdatedSubscription, PresentationUpdatedSubscriptionVariables>(PRESENTATION_UPDATED, {
    skip: !id,
    variables: { presentationId: id! },
    async onData(result) {
      const state = result.data.data?.presentationUpdated
      if (!state) return
      if (state.name) dispatch(setName(state.name))
      if (state.slides) dispatch(setSlides(state.slides))
      if (state.isSaving) dispatch(setIsSaving(state.isSaving))
      if (state.connectedUsers) dispatch(setConnectedUsers(state.connectedUsers))
      // Cancel save slides to avoid collision
      cancel(SAVE_SLIDES_ID)
    },
  })

  const mouseMoveHandlerDebounced = useDebouncedCallback((e: MouseEvent<HTMLDivElement>) => {
    dispatch(changeConnectedUser({ id: userId!, cursorX: e.clientX, cursorY: e.clientY }))
    call(SYNCHRONIZE_STATE_ID)
  }, DEBOUNCED_SAVE_CURSOR)

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-[#f8fafd] px-4" onMouseMove={mouseMoveHandlerDebounced}>
        {connectedUsers.map(
          (connectedUser) =>
            connectedUser.id !== userId &&
            connectedUser.currentSlide === currentSlide &&
            connectedUser.cursorX &&
            connectedUser.cursorY && (
              <Cursor
                key={connectedUser.id}
                name={connectedUser.name}
                x={connectedUser.cursorX}
                y={connectedUser.cursorY}
              />
            ),
        )}
        <div>
          <Header />
          <Toolbar />
        </div>
        <div className="flex min-h-[56rem] flex-1 gap-4">
          <SlideList />
          <Slide />
        </div>
      </div>
      {/* To use <ResizableInput/> */}
      <Toaster />
    </TooltipProvider>
  )
}
