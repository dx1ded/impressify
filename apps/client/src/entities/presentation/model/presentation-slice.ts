import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import _ from "lodash"

import {
  type Presentation,
  type ElementProps,
  type HistoryRecord,
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
  MAX_HISTORY_LENGTH,
} from "~/entities/presentation"

interface PresentationState {
  presentation: Presentation
  history: {
    undoStack: HistoryRecord[]
    redoStack: HistoryRecord[]
  }
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
  history: {
    undoStack: [],
    redoStack: [],
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
    applyHistory: (state, { payload }: PayloadAction<"UNDO" | "REDO">) => {
      const historyStack = payload === "UNDO" ? state.history.undoStack : state.history.redoStack
      const invertedHistoryStack = payload === "UNDO" ? state.history.redoStack : state.history.undoStack
      const record = historyStack.pop()
      const slide = state.presentation.slides[state.currentSlide]
      if (!record) return
      if (record.type === "ADD") {
        slide.elements.splice(record.position, 0, record.element)
        invertedHistoryStack.push({ type: "DELETE", id: record.element.id })
      } else if (record.type === "EDIT") {
        invertedHistoryStack.push({
          type: "EDIT",
          oldProps: _.pick(slide.elements.find((el) => el.id === record.oldProps.id)!, Object.keys(record.oldProps)),
        })
        slide.elements = slide.elements.map((element) =>
          element.id === record.oldProps.id ? { ...element, ...record.oldProps } : element,
        ) as ElementProps[]
      } else if (record.type === "DELETE") {
        const index = slide.elements.findIndex((el) => el.id === record.id)!
        invertedHistoryStack.push({ type: "ADD", element: slide.elements[index], position: index })
        slide.elements = slide.elements.filter((element) => element.id !== record.id)
      }
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
        slide.elements.push((newEl = getTextConfig({ ...state.toolbar.textProps, ...payload })))
      } else if (state.toolbar.mode === "image") {
        slide.elements.push((newEl = getImageConfig({ ...state.toolbar.imageProps, ...payload })))
      } else if (state.toolbar.mode === "shape") {
        slide.elements.push((newEl = getShapeConfig({ ...state.toolbar.shapeProps, ...payload })))
      }

      state.selectedId = newEl!.id
      // Pushing record to history
      state.history.undoStack.push({ type: "DELETE", id: newEl!.id })
      if (state.history.undoStack.length > MAX_HISTORY_LENGTH) state.history.undoStack.pop()
      state.history.redoStack = []
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
      const element = slide.elements.find((el) => el.id === payload.id)!
      // Pushing record to history (payload always has .id in it)
      state.history.undoStack.push({ type: "EDIT", oldProps: _.pick(element, Object.keys(payload)) })
      if (state.history.undoStack.length > MAX_HISTORY_LENGTH) state.history.undoStack.pop()
      state.history.redoStack = []
      // Updating state
      slide.elements = slide.elements.map((element) =>
        element.id === payload.id ? ({ ...element, ...payload } as ElementProps) : element,
      )
    },
    deleteElement: (state, { payload }: PayloadAction<number>) => {
      const slide = state.presentation.slides[state.currentSlide]
      const index = slide.elements.findIndex((el) => el.id === payload)!
      // Pushing record to history
      state.history.undoStack.push({ type: "ADD", element: slide.elements[index], position: index })
      if (state.history.undoStack.length > MAX_HISTORY_LENGTH) state.history.undoStack.pop()
      state.history.redoStack = []
      // Updating state
      slide.elements = slide.elements.filter((el) => el.id !== payload)
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
  applyHistory,
  setBackground,
  setTransition,
  setThumbnail,
  addElement,
  selectElement,
  editElement,
  deleteElement,
  changeTextProps,
  changeImageProps,
  changeShapeProps,
  resetToolbar,
} = presentationSlice.actions
export const presentationReducer = presentationSlice.reducer
