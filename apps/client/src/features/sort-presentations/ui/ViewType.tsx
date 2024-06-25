import { Grid2X2, Rows3 } from "lucide-react"

import { setView } from "~/entities/presentation"
import { useAppDispatch, useAppSelector } from "~/shared/model"

export function ViewType() {
  const { view } = useAppSelector((state) => state.recentPresentations)
  const dispatch = useAppDispatch()

  return (
    <button
      type="button"
      className="h-5 w-5 flex-shrink-0"
      onClick={() => dispatch(setView(view === "grid" ? "list" : "grid"))}>
      {view === "grid" ? <Rows3 className="h-full w-full" /> : <Grid2X2 className="h-full w-full" />}
    </button>
  )
}
