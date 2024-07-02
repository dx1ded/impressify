import { useMutation, useQuery } from "@apollo/client"
import { useParams } from "react-router-dom"

import type {
  AddRecordMutation,
  AddRecordMutationVariables,
  GetPresentationQuery,
  GetPresentationQueryVariables,
} from "~/__generated__/graphql"
import { GET_PRESENTATION, setIsLoading, setPresentation } from "~/entities/presentation"
import { ADD_RECORD } from "~/entities/record"
import { Slide } from "~/pages/presentation/ui/Slide"
import { SlideList } from "~/pages/presentation/ui/SlideList"
import { Toolbar } from "~/pages/presentation/ui/Toolbar"
import { Header } from "~/pages/presentation/ui/Header"
import { useAppDispatch } from "~/shared/model"
import { Toaster } from "~/shared/ui-kit/sonner"
import { TooltipProvider } from "~/shared/ui-kit/tooltip"

export default function Presentation() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

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
