import _ from "lodash"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { nanoid } from "nanoid"

import {
  type Presentation,
  type SlideProps,
  type ElementProps,
  type HistoryRecord,
  type Mode,
  type AddElementPayload,
  type TextEditProps,
  type ImageEditProps,
  type ShapeEditProps,
  type SlideId,
  type ElementId,
  type UserId,
  getSlideConfig,
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
  COPIED_ELEMENT_X_DIF,
  COPIED_ELEMENT_Y_DIF,
} from "~/entities/presentation"
import { Alignment, ConnectedUser, ShapeType, Transition } from "~/__generated__/graphql"

interface PresentationState {
  presentation: Presentation
  connectedUsers: ConnectedUser[]
  copiedElement: Omit<ElementProps, "id"> | null
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
  selectedId: ElementId
  isLoading: boolean
  isCreating: boolean
  isEditing: boolean
  isSaving: boolean
}

const initialState: PresentationState = {
  presentation: {
    id: "",
    name: "",
    slides: [],
  },
  // connected to the subscription users
  connectedUsers: [],
  copiedElement: null,
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
      alignment: Alignment.Left,
      lineHeight: 1,
    },
    imageProps: {
      imageUrl: "",
      height: 0,
    },
    shapeProps: {
      type: ShapeType.Line,
      fillColor: DEFAULT_FILL_COLOR,
      strokeColor: DEFAULT_STROKE_COLOR,
      strokeWidth: DEFAULT_STROKE_WIDTH,
    },
  },
  // currentSlide is an index
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
  // Saving to the server
  isSaving: false,
}

