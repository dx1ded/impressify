import { zodResolver } from "@hookform/resolvers/zod"
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
import { PopoverError } from "~/shared/ui/PopoverError"

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
          <div className="flex items-center gap-2">
            <PopoverError error={formState.errors.name}>
              <div className="flex-1">
                <Input {...register("name")} className="w-full" autoComplete="off" />
              </div>
            </PopoverError>
            <Button
              size="sm"
              variant="blue"
              className="h-full px-7"
              // Extra callback because handleSubmit calls e.stopPropagation by default, and it doesn't close the popover
              onClick={() => handleSubmit(({ name }) => renamePresentation(presentationId, name))()}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

export type IRenameDialog = ReturnType<typeof Wrapper>

export function RenamePresentationDialog({ children }: { children: (dialog: IRenameDialog) => ReactNode }) {
  return <RenamePresentation>{(renamePresentation) => children(Wrapper(renamePresentation))}</RenamePresentation>
}
