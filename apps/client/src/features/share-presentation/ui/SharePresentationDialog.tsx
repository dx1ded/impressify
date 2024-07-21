import { zodResolver } from "@hookform/resolvers/zod"
import type { ReactNode } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { SharePresentation } from "~/features/share-presentation"
import { UserEmailSchema } from "~/features/share-presentation/model"
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

export function SharePresentationDialog({ children, presentationId }: { children: ReactNode; presentationId: string }) {
  const { register, handleSubmit, formState } = useForm<z.infer<typeof UserEmailSchema>>({
    resolver: zodResolver(UserEmailSchema),
  })

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share presentation</DialogTitle>
          <DialogDescription>You can share this presentation with someone else to work in a team!</DialogDescription>
        </DialogHeader>
        <div className="!mt-4 flex items-center gap-2">
          <Input {...register("email")} />
          <SharePresentation>
            {(sendInvite) => (
              <Button
                size="sm"
                className="h-full px-7"
                // Extra callback because handleSubmit calls e.stopPropagation by default, and it doesn't close the popover
                onClick={() => handleSubmit((data) => sendInvite(data.email, presentationId))()}>
                Save
              </Button>
            )}
          </SharePresentation>
        </div>
        {formState.errors.email && (
          <small className="!mt-3 block font-medium text-red-400">{formState.errors.email.message}</small>
        )}
      </DialogContent>
    </Dialog>
  )
}
