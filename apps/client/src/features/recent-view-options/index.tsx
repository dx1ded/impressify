import { AlphabeticSort } from "~/features/recent-view-options/ui/AlphabeticSort"
import { ViewType } from "~/features/recent-view-options/ui/ViewType"

export function RecentViewOptions() {
  return (
    <div className="flex items-center gap-3">
      <ViewType />
      <AlphabeticSort />
    </div>
  )
}
