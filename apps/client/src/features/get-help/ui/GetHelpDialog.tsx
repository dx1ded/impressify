import { zodResolver } from "@hookform/resolvers/zod"
import type { ReactNode } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { GetHelp } from "~/features/get-help"
import { GetHelpValidationSchema } from "~/features/get-help/model"
import { Button } from "~/shared/ui-kit/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui-kit/dialog"
import { Input } from "~/shared/ui-kit/input"

export function GetHelpDialog({ children }: { children: ReactNode }) {
  const { register, handleSubmit, formState } = useForm<z.infer<typeof GetHelpValidationSchema>>({
    resolver: zodResolver(GetHelpValidationSchema),
  })

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ask your question</DialogTitle>
          <DialogDescription>
            In the form below, please describe your problem and we&apos;ll respond you as soon as possible
          </DialogDescription>
        </DialogHeader>
        <GetHelp>
          {(sendHelpRequest, { data, loading, called }) => (
            <>
              <div className="flex items-center gap-2">
                <Input {...register("text")} />
                {data?.sendHelpRequest && called ? (
                  <DialogClose className="h-full" asChild>
                    <Button size="sm" className="h-full px-7">
                      Close
                    </Button>
                  </DialogClose>
                ) : (
                  <Button
                    size="sm"
                    className="h-full px-7"
                    disabled={loading}
                    onClick={handleSubmit(({ text }) => sendHelpRequest({ variables: { text } }))}>
                    Save
                  </Button>
                )}
              </div>
              {formState.errors.text && (
                <small className="block font-medium text-red-400">{formState.errors.text.message}</small>
              )}
              {data?.sendHelpRequest && called && (
                <small className="block font-medium text-green-400">Your request has been sent</small>
              )}
            </>
          )}
        </GetHelp>
      </DialogContent>
    </Dialog>
  )
}
