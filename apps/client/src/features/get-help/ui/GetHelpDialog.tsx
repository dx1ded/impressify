import { zodResolver } from "@hookform/resolvers/zod"
import { type ReactNode, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { GetHelp } from "~/features/get-help"
import { GetHelpValidationSchema } from "~/features/get-help/model"
import { Button } from "~/shared/ui-kit/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui-kit/dialog"
import { Input } from "~/shared/ui-kit/input"
import { PopoverError } from "~/shared/ui/PopoverError"

export function GetHelpDialog({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { register, handleSubmit, formState } = useForm<z.infer<typeof GetHelpValidationSchema>>({
    resolver: zodResolver(GetHelpValidationSchema),
  })

  return (
    <Dialog open={isMenuOpen} onOpenChange={(value) => setIsMenuOpen(value)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ask your question</DialogTitle>
          <DialogDescription>
            In the form below, please describe your problem and we&apos;ll try to respond as soon as possible
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <PopoverError error={formState.errors.text}>
            <div className="flex-1">
              <Input {...register("text")} className="w-full" />
            </div>
          </PopoverError>
          <GetHelp
            onSuccess={() => {
              toast("Your request has been sent")
              setIsMenuOpen(false)
            }}>
            {(sendHelpRequest, { loading }) => (
              <Button
                size="sm"
                variant="blue"
                className="h-full px-7"
                disabled={loading}
                onClick={handleSubmit(({ text }) => sendHelpRequest({ variables: { text } }))}>
                Send
              </Button>
            )}
          </GetHelp>
        </div>
      </DialogContent>
    </Dialog>
  )
}
