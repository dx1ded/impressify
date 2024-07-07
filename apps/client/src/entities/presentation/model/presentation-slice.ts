import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import _ from "lodash"

import {
  type Presentation,
  type AddTextPayload,
  type AddImagePayload,
  type AddShapePayload,
  getDefaultTextConfig,
  getDefaultImageConfig,
  getDefaultShapeConfig,
  type ElementProps,
  type Mode,
  type Shapes,
  type TextEditProps,
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
      fillColor: defaultTextConfig.fillColor,
      borderColor: defaultTextConfig.borderColor,
      fontFamily: defaultTextConfig.fontFamily,
      fontSize: defaultTextConfig.fontSize,
      bold: defaultTextConfig.bold,
      italic: defaultTextConfig.italic,
      underlined: defaultTextConfig.underlined,
      textColor: defaultTextConfig.textColor,
      alignment: defaultTextConfig.alignment,
      lineHeight: defaultTextConfig.lineHeight,
      isEditing: false,
    },
  },
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
    setCurrentSlide: (state, { payload }: PayloadAction<number>) => {
      state.currentSlide = payload
    },
    setSelectedId: (state, { payload }: PayloadAction<number>) => {
      state.selectedId = payload
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
            x: payload.x,
            y: payload.y,
          }),
        ]
      } else if (state.toolbar.mode === "image") {
        slide.elements = [...slide.elements, (newEl = getDefaultImageConfig(payload as AddImagePayload))]
      } else if (state.toolbar.mode === "shape") {
        slide.elements = [...slide.elements, (newEl = getDefaultShapeConfig(payload as AddShapePayload))]
      }

      state.selectedId = newEl!.id
    },
    editElement: (state, { payload }: PayloadAction<Partial<ElementProps>>) => {
      const slide = state.presentation.slides[state.currentSlide]
      slide.elements = slide.elements.map((element) =>
        element.id === payload.id ? ({ ...element, ...payload } as ElementProps) : element,
      )
    },
    changeTextProps: (state, { payload }: PayloadAction<Partial<TextEditProps>>) => {
      state.toolbar.textProps = { ...state.toolbar.textProps, ...payload }
    },
  },
})

export const {
  setPresentation,
  setCurrentSlide,
  setSelectedId,
  setMode,
  setShape,
  setIsLoading,
  addElement,
  editElement,
  changeTextProps,
} = presentationSlice.actions
export const presentationReducer = presentationSlice.reducer
