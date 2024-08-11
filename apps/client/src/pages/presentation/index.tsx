import { useMutation, useQuery } from "@apollo/client"
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
} from "~/__generated__/graphql"
import {
  GET_PRESENTATION,
  SAVE_SLIDES,
  SAVE_SLIDES_ID,
  setIsLoading,
  setIsSaving,
  setPresentation,
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

  register(
    SAVE_SLIDES_ID,
    async () => {
      await saveSlides({
        variables: {
          presentationId: id!,
          slides: slides.map(({ __typename, ...slide }) => ({
            // `__typename` is omitted by the deconstruction
            ...slide,
            // For elements, we filter items by text, image, and shape. In addition, for each field we remove `__typename` because
            // ... it's not present in the TextInput | ImageInput | ShapeInput definitions
            elements: {
              text: slide.elements
                .filter((element) => element.__typename === "Text")
                .map(
                  ({ __typename, ...element }) =>
                    ({
                      ...element,
                      index: slide.elements.findIndex((_element) => _element.id === element.id),
                    }) as TextInput,
                ),
              image: slide.elements
                .filter((element) => element.__typename === "Image")
                .map(
                  ({ __typename, ...element }) =>
                    ({
                      ...element,
                      index: slide.elements.findIndex((_element) => _element.id === element.id),
                    }) as ImageInput,
                ),
              shape: slide.elements
                .filter((element) => element.__typename === "Shape")
                .map(
                  ({ __typename, ...element }) =>
                    ({
                      ...element,
                      index: slide.elements.findIndex((_element) => _element.id === element.id),
                    }) as ShapeInput,
                ),
            },
          })),
        },
      })
      dispatch(setIsSaving(false))
    },
    DEBOUNCED_UPDATE_SLIDES_TIME,
    true,
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
