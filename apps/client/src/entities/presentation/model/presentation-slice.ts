import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import _ from "lodash"

import {
  type Presentation,
  type AddTextPayload,
  type AddImagePayload,
  type AddShapePayload,
  type ElementProps,
  type Mode,
  type Shapes,
  type TextEditProps,
  NOT_SELECTED,
  toolbarTextProps,
  getDefaultShapeConfig,
  getDefaultTextConfig,
  getDefaultImageConfig,
} from "~/entities/presentation"

interface PresentationState {
  presentation: Presentation
  toolbar: {
    mode: Mode
    shape: Shapes
    textProps: TextEditProps
  }
  currentSlide: number
  selectedId: number
  isLoading: boolean
}

const defaultTextConfig = getDefaultTextConfig({ x: 0, y: 0 })

const initialState: PresentationState = {
  presentation: {
    id: "",
    name: "",
    slides: [],
  },
  toolbar: {
    mode: "cursor",
    shape: "line",
    textProps: {
      ..._.pick(defaultTextConfig, toolbarTextProps),
      isEditing: false,
    },
  },
  currentSlide: 0,
  selectedId: NOT_SELECTED,
  isLoading: true,
}

const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    setPresentation: (state, { payload }: PayloadAction<Presentation>) => {
      state.presentation = payload
    },
    setCurrentSlide: (state, { payload }: PayloadAction<number>) => {
      state.currentSlide = payload
    },
    setMode: (state, { payload }: PayloadAction<Mode>) => {
      state.toolbar.mode = payload
    },
    setShape: (state, { payload }: PayloadAction<Shapes>) => {
      state.toolbar.shape = payload
    },
    setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload
    },
    addElement: (state, { payload }: PayloadAction<AddTextPayload | AddImagePayload | AddShapePayload>) => {
      const slide = state.presentation.slides[state.currentSlide]
      let newEl

      if (state.toolbar.mode === "text") {
        slide.elements = [
          ...slide.elements,
          (newEl = {
            // Taking default props
            ...defaultTextConfig,
            // Taking actual user props
            ..._.omit(state.toolbar.textProps, "isEditing"),
            // Changing id and coordinates
            id: Math.random(),
            x: payload.x - defaultTextConfig.width / 2,
            y: payload.y - defaultTextConfig.height / 2,
          }),
        ]
      } else if (state.toolbar.mode === "image") {
        slide.elements = [...slide.elements, (newEl = getDefaultImageConfig(payload as AddImagePayload))]
      } else if (state.toolbar.mode === "shape") {
        slide.elements = [...slide.elements, (newEl = getDefaultShapeConfig(payload as AddShapePayload))]
      }

      state.selectedId = newEl!.id
    },
    selectElement: (state, { payload }: PayloadAction<number>) => {
      state.selectedId = payload
      if (payload === NOT_SELECTED) return
      // Changing toolbar values corresponding the element
      const selectedItem = state.presentation.slides[state.currentSlide].elements.find((el) => el.id === payload)!
      if (selectedItem.__typename === "Text") {
        state.toolbar.textProps = {
          isEditing: false,
          ..._.pick(selectedItem, toolbarTextProps),
        }
      }
    },
    editElement: (state, { payload }: PayloadAction<Partial<ElementProps>>) => {
      const slide = state.presentation.slides[state.currentSlide]
      slide.elements = slide.elements.map((element) =>
        element.id === payload.id ? ({ ...element, ...payload } as ElementProps) : element,
      )
    },
    changeTextProps: (state, { payload }: PayloadAction<Partial<TextEditProps>>) => {
      state.toolbar.textProps = { ...state.toolbar.textProps, ...payload }
      if (state.selectedId === NOT_SELECTED) return
      const slide = state.presentation.slides[state.currentSlide]
      slide.elements = slide.elements.map((element) =>
        element.id === state.selectedId ? { ...element, ...payload } : element,
      )
    },
    resetToolbar: (state) => {
      state.toolbar.textProps = initialState.toolbar.textProps
    },
  },
})

export const {
  setPresentation,
  setCurrentSlide,
  setMode,
  setShape,
  setIsLoading,
  addElement,
  selectElement,
  editElement,
  changeTextProps,
  resetToolbar,
} = presentationSlice.actions
export const presentationReducer = presentationSlice.reducer
