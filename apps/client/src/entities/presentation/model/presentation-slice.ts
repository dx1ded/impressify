import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import {
  type Mode,
  type Presentation,
  type Shapes,
  type AddTextPayload,
  type AddImagePayload,
  type AddShapePayload,
  getDefaultTextConfig,
  getDefaultImageConfig,
  getDefaultShapeConfig,
} from "~/entities/presentation"

interface PresentationState {
  presentation: Presentation
  mode: Mode
  shape: Shapes
  currentSlide: number
  selectedId: number
  isLoading: boolean
}

const initialState: PresentationState = {
  presentation: {
    id: "",
    name: "",
    slides: [],
  },
  mode: "cursor",
  shape: "line",
  currentSlide: 0,
  selectedId: -1,
  isLoading: true,
}

const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    setPresentation: (state, { payload }: PayloadAction<Presentation>) => {
      state.presentation = payload
    },
    setMode: (state, { payload }: PayloadAction<Mode>) => {
      state.mode = payload
    },
    setShape: (state, { payload }: PayloadAction<Shapes>) => {
      state.shape = payload
    },
    setCurrentSlide: (state, { payload }: PayloadAction<number>) => {
      state.currentSlide = payload
    },
    setSelectedId: (state, { payload }: PayloadAction<number>) => {
      state.selectedId = payload
    },
    setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload
    },
    addElement: (state, { payload }: PayloadAction<AddTextPayload | AddImagePayload | AddShapePayload>) => {
      const slide = state.presentation.slides[state.currentSlide]
      let newEl

      if (state.mode === "text") {
        slide.elements = [...slide.elements, (newEl = getDefaultTextConfig(payload as AddTextPayload))]
      } else if (state.mode === "image") {
        slide.elements = [...slide.elements, (newEl = getDefaultImageConfig(payload as AddImagePayload))]
      } else if (state.mode === "shape") {
        slide.elements = [...slide.elements, (newEl = getDefaultShapeConfig(payload as AddShapePayload))]
      }

      state.selectedId = newEl!.id
    },
  },
})

export const { setPresentation, setMode, setShape, setCurrentSlide, setSelectedId, setIsLoading, addElement } =
  presentationSlice.actions
export const presentationReducer = presentationSlice.reducer
