import { useQuery } from "@apollo/client"
import { BoxIcon, ImageIcon, PanelsLeftBottomIcon, TypeIcon, UsersIcon } from "lucide-react"
import { type ReactNode, useState } from "react"

import type { GetPresentationInfoQuery, GetPresentationInfoQueryVariables } from "~/__generated__/graphql"
import { GET_PRESENTATION_INFO } from "~/entities/presentation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui-kit/dialog"
import { Skeleton } from "~/shared/ui-kit/skeleton"
import { Small } from "~/shared/ui/Typography"

export function PresentationInfoDialog({ children, presentationId }: { children: ReactNode; presentationId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data, loading } = useQuery<GetPresentationInfoQuery, GetPresentationInfoQueryVariables>(
    GET_PRESENTATION_INFO,
    {
      variables: { id: presentationId },
      fetchPolicy: "network-only",
      skip: !isDialogOpen,
    },
  )

  return (
    <Dialog onOpenChange={(value) => setIsDialogOpen(value)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent forceMount>
        <DialogHeader className="min-w-0">
          {loading ? (
            <>
              <DialogTitle hidden>Presentation name is loading</DialogTitle>
              <Skeleton className="h-[1.125rem] w-96" />
            </>
          ) : (
            <DialogTitle className="truncate">&quot;{data?.getPresentationInfo?.name}&quot;</DialogTitle>
          )}
          <DialogDescription hidden>Information about the presentation</DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <div className="flex items-center justify-between border-gray-100 px-1 py-2.5 transition-colors hover:bg-gray-100 [&:not(:last-child)]:border-b">
            <div className="grid gap-2">
              <PanelsLeftBottomIcon className="h-[1.125rem] w-[1.125rem]" />
              <Small>Slides</Small>
            </div>
            {loading ? (
              <Skeleton className="h-[1.0625rem] w-4" />
            ) : (
              <Small className="!mt-0 font-semibold">{data?.getPresentationInfo?.totalSlides}</Small>
            )}
          </div>
          <div className="flex items-center justify-between border-gray-100 px-1 py-2.5 transition-colors hover:bg-gray-100 [&:not(:last-child)]:border-b">
            <div className="grid gap-2">
              <UsersIcon className="h-[1.125rem] w-[1.125rem]" />
              <Small>Users</Small>
            </div>
            {loading ? (
              <Skeleton className="h-[1.0625rem] w-4" />
            ) : (
              <Small className="!mt-0 font-semibold">{data?.getPresentationInfo?.totalUsers}</Small>
            )}
          </div>
          <div className="flex items-center justify-between border-gray-100 px-1 py-2.5 transition-colors hover:bg-gray-100 [&:not(:last-child)]:border-b">
            <div className="grid gap-2">
              <TypeIcon className="h-[1.125rem] w-[1.125rem]" />
              <Small>Text elements</Small>
            </div>
            {loading ? (
              <Skeleton className="h-[1.0625rem] w-4" />
            ) : (
              <Small className="!mt-0 font-semibold">{data?.getPresentationInfo?.totalTextElements}</Small>
            )}
          </div>
          <div className="flex items-center justify-between border-gray-100 px-1 py-2.5 transition-colors hover:bg-gray-100 [&:not(:last-child)]:border-b">
            <div className="grid gap-2">
              <ImageIcon className="h-[1.125rem] w-[1.125rem]" />
              <Small>Image elements</Small>
            </div>
            {loading ? (
              <Skeleton className="h-[1.0625rem] w-4" />
            ) : (
              <Small className="!mt-0 font-semibold">{data?.getPresentationInfo?.totalImageElements}</Small>
            )}
          </div>
          <div className="flex items-center justify-between border-gray-100 px-1 py-2.5 transition-colors hover:bg-gray-100 [&:not(:last-child)]:border-b">
            <div className="grid gap-2">
              <BoxIcon className="h-[1.125rem] w-[1.125rem]" />
              <Small>Shape elements</Small>
            </div>
            {loading ? (
              <Skeleton className="h-[1.0625rem] w-4" />
            ) : (
              <Small className="!mt-0 font-semibold">{data?.getPresentationInfo?.totalShapeElements}</Small>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
