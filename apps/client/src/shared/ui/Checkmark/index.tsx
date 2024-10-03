import { Check } from "lucide-react"

import { cn } from "~/shared/lib"

export function Checkmark({ className }: { className?: string }) {
  return (
    <div className={cn("bg-primary flex h-8 w-8 items-center justify-center rounded-full", className)}>
      <Check width="50%" height="50%" className="text-white" />
    </div>
  )
}
