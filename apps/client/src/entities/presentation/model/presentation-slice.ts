import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import _ from "lodash"

import {
  type Presentation,
  type ElementProps,
  type Mode,
  type AddElementPayload,
  type TextEditProps,
  type ImageEditProps,
  type ShapeEditProps,
  getTextConfig,
  getImageConfig,
  getShapeConfig,
  NOT_SELECTED,
  DEFAULT_TEXT_COLOR,
  DEFAULT_FILL_COLOR,
  DEFAULT_BORDER_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_STROKE_COLOR,
  DEFAULT_STROKE_WIDTH,
} from "~/entities/presentation"

interface PresentationState {
  presentation: Presentation
  toolbar: {
    mode: Mode
    textProps: TextEditProps
    imageProps: ImageEditProps
    shapeProps: ShapeEditProps
  }
  currentSlide: number
  selectedId: number
  isLoading: boolean
  isCreating: boolean
  isEditing: boolean
}

const initialState: PresentationState = {
  presentation: {
    id: "",
    name: "",
    slides: [],
  },
  toolbar: {
    mode: "cursor",
    textProps: {
      textColor: DEFAULT_TEXT_COLOR,
      fillColor: DEFAULT_FILL_COLOR,
      borderColor: DEFAULT_BORDER_COLOR,
      fontFamily: DEFAULT_FONT_FAMILY,
      fontSize: DEFAULT_FONT_SIZE,
      bold: false,
      italic: false,
      underlined: false,
      alignment: "left",
      lineHeight: 1,
    },
    imageProps: {
      imageUrl: "",
      height: 0,
    },
    shapeProps: {
      type: "line",
      fillColor: DEFAULT_FILL_COLOR,
      strokeColor: DEFAULT_STROKE_COLOR,
      strokeWidth: DEFAULT_STROKE_WIDTH,
    },
  },
  currentSlide: 0,
  selectedId: NOT_SELECTED,
  isLoading: true,
  /*
    If `true` it means your next click is going to create a new element.
    It only gets activated if no item selected and mode !== cursor OR item selected and changed mode another from which is selected.
   */
  isCreating: false,
  // This prop is only used for <Text>
  isEditing: false,
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
    setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload
    },
    setIsCreating: (state, { payload }: PayloadAction<boolean>) => {
      state.isCreating = payload
    },
    setIsEditing: (state, { payload }: PayloadAction<boolean>) => {
      state.isEditing = payload
    },
    setBackground: (state, { payload }: PayloadAction<string>) => {
      state.presentation.slides = state.presentation.slides.map((slide, i) =>
        i === state.currentSlide ? { ...slide, bgColor: payload } : slide,
      )
    },
    setTransition: (state, { payload }: PayloadAction<string>) => {
      state.presentation.slides = state.presentation.slides.map((slide, i) =>
        i === state.currentSlide ? { ...slide, transition: payload } : slide,
      )
    },
    setThumbnail: (state, { payload }: PayloadAction<string>) => {
      state.presentation.slides = state.presentation.slides.map((slide, i) =>
        i === state.currentSlide ? { ...slide, thumbnailUrl: payload } : slide,
      )
    },
    addElement: (state, { payload }: PayloadAction<AddElementPayload>) => {
      const slide = state.presentation.slides[state.currentSlide]
      let newEl

      if (state.toolbar.mode === "text") {
        slide.elements = [...slide.elements, (newEl = getTextConfig({ ...state.toolbar.textProps, ...payload }))]
      } else if (state.toolbar.mode === "image") {
        slide.elements = [...slide.elements, (newEl = getImageConfig({ ...state.toolbar.imageProps, ...payload }))]
      } else if (state.toolbar.mode === "shape") {
        slide.elements = [...slide.elements, (newEl = getShapeConfig({ ...state.toolbar.shapeProps, ...payload }))]
      }

      state.selectedId = newEl!.id
    },
    selectElement: (state, { payload }: PayloadAction<number>) => {
      state.selectedId = payload
      if (payload === NOT_SELECTED) return
      // Changing toolbar values corresponding the element
      const selectedItem = state.presentation.slides[state.currentSlide].elements.find((el) => el.id === payload)!
      if (selectedItem.__typename === "Text") {
        state.toolbar.textProps = _.pick(selectedItem, Object.keys(state.toolbar.textProps) as (keyof TextEditProps)[])
      } else if (selectedItem.__typename === "Image") {
        state.toolbar.imageProps = _.pick(
          selectedItem,
          Object.keys(state.toolbar.imageProps) as (keyof ImageEditProps)[],
        )
      } else if (selectedItem.__typename === "Shape") {
        state.toolbar.shapeProps = _.pick(
          selectedItem,
          Object.keys(state.toolbar.shapeProps) as (keyof ShapeEditProps)[],
        )
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
      presentationSlice.caseReducers.editElement(state, {
        payload: { ...payload, id: state.selectedId },
      } as PayloadAction<Partial<ElementProps>>)
    },
    changeImageProps: (state, { payload }: PayloadAction<Partial<ImageEditProps>>) => {
      state.toolbar.imageProps = { ...state.toolbar.imageProps, ...payload }
      if (state.selectedId === NOT_SELECTED) return
      presentationSlice.caseReducers.editElement(state, {
        payload: { ...payload, id: state.selectedId },
      } as PayloadAction<Partial<ElementProps>>)
    },
    changeShapeProps: (state, { payload }: PayloadAction<Partial<ShapeEditProps>>) => {
      state.toolbar.shapeProps = { ...state.toolbar.shapeProps, ...payload }
      if (state.selectedId === NOT_SELECTED) return
      presentationSlice.caseReducers.editElement(state, {
        payload: { ...payload, id: state.selectedId },
      } as PayloadAction<Partial<ElementProps>>)
    },
    resetToolbar: (state) => {
      state.toolbar.textProps = initialState.toolbar.textProps
      state.toolbar.imageProps = initialState.toolbar.imageProps
      state.toolbar.shapeProps = initialState.toolbar.shapeProps
    },
  },
})

export const {
  setPresentation,
  setCurrentSlide,
  setMode,
  setIsLoading,
  setIsCreating,
  setIsEditing,
  setBackground,
  setTransition,
  setThumbnail,
  addElement,
  selectElement,
  editElement,
  changeTextProps,
  changeImageProps,
  changeShapeProps,
  resetToolbar,
} = presentationSlice.actions
export const presentationReducer = presentationSlice.reducer
