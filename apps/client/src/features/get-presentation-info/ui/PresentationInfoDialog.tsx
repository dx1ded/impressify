import type { ReactNode } from "react"

import { GetPresentationInfo } from "~/features/get-presentation-info/ui/GetPresentationInfo"
import { Button } from "~/shared/ui-kit/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui-kit/dialog"
import { Skeleton } from "~/shared/ui-kit/skeleton"
import { Small, Text } from "~/shared/ui/Typography"

export function PresentationInfoDialog({ children, presentationId }: { children: ReactNode; presentationId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Presentation information</DialogTitle>
          <DialogDescription hidden>Information about the presentation</DialogDescription>
        </DialogHeader>
        <GetPresentationInfo presentationId={presentationId}>
          {(data, loading) => (
            <div className="my-1 grid gap-1">
              <div className="flex items-center justify-between border-b py-1">
                <Small>Total slides</Small>
                {loading ? (
                  <Skeleton className="h-7 w-5" />
                ) : (
                  <Text className="!mt-0 font-semibold">{data?.totalSlides}</Text>
                )}
              </div>
              <div className="flex items-center justify-between border-b py-1">
                <Small>Total users</Small>
                {loading ? (
                  <Skeleton className="h-7 w-5" />
                ) : (
                  <Text className="!mt-0 font-semibold">{data?.totalUsers}</Text>
                )}
              </div>
              <div className="flex items-center justify-between border-b py-1">
                <Small>Total text elements</Small>
                {loading ? (
                  <Skeleton className="h-7 w-5" />
                ) : (
                  <Text className="!mt-0 font-semibold">{data?.totalTextElements}</Text>
                )}
              </div>
              <div className="flex items-center justify-between border-b py-1">
                <Small>Total image elements</Small>
                {loading ? (
                  <Skeleton className="h-7 w-5" />
                ) : (
                  <Text className="!mt-0 font-semibold">{data?.totalImageElements}</Text>
                )}
              </div>
              <div className="flex items-center justify-between border-b py-1">
                <Small>Total shape elements</Small>
                {loading ? (
                  <Skeleton className="h-7 w-5" />
                ) : (
                  <Text className="!mt-0 font-semibold">{data?.totalShapeElements}</Text>
                )}
              </div>
            </div>
          )}
        </GetPresentationInfo>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline" size="sm" className="px-5">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
