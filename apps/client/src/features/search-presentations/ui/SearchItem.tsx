import { PanelRightIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { formatDate } from "~/entities/presentation"
import { Small } from "~/shared/ui/Typography"

interface SearchItemProps {
  id: string
  name: string
  lastOpened: number
}

export function SearchItem({ id, name, lastOpened }: SearchItemProps) {
  return (
    <Link
      to={`/presentation/${id}`}
      className="flex items-center gap-2 p-3 hover:bg-gray-50 [&:not(:last-child)]:border-b">
      <PanelRightIcon className="text-primary h-3 w-3 flex-shrink-0" />
      <Small className="truncate">{name}</Small>
      <span className="text-grayish ml-auto inline-block flex-shrink-0 text-xs font-medium">
        Opened {formatDate(lastOpened)}
      </span>
    </Link>
  )
}
