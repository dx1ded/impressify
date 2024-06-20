import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { Presentation } from "~/__generated__/graphql"

interface PresentationState {
  recentPresentations: Presentation[]
  isLoading: boolean
}

const initialState: PresentationState = {
  recentPresentations: [],
  isLoading: true,
}

const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    setRecentPresentations: (state, { payload }: PayloadAction<Presentation[]>) => {
      state.recentPresentations = payload
    },
    setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload
    },
  },
})

export const { setRecentPresentations, setIsLoading } = presentationSlice.actions
export const presentationReducer = presentationSlice.reducer
