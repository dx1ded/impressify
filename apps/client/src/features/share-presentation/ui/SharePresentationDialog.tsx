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
  DialogClose,
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
        <SharePresentation>
          {(sharePresentation, { data, loading, called }) => (
            <>
              <div className="flex items-center gap-2">
                <Input {...register("email")} />
                {data?.invite && called ? (
                  <DialogClose className="h-full" asChild>
                    <Button size="sm" className="h-full px-7">
                      Close
                    </Button>
                  </DialogClose>
                ) : (
                  <Button
                    disabled={loading}
                    size="sm"
                    className="h-full px-7"
                    onClick={handleSubmit(({ email }) => sharePresentation({ variables: { email, presentationId } }))}>
                    Save
                  </Button>
                )}
              </div>
              {formState.errors.email && (
                <small className="block font-medium text-red-400">{formState.errors.email.message}</small>
              )}
              {data?.invite && called && (
                <small className="block font-medium text-green-400">User has been invited</small>
              )}
            </>
          )}
        </SharePresentation>
      </DialogContent>
    </Dialog>
  )
}
