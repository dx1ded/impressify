import { Fragment } from "react"

import { cn } from "~/shared/lib"

interface ShortcutProps {
  keys: string[]
  className?: string
}

export function Shortcut({ keys, className }: ShortcutProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {keys.map((key, i) => (
        <Fragment key={i}>
          <span className="rounded-md bg-gray-200 px-1.5 py-1 text-xs font-medium text-gray-600">{key}</span>
          {i !== keys.length - 1 && <span className="font-semibold">+</span>}
        </Fragment>
      ))}
    </div>
  )
}
