import type { ReactNode } from "react"

import { DeletePresentation } from "~/features/delete-presentation"
import type { FeatureCallback } from "~/shared/lib"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/shared/ui-kit/alert-dialog"

function Wrapper(deletePresentation: FeatureCallback<[string]>) {
  return function DeleteAlert({
    children,
    presentationId,
    beforeHandler,
  }: {
    children: ReactNode
    presentationId: string
    beforeHandler?: () => void
  }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your presentation and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (beforeHandler) beforeHandler()
                deletePresentation(presentationId)
              }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
}

export type IDeleteAlert = ReturnType<typeof Wrapper>

export function DeletePresentationAlert({ children }: { children: (alert: IDeleteAlert) => ReactNode }) {
  return <DeletePresentation>{(deletePresentation) => children(Wrapper(deletePresentation))}</DeletePresentation>
}