const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    setPresentation: (state, { payload }: PayloadAction<Presentation>) => {
      state.presentation = payload
    },
    setName: (state, { payload }: PayloadAction<string>) => {
      state.presentation.name = payload
    },
    setSlides: (state, { payload }: PayloadAction<SlideProps[]>) => {
      state.presentation.slides = payload
    },
    setConnectedUsers: (state, { payload }: PayloadAction<ConnectedUser[]>) => {
      state.connectedUsers = payload
    },
    changeConnectedUser: (state, { payload }: PayloadAction<Partial<ConnectedUser>>) => {
      state.connectedUsers = state.connectedUsers.map((_user) =>
        _user.id === payload.id ? { ..._user, ...payload } : _user,
      )
    },
    setCurrentSlide: (state, { payload }: PayloadAction<number>) => {
      state.currentSlide = payload
      state.isEditing = false
      state.isCreating = false
      state.selectedId = NOT_SELECTED
      state.history = initialState.history
      state.toolbar = initialState.toolbar
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
    setIsSaving: (state, { payload }: PayloadAction<boolean>) => {
      state.isSaving = payload
    },
    addSlide: (state) => {
      state.presentation.slides.push(getSlideConfig())
      presentationSlice.caseReducers.setCurrentSlide(state, {
        payload: state.presentation.slides.length - 1,
      } as PayloadAction<number>)
    },
    moveSlide: (state, { payload }: PayloadAction<{ id: SlideId; newIndex: number }>) => {
      const { id, newIndex } = payload
      const deleteIndex = state.presentation.slides.findIndex((slide) => slide.id === id)!
      const slideCopy = { ...state.presentation.slides[deleteIndex] }
      state.presentation.slides.splice(deleteIndex, 1)
      state.presentation.slides.splice(newIndex, 0, slideCopy)
      state.currentSlide = newIndex
    },
    duplicateSlide: (state, { payload }: PayloadAction<SlideId>) => {
      const index = state.presentation.slides.findIndex((slide) => slide.id === payload)!
      const slide = state.presentation.slides[index]
      state.presentation.slides.splice(index + 1, 0, {
        ...slide,
        // It is necessary to change slide id and its elements' ids to avoid collision
        id: nanoid(8),
        elements: slide.elements.map((el) => ({ ...el, id: nanoid(8) })),
      })
      presentationSlice.caseReducers.setCurrentSlide(state, {
        payload: index + 1,
      } as PayloadAction<number>)
    },
    // `userId` is needed for `changeConnectedUser`
    deleteSlide: (state, { payload }: PayloadAction<{ slideId: SlideId; userId: UserId }>) => {
      if (state.presentation.slides.length === 1) return
      const index = state.presentation.slides.findIndex((slide) => slide.id === payload.slideId)!
      let nextCurrentSlide = index
      if (index === state.presentation.slides.length - 1) {
        nextCurrentSlide = index - 1
        presentationSlice.caseReducers.changeConnectedUser(state, {
          payload: { id: payload.userId, currentSlideId: state.presentation.slides[nextCurrentSlide].id },
        } as PayloadAction<Partial<ConnectedUser>>)
      }
      presentationSlice.caseReducers.setCurrentSlide(state, {
        payload: nextCurrentSlide,
      } as PayloadAction<number>)
      state.presentation.slides.splice(index, 1)
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
        i === state.currentSlide ? { ...slide, bg: payload } : slide,
      )
    },
    setTransition: (state, { payload }: PayloadAction<Transition>) => {
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
    selectElement: (state, { payload }: PayloadAction<ElementId>) => {
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
      const element = slide.elements.find((el) => el.id === payload.id)
      if (!element) return
      // Pushing record to history (payload always has .id in it)
      state.history.undoStack.push({ type: "EDIT", oldProps: _.pick(element, Object.keys(payload)) })
      if (state.history.undoStack.length > MAX_HISTORY_LENGTH) state.history.undoStack.pop()
      state.history.redoStack = []
      // Updating state
      slide.elements = slide.elements.map((element) =>
        element.id === payload.id ? ({ ...element, ...payload } as ElementProps) : element,
      )
    },
    deleteElement: (state) => {
      const slide = state.presentation.slides[state.currentSlide]
      const index = slide.elements.findIndex((el) => el.id === state.selectedId)!
      // Pushing record to history
      state.history.undoStack.push({ type: "ADD", element: slide.elements[index], position: index })
      if (state.history.undoStack.length > MAX_HISTORY_LENGTH) state.history.undoStack.pop()
      state.history.redoStack = []
      // Updating state
      slide.elements = slide.elements.filter((el) => el.id !== state.selectedId)
    },
    copyElement: (state) => {
      const element = state.presentation.slides[state.currentSlide].elements.find((el) => el.id === state.selectedId)!
      // It's not going to break the code if I don't omit id because getConfig functions would redefine it. However, it's always better to make sure
      state.copiedElement = _.omit(element, ["id"])
    },
    pasteElement: (state) => {
      const slide = state.presentation.slides[state.currentSlide]
      const { copiedElement } = state
      if (!copiedElement) return
      const newEl = {
        ...copiedElement,
        // Again, we should always update ids to avoid collision
        id: nanoid(8),
        // Some difference in coordinates so element is not above another element
        x: copiedElement.x + COPIED_ELEMENT_X_DIF,
        y: copiedElement.y + COPIED_ELEMENT_Y_DIF,
      } as ElementProps
      slide.elements.push(newEl)
      state.selectedId = newEl.id
      // Redefining copiedElement so coordinates will not be the same when paste 2 and more elements
      state.copiedElement = _.omit(newEl, ["id"])
      // Pushing record to history
      state.history.undoStack.push({ type: "DELETE", id: newEl.id })
      if (state.history.undoStack.length > MAX_HISTORY_LENGTH) state.history.undoStack.pop()
      state.history.redoStack = []
    },
    duplicateElement: (state) => {
      const slide = state.presentation.slides[state.currentSlide]
      const element = slide.elements.find((el) => el.id === state.selectedId)!
      const duplicate = {
        ...element,
        // Again, we should always update ids to avoid collision
        id: nanoid(8),
        // Some difference in coordinates so element is not above another element
        x: element.x + COPIED_ELEMENT_X_DIF,
        y: element.y + COPIED_ELEMENT_Y_DIF,
      } as ElementProps
      slide.elements.push(duplicate)
      state.selectedId = duplicate.id
      // Redefining copiedElement so coordinates will not be the same when paste 2 and more elements
      state.copiedElement = _.omit(duplicate, ["id"])
      // Pushing record to history
      state.history.undoStack.push({ type: "DELETE", id: duplicate.id })
      if (state.history.undoStack.length > MAX_HISTORY_LENGTH) state.history.undoStack.pop()
      state.history.redoStack = []
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
      state.toolbar.shapeProps = {
        ...initialState.toolbar.shapeProps,
        type: state.toolbar.shapeProps.type,
      }
    },
    clear: (state) => {
      state.presentation = initialState.presentation
      state.history = initialState.history
      state.toolbar = initialState.toolbar
      state.currentSlide = initialState.currentSlide
      state.selectedId = initialState.selectedId
      state.isLoading = initialState.isLoading
      state.isCreating = initialState.isCreating
      state.isEditing = initialState.isEditing
    },
  },
})

export const {
  setPresentation,
  setName,
  setSlides,
  setConnectedUsers,
  changeConnectedUser,
  setCurrentSlide,
  setMode,
  setIsLoading,
  setIsCreating,
  setIsEditing,
  setIsSaving,
  addSlide,
  moveSlide,
  duplicateSlide,
  deleteSlide,
  applyHistory,
  setBackground,
  setTransition,
  setThumbnail,
  addElement,
  selectElement,
  editElement,
  deleteElement,
  copyElement,
  pasteElement,
  duplicateElement,
  changeTextProps,
  changeImageProps,
  changeShapeProps,
  resetToolbar,
  clear,
} = presentationSlice.actions
export const presentationReducer = presentationSlice.reducer
