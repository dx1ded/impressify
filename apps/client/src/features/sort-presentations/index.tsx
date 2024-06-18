import { AlphabeticSort } from "~/features/sort-presentations/ui/AlphabeticSort"
import { ViewType } from "~/features/sort-presentations/ui/ViewType"

export function SortPresentations() {
  return (
    <div className="flex items-center gap-3">
      <ViewType />
      <AlphabeticSort />
    </div>
  )
}
