import { PopoverArrow } from "@radix-ui/react-popover"
import { CirclePlusIcon } from "lucide-react"
import type { ReactNode } from "react"
import type { FieldError } from "react-hook-form"

import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui-kit/popover"

interface PopoverErrorProps {
  error?: FieldError
  children: ReactNode
}

export function PopoverError({ error, children }: PopoverErrorProps) {
  return (
    <Popover open={!!error}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side="bottom" sideOffset={6} className="px-2 py-2.5">
        {error && (
          <div className="flex items-center gap-2">
            <CirclePlusIcon className="h-4 w-4 rotate-45 text-red-600" />
            <p className="text-xs font-medium text-red-600">{error.message}</p>
          </div>
        )}
        <PopoverArrow fill="#dee5ee" width={12} height={6} />
      </PopoverContent>
    </Popover>
  )
}
