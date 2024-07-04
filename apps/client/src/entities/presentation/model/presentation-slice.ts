import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

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

const _textProps = getDefaultTextConfig({ x: 0, y: 0 })

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
      fillColor: _textProps.fillColor,
      borderColor: _textProps.borderColor,
      fontFamily: _textProps.fontFamily,
      fontSize: _textProps.fontSize,
      bold: _textProps.bold,
      italic: _textProps.italic,
      underlined: _textProps.underlined,
      textColor: _textProps.textColor,
      alignment: _textProps.alignment,
      lineHeight: _textProps.lineHeight,
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
            ..._textProps,
            x: payload.x,
            y: payload.y,
            fillColor: state.toolbar.textProps.fillColor,
            borderColor: state.toolbar.textProps.borderColor,
            fontFamily: state.toolbar.textProps.fontFamily,
            fontSize: state.toolbar.textProps.fontSize,
            bold: state.toolbar.textProps.bold,
            italic: state.toolbar.textProps.italic,
            underlined: state.toolbar.textProps.underlined,
            textColor: state.toolbar.textProps.textColor,
            alignment: state.toolbar.textProps.alignment,
            lineHeight: state.toolbar.textProps.lineHeight,
          }),
        ]
      } else if (state.toolbar.mode === "image") {
        slide.elements = [...slide.elements, (newEl = getDefaultImageConfig(payload as AddImagePayload))]
      } else if (state.toolbar.mode === "shape") {
        slide.elements = [...slide.elements, (newEl = getDefaultShapeConfig(payload as AddShapePayload))]
      }

      state.selectedId = newEl!.id
    },
    editElement: (state, { payload }: PayloadAction<ElementProps>) => {
      const slide = state.presentation.slides[state.currentSlide]
      slide.elements = slide.elements.map((element) => (element.id === payload.id ? payload : element))
    },
    changeTextProps: (state, { payload }: PayloadAction<Partial<PresentationState["toolbar"]["textProps"]>>) => {
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
