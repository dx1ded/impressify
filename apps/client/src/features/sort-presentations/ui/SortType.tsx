import { ArrowDownAZ, ArrowUpZA, CalendarMinus, CalendarPlus } from "lucide-react"

import { SortParam } from "~/__generated__/graphql"
import { setSort } from "~/entities/presentation"
import { useAppDispatch, useAppSelector } from "~/shared/model"
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/shared/ui-kit/select"

export function SortType() {
  const dispatch = useAppDispatch()
  const sort = useAppSelector((state) => state.recentPresentations.sort)

  const Icon =
    sort === SortParam.Newest
      ? CalendarPlus
      : sort === SortParam.Oldest
        ? CalendarMinus
        : sort === SortParam.AZ
          ? ArrowDownAZ
          : ArrowUpZA

  return (
    <Select defaultValue="newest" onValueChange={(value: SortParam) => dispatch(setSort(value))}>
      <SelectTrigger className="h-5 w-5 flex-shrink-0 border-none p-0 [&>span]:hidden">
        <Icon className="h-full w-full" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={SortParam.Newest}>Newest</SelectItem>
        <SelectItem value={SortParam.Oldest}>Oldest</SelectItem>
        <SelectItem value={SortParam.AZ}>A - Z</SelectItem>
        <SelectItem value={SortParam.ZA}>Z - A</SelectItem>
      </SelectContent>
    </Select>
  )
}
