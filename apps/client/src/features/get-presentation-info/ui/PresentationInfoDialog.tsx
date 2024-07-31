import type { ReactNode } from "react"

import { GetPresentationInfo } from "~/features/get-presentation-info/ui/GetPresentationInfo"
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
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent forceMount>
        <DialogHeader>
          <DialogTitle>Presentation information</DialogTitle>
          <DialogDescription hidden>Information about the presentation</DialogDescription>
        </DialogHeader>
        <GetPresentationInfo presentationId={presentationId}>
          {({ data, loading }) => (
            <div className="grid gap-2.5">
              <div className="flex items-center justify-between border-gray-100 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-2.5">
                <Small>Total slides</Small>
                {loading ? (
                  <Skeleton className="h-[1.0625.rem] w-4" />
                ) : (
                  <Small className="!mt-0 font-semibold">{data?.getPresentationInfo?.totalSlides}</Small>
                )}
              </div>
              <div className="flex items-center justify-between border-gray-100 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-2.5">
                <Small>Total users</Small>
                {loading ? (
                  <Skeleton className="h-[1.0625.rem] w-4" />
                ) : (
                  <Small className="!mt-0 font-semibold">{data?.getPresentationInfo?.totalUsers}</Small>
                )}
              </div>
              <div className="flex items-center justify-between border-gray-100 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-2.5">
                <Small>Total text elements</Small>
                {loading ? (
                  <Skeleton className="h-[1.0625.rem] w-4" />
                ) : (
                  <Small className="!mt-0 font-semibold">{data?.getPresentationInfo?.totalTextElements}</Small>
                )}
              </div>
              <div className="flex items-center justify-between border-gray-100 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-2.5">
                <Small>Total image elements</Small>
                {loading ? (
                  <Skeleton className="h-[1.0625.rem] w-4" />
                ) : (
                  <Small className="!mt-0 font-semibold">{data?.getPresentationInfo?.totalImageElements}</Small>
                )}
              </div>
              <div className="flex items-center justify-between border-gray-100 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-2.5">
                <Small>Total shape elements</Small>
                {loading ? (
                  <Skeleton className="h-[1.0625.rem] w-4" />
                ) : (
                  <Small className="!mt-0 font-semibold">{data?.getPresentationInfo?.totalShapeElements}</Small>
                )}
              </div>
            </div>
          )}
        </GetPresentationInfo>
      </DialogContent>
    </Dialog>
  )
}
