import { useMutation, useQuery, useSubscription } from "@apollo/client"
import { useParams } from "react-router-dom"

import type {
  TextInput,
  ImageInput,
  ShapeInput,
  AddRecordMutation,
  AddRecordMutationVariables,
  GetPresentationQuery,
  GetPresentationQueryVariables,
  SaveSlidesMutation,
  SaveSlidesMutationVariables,
  PresentationUpdatedSubscription,
} from "~/__generated__/graphql"
import {
  type SlideProps,
  SynchronizeStateProvider,
  GET_PRESENTATION,
  PRESENTATION_UPDATED,
  SAVE_SLIDES,
  SAVE_SLIDES_ID,
  setIsLoading,
  setIsSaving,
  setName,
  setPresentation,
  setSlides,
  setUsers,
  transformSlidesIntoInput,
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
      <SynchronizeStateProvider>
        <Presentation />
      </SynchronizeStateProvider>
    </DebouncedProvider>
  )
}

const DEBOUNCED_UPDATE_SLIDES_TIME = 6000

function Presentation() {
  const { id } = useParams<{ id: string }>()
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const dispatch = useAppDispatch()
  const { register } = useDebouncedFunctions()

  const [saveSlides] = useMutation<SaveSlidesMutation, SaveSlidesMutationVariables>(SAVE_SLIDES)
  // Add new history record (or modify it if present)
  const [addRecord] = useMutation<AddRecordMutation, AddRecordMutationVariables>(ADD_RECORD, {
    variables: { presentationId: id! },
  })

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
      if (state.name) dispatch(setName(state.name))
      // I did casting because there's a type issue because of the `__typename`
      if (state.slides) dispatch(setSlides(state.slides as SlideProps[]))
      if (state.users) dispatch(setUsers(state.users))
      if (state.isSaving) dispatch(setIsSaving(state.isSaving))
    },
  })

  register(
    SAVE_SLIDES_ID,
    async () => {
      await saveSlides({
        variables: {
          presentationId: id!,
          slides: transformSlidesIntoInput(slides),
        },
      })
      dispatch(setIsSaving(false))
    },
    DEBOUNCED_UPDATE_SLIDES_TIME,
    // Making it update itself when `slides` is changed to have its latest copy
    [slides],
  )

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
