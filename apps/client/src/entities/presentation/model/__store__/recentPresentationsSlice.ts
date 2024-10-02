import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { SortParam } from "~/__generated__/graphql"
import type { FindPresentationItem } from "~/entities/presentation"
import type { ViewTypes } from "~/features/sort-presentations"

interface RecentPresentationsState {
  items: FindPresentationItem[]
  view: ViewTypes
  sort: SortParam
}

const initialState: RecentPresentationsState = {
  items: [],
  view: "grid",
  sort: SortParam.Newest,
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
    setSort: (state, { payload }: PayloadAction<SortParam>) => {
      state.sort = payload
    },
  },
})

export const { setRecentPresentations, setView, setSort } = recentPresentationsSlice.actions
export const recentPresentationsReducer = recentPresentationsSlice.reducer
