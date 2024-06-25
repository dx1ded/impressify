import { ArrowDownAZ, ArrowUpZA, CalendarMinus, CalendarPlus } from "lucide-react"
import { useDispatch } from "react-redux"

import { setSort } from "~/entities/presentation"
import type { SortTypes } from "~/features/sort-presentations/lib"
import { useAppSelector } from "~/shared/model"
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/shared/ui-kit/select"

export function SortType() {
  const dispatch = useDispatch()
  const { sort } = useAppSelector((state) => state.recentPresentations)

  const Icon =
    sort === "newest" ? CalendarPlus : sort === "oldest" ? CalendarMinus : sort === "a_z" ? ArrowDownAZ : ArrowUpZA

  return (
    <Select defaultValue="newest" onValueChange={(value: SortTypes) => dispatch(setSort(value))}>
      <SelectTrigger className="h-5 w-5 flex-shrink-0 border-none p-0 [&>span]:hidden">
        <Icon className="h-full w-full" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
        <SelectItem value="a_z">A - Z</SelectItem>
        <SelectItem value="z_a">Z - A</SelectItem>
      </SelectContent>
    </Select>
  )
}
