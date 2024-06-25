import { useLazyQuery } from "@apollo/client"
import { SearchIcon } from "lucide-react"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"

import type { SearchPresentationsQuery, SearchPresentationsQueryVariables } from "~/__generated__/graphql"
import { SEARCH_PRESENTATIONS } from "~/features/search-presentations/model"
import { SearchItem } from "~/features/search-presentations/ui"
import { cn } from "~/shared/lib"
import { useAppSelector } from "~/shared/model"
import { Input } from "~/shared/ui-kit/input"

export function SearchPresentations() {
  const { userId } = useAppSelector((state) => state.user)
  const [open, setOpen] = useState(false)
  const [searchPresentations, { data }] = useLazyQuery<SearchPresentationsQuery, SearchPresentationsQueryVariables>(
    SEARCH_PRESENTATIONS,
    {
      fetchPolicy: "network-only",
    },
  )

  const debouncedSearch = useDebouncedCallback(async (value: string) => {
    if (value.length < 1) return
    await searchPresentations({ variables: { name: value } })
  })

  const changeHandler = async (value: string) => {
    if (value.length < 1) return setOpen(false)
    setOpen(true)
    await debouncedSearch(value)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Input className="pr-11" placeholder="Search" onChange={(e) => changeHandler(e.target.value)} />
        <SearchIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600" />
      </div>
      <div
        className={cn(
          "absolute bottom-0 left-0 z-50 hidden w-full translate-y-full rounded-b bg-white drop-shadow",
          open && "block",
        )}>
        {data?.searchPresentations
          ?.map((presentation) => ({
            ...presentation,
            history: {
              ...presentation.history,
              records: presentation.history.records.filter((record) => record.user.id === userId),
            },
          }))
          .map((presentation) => (
            <SearchItem
              key={presentation.id}
              id={presentation.id}
              name={presentation.name}
              lastOpened={presentation.history.records[0].lastOpened}
            />
          ))}
      </div>
    </div>
  )
}
