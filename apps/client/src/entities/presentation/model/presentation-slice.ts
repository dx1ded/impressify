import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { Presentation } from "~/entities/presentation"

interface PresentationState {
  presentation: Presentation
  isLoading: boolean
}

const initialState: PresentationState = {
  presentation: {
    id: "",
    name: "",
    slides: [],
  },
  isLoading: true,
}

const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    setPresentation: (state, { payload }: PayloadAction<Presentation>) => {
      state.presentation = payload
    },
    setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload
    },
  },
})

export const { setPresentation, setIsLoading } = presentationSlice.actions
export const presentationReducer = presentationSlice.reducer
