import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { FindPresentationItem, Presentation } from "~/entities/presentation"
import type { SortTypes, ViewTypes } from "~/features/sort-presentations"

interface PresentationState {
  recentPresentations: FindPresentationItem[]
  presentation: Presentation
  view: ViewTypes
  sort: SortTypes
  isLoading: boolean
}

const initialState: PresentationState = {
  recentPresentations: [],
  presentation: {
    id: "",
    name: "",
    slides: [],
  },
  view: "grid",
  sort: "newest",
  isLoading: true,
}

const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    setRecentPresentations: (state, { payload }: PayloadAction<FindPresentationItem[]>) => {
      state.recentPresentations = payload
    },
    setPresentation: (state, { payload }: PayloadAction<Presentation>) => {
      state.presentation = payload
    },
    setView: (state, { payload }: PayloadAction<ViewTypes>) => {
      state.view = payload
    },
    setSort: (state, { payload }: PayloadAction<SortTypes>) => {
      state.sort = payload
    },
    setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload
    },
  },
})

export const { setRecentPresentations, setPresentation, setView, setSort, setIsLoading } = presentationSlice.actions
export const presentationReducer = presentationSlice.reducer
