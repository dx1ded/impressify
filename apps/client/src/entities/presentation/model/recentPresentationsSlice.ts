import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { FindPresentationItem } from "~/entities/presentation"
import type { SortTypes, ViewTypes } from "~/features/sort-presentations"

interface RecentPresentationsState {
  items: FindPresentationItem[]
  view: ViewTypes
  sort: SortTypes
}

const initialState: RecentPresentationsState = {
  items: [],
  view: "grid",
  sort: "newest",
}

const recentPresentationsSlice = createSlice({
  name: "recentPresentations",
  initialState,
  reducers: {
    setRecentPresentations: (state, { payload }: PayloadAction<FindPresentationItem[]>) => {
      state.items = payload
    },
    setView: (state, { payload }: PayloadAction<ViewTypes>) => {
      state.view = payload
    },
    setSort: (state, { payload }: PayloadAction<SortTypes>) => {
      state.sort = payload
    },
  },
})

export const { setRecentPresentations, setView, setSort } = recentPresentationsSlice.actions
export const recentPresentationsReducer = recentPresentationsSlice.reducer
