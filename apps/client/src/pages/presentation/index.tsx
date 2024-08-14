import { useMutation, useQuery, useSubscription } from "@apollo/client"
import { shallowEqual } from "react-redux"
import { useParams } from "react-router-dom"

import type {
  AddRecordMutation,
  AddRecordMutationVariables,
  GetPresentationQuery,
  GetPresentationQueryVariables,
  SaveSlidesMutation,
  SaveSlidesMutationVariables,
  PresentationUpdatedSubscription,
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
  setUsers,
} from "~/entities/presentation"
import { ADD_RECORD } from "~/entities/record"
import { Slide } from "~/pages/presentation/ui/Slide"
import { SlideList } from "~/pages/presentation/ui/SlideList"
import { Header } from "~/pages/presentation/ui/Header"
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

function Presentation() {
  const { id } = useParams<{ id: string }>()
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const users = useAppSelector((state) => state.presentation.presentation.users)
  const { name, isSaving } = useAppSelector(
    (state) => ({
      name: state.presentation.presentation.name,
      isSaving: state.presentation.isSaving,
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
      if (users.length < 2) return
      await synchronizeStateBetweenConnections({
        variables: {
          state: {
            id: id!,
            name,
            slides: transformSlidesIntoInput(slides),
            // Mapping to remove `__typename` (it's not defined in PresentationStateInput)
            users: users.map(({ __typename, ..._user }) => _user),
            isSaving,
          },
        },
      })
    },
    DEBOUNCED_SYNCHRONIZE_STATE_TIME,
    [slides, name, users, isSaving],
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
  useSubscription<PresentationUpdatedSubscription>(PRESENTATION_UPDATED, {
    skip: !id,
    async onData(result) {
      const state = result.data.data?.presentationUpdated
      if (!state) return
      dispatch(setName(state.name))
      dispatch(setSlides(state.slides))
      dispatch(setIsSaving(state.isSaving))
      dispatch(setUsers(state.users))
      // Cancel save slides to avoid collision
      cancel(SAVE_SLIDES_ID)
    },
  })

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-[#f8fafd] px-4">
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
