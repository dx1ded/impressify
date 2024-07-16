import { useMutation, useQuery } from "@apollo/client"
import { useRef } from "react"
import { useParams } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce"
import type { Stage } from "konva/lib/Stage"

import type {
  AddRecordMutation,
  AddRecordMutationVariables,
  GetPresentationQuery,
  GetPresentationQueryVariables,
} from "~/__generated__/graphql"
import {
  GET_PRESENTATION,
  setIsLoading,
  setPresentation,
  setThumbnail,
  ScreenshotProvider,
} from "~/entities/presentation"
import { ADD_RECORD } from "~/entities/record"
import { Slide } from "~/pages/presentation/ui/Slide"
import { SlideList } from "~/pages/presentation/ui/SlideList"
import { Header } from "~/pages/presentation/ui/Header"
import { useAppDispatch } from "~/shared/model"
import { Toolbar } from "~/widgets/toolbar"
import { Toaster } from "~/shared/ui-kit/sonner"
import { TooltipProvider } from "~/shared/ui-kit/tooltip"

const SCREENSHOT_DEBOUCE_TIME = 5000

export default function Presentation() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const stageRef = useRef<Stage>(null)

  // Add new record (or modify it if present)
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

  const takeScreenshot = useDebouncedCallback(() => {
    if (!stageRef.current) return
    // Hiding transformers (if there are some)
    const transformers = stageRef.current.find("Transformer")
    transformers.forEach((tr) => tr.visible(false))
    const url = stageRef.current.toDataURL()
    transformers.forEach((tr) => tr.visible(true))
    dispatch(setThumbnail(url))
  }, SCREENSHOT_DEBOUCE_TIME)

  return (
    <TooltipProvider>
      <ScreenshotProvider takeScreenshot={takeScreenshot}>
        <div className="flex h-screen flex-col bg-[#f8fafd] px-4">
          <div>
            <Header />
            <Toolbar />
          </div>
          <div className="flex min-h-[56rem] flex-1 gap-4">
            <SlideList />
            <Slide ref={stageRef} />
          </div>
        </div>
        {/* To use <ResizableInput/> */}
        <Toaster />
      </ScreenshotProvider>
    </TooltipProvider>
  )
}
