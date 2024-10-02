import { useLazyQuery } from "@apollo/client"
import { motion } from "framer-motion"
import { PlusIcon, SearchIcon } from "lucide-react"
import { useRef, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

import type { SearchPresentationsQuery, SearchPresentationsQueryVariables } from "~/__generated__/graphql"
import { SEARCH_PRESENTATIONS } from "~/features/search-presentations/api"
import { SearchItem } from "~/features/search-presentations/ui"
import { cn } from "~/shared/lib"
import { useAppSelector } from "~/shared/model"
import { Input } from "~/shared/ui-kit/input"

const DEBOUNCE_SEARCH_TIME = 500

const menuVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
}

export function SearchPresentations() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const userId = useAppSelector((state) => state.user.id)
  const [searchPresentations, { data, fetchMore }] = useLazyQuery<
    SearchPresentationsQuery,
    SearchPresentationsQueryVariables
  >(SEARCH_PRESENTATIONS, {
    fetchPolicy: "network-only",
  })

  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (data?.searchPresentations) {
      // Use fetchMore to preserve the previous results
      fetchMore({
        variables: { name: value },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          return {
            ...fetchMoreResult,
            searchPresentations: fetchMoreResult.searchPresentations,
          }
        },
      })
    } else {
      searchPresentations({ variables: { name: value } })
    }
  }, DEBOUNCE_SEARCH_TIME)

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

  const isOpen = isMenuOpen && !!data?.searchPresentations?.length

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        className={cn("pl-10 pr-8 focus-visible:ring-0", isOpen && "rounded-b-none")}
        placeholder="Search"
        onChange={(e) => changeHandler(e.target.value)}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600" />
      {isOpen && (
        <button type="button" className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2" onClick={closeMenu}>
          <PlusIcon className="h-full w-full rotate-45 text-gray-600" />
        </button>
      )}
      <motion.div
        className="absolute bottom-0 left-0 z-50 block w-full translate-y-full rounded-b bg-white drop-shadow"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        transition={{ duration: 0.15 }}>
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
      </motion.div>
    </div>
  )
}
