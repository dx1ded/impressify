import { ViewType } from "~/features/sort-presentations/ui/ViewType"
import { SortType } from "~/features/sort-presentations/ui/SortType"

export function SortPresentations() {
  return (
    <div className="flex items-center gap-3">
      <ViewType />
      <SortType />
    </div>
  )
}

export * from "./lib"
