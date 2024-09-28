import { useLazyQuery } from "@apollo/client"
import { PlusIcon, SearchIcon } from "lucide-react"
import { useRef, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

import type { SearchPresentationsQuery, SearchPresentationsQueryVariables } from "~/__generated__/graphql"
import { SEARCH_PRESENTATIONS } from "~/features/search-presentations/api"
import { SearchItem } from "~/features/search-presentations/ui"
import { cn } from "~/shared/lib"
import { useAppSelector } from "~/shared/model"
import { Input } from "~/shared/ui-kit/input"

export function SearchPresentations() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const userId = useAppSelector((state) => state.user.id)
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
    if (value.length < 1) return setIsMenuOpen(false)
    setIsMenuOpen(true)
    await debouncedSearch(value)
  }

  const closeMenu = () => {
    if (!inputRef.current) return
    inputRef.current.value = ""
    setIsMenuOpen(false)
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        className={cn("pl-10 pr-8 focus-visible:ring-0", isMenuOpen && "rounded-b-none")}
        placeholder="Search"
        onChange={(e) => changeHandler(e.target.value)}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600" />
      {isMenuOpen && (
        <button type="button" className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2" onClick={closeMenu}>
          <PlusIcon className="h-full w-full rotate-45 text-gray-600" />
        </button>
      )}
      <div
        className={cn(
          "absolute bottom-0 left-0 z-50 hidden w-full translate-y-full rounded-b bg-white drop-shadow",
          isMenuOpen && "block",
        )}>
        {data?.searchPresentations
          ?.map((presentation) => ({
            ...presentation,
            history: {
              ...presentation.history,
              records: presentation.history.records.filter((record) => record.user.props.id === userId),
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
