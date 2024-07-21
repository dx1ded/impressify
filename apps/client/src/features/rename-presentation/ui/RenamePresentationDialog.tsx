import { zodResolver } from "@hookform/resolvers/zod"
import { PopoverClose } from "@radix-ui/react-popover"
import type { ReactNode } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { RenamePresentation } from "~/features/rename-presentation"
import { PresentationNameSchema } from "~/features/rename-presentation/model"
import type { FeatureCallback } from "~/shared/lib"
import { Button } from "~/shared/ui-kit/button"
import { Input } from "~/shared/ui-kit/input"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/shared/ui-kit/dialog"

function Wrapper(renamePresentation: FeatureCallback<[string, string]>) {
  return function RenameDialog({
    children,
    presentationId,
    presentationName,
  }: {
    children: ReactNode
    presentationId: string
    presentationName: string
  }) {
    const { register, handleSubmit, formState } = useForm<z.infer<typeof PresentationNameSchema>>({
      resolver: zodResolver(PresentationNameSchema),
      values: { name: presentationName },
    })

    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename presentation</DialogTitle>
            <DialogDescription>
              Make changes to your presentation here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="!mt-4 flex items-center gap-2">
            <Input {...register("name")} />
            {/* <PopoverClose asChild> */}
            <Button
              size="sm"
              className="h-full px-7"
              // Extra callback because handleSubmit calls e.stopPropagation by default, and it doesn't close the popover
              onClick={() => handleSubmit((data) => renamePresentation(presentationId, data.name))()}>
              Save
            </Button>
            {/* </PopoverClose> */}
          </div>
          {formState.errors.name && (
            <small className="!mt-3 block font-medium text-red-400">{formState.errors.name.message}</small>
          )}
        </DialogContent>
      </Dialog>
    )
  }
}

export type IRenameDialog = ReturnType<typeof Wrapper>

export function RenamePresentationDialog({ children }: { children: (dialog: IRenameDialog) => ReactNode }) {
  return <RenamePresentation>{(renamePresentation) => children(Wrapper(renamePresentation))}</RenamePresentation>
}
