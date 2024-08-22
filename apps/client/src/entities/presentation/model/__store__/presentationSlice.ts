import _ from "lodash"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { nanoid } from "nanoid"

import {
  type Presentation,
  type SlideProps,
  type ElementProps,
  type AddElementPayload,
  type SlideId,
  type ElementId,
  type ImageEditProps,
  type ShapeEditProps,
  type TextEditProps,
  getSlideConfig,
  getTextConfig,
  getImageConfig,
  getShapeConfig,
  setTextProps,
  setImageProps,
  setShapeProps,
  addHistoryRecord,
  NOT_SELECTED,
  COPIED_ELEMENT_X_DIF,
  COPIED_ELEMENT_Y_DIF,
} from "~/entities/presentation"
import { Transition } from "~/__generated__/graphql"
import { setCurrentSlide, clear, createAsyncAppThunk } from "~/shared/model"

interface PresentationState {
  presentation: Presentation
  copiedElement: Omit<ElementProps, "id"> | null
  currentSlide: number
  selectedId: ElementId
  isLoading: boolean
  isCreating: boolean
  isEditing: boolean
  isSaving: boolean
  isSwitched: boolean
}

const initialState: PresentationState = {
  presentation: {
    id: "",
    name: "",
    slides: [],
  },
  copiedElement: null,
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
  /*
    This is only used for the subscription to avoid a bug when User_A synchronizes the state and while it's being processed User_B switches a slide
    ... and once User_A request gets fulfilled it switches the slide back for User_B corresponding the synchronized state (which we don't want to)
   */
  isSwitched: false,
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
    setElements: (state, { payload }: PayloadAction<ElementProps[]>) => {
      state.presentation.slides[state.currentSlide].elements = payload
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
    setIsSwitched: (state, { payload }: PayloadAction<boolean>) => {
      state.isSwitched = payload
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
    setSelectedId: (state, { payload }: PayloadAction<ElementId>) => {
      state.selectedId = payload
    },
    setCopiedElement: (state, { payload }: PayloadAction<PresentationState["copiedElement"]>) => {
      state.copiedElement = payload
    },
    copyElement: (state) => {
      const element = state.presentation.slides[state.currentSlide].elements.find((el) => el.id === state.selectedId)!
      // It's not going to break the code if I don't omit id because getConfig functions would redefine it. However, it's always better to make sure
      state.copiedElement = _.omit(element, ["id"])
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setCurrentSlide, (state, { payload }) => {
      state.currentSlide = payload.index
      state.isEditing = false
      state.isCreating = false
      state.isSwitched = true
      state.selectedId = NOT_SELECTED
    })

    builder.addCase(clear, (state) => {
      state.presentation = initialState.presentation
      state.currentSlide = initialState.currentSlide
      state.selectedId = initialState.selectedId
      state.isLoading = initialState.isLoading
      state.isCreating = initialState.isCreating
      state.isEditing = initialState.isEditing
    })
  },
})

export const addSlideThunk = createAsyncAppThunk("presentation/addSlideThunk", (_, { getState, dispatch }) => {
  const newSlides = [...getState().presentation.presentation.slides, getSlideConfig()]
  dispatch(setSlides(newSlides))
  dispatch(setCurrentSlide({ id: newSlides.at(-1)!.id, index: newSlides.length - 1 }))
})

export const moveSlideThunk = createAsyncAppThunk<void, { id: SlideId; newIndex: number }>(
  "presentation/moveSlideThunk",
  ({ id, newIndex }, { getState, dispatch }) => {
    const newSlides = [...getState().presentation.presentation.slides]
    const deleteIndex = newSlides.findIndex((slide) => slide.id === id)!
    const slideCopy = { ...newSlides[deleteIndex] }
    newSlides.splice(deleteIndex, 1)
    newSlides.splice(newIndex, 0, slideCopy)
    dispatch(setSlides(newSlides))
    dispatch(setCurrentSlide({ id: slideCopy.id, index: newIndex }))
  },
)

export const duplicateSlideThunk = createAsyncAppThunk<void, SlideId>(
  "presentation/duplicateSlideThunk",
  (slideId, { getState, dispatch }) => {
    const newSlides = [...getState().presentation.presentation.slides]
    const index = newSlides.findIndex((slide) => slide.id === slideId)!
    const slide = newSlides[index]
    const newSlide = {
      ...slide,
      // It is necessary to change slide id and its elements' ids to avoid collision
      id: nanoid(8),
      elements: slide.elements.map((el) => ({ ...el, id: nanoid(8) })),
    }
    newSlides.splice(index + 1, 0, newSlide)
    dispatch(setSlides(newSlides))
    dispatch(setCurrentSlide({ id: newSlide.id, index: index + 1 }))
  },
)

export const deleteSlideThunk = createAsyncAppThunk<void, SlideId>(
  "presentation/deleteSlideThunk",
  (slideId, { getState, dispatch }) => {
    const newSlides = [...getState().presentation.presentation.slides]
    if (newSlides.length === 1) return
    const indexToDelete = newSlides.findIndex((slide) => slide.id === slideId)
    let newIndex = indexToDelete
    if (newIndex === newSlides.length - 1) newIndex--
    newSlides.splice(indexToDelete, 1)
    dispatch(setCurrentSlide({ id: newSlides[newIndex].id, index: newIndex }))
    dispatch(setSlides(newSlides))
  },
)

export const selectElementThunk = createAsyncAppThunk<unknown, ElementId>(
  "presentation/selectElementThunk",
  (elementId, { getState, dispatch }) => {
    dispatch(setSelectedId(elementId))
    if (elementId === NOT_SELECTED) return
    // Changing toolbar with corresponding values to the element
    const state = getState()
    const selectedElement = state.presentation.presentation.slides[state.presentation.currentSlide].elements.find(
      (element) => element.id === elementId,
    )!
    switch (selectedElement.__typename) {
      case "Text":
        return dispatch(
          setTextProps(_.pick(selectedElement, Object.keys(state.toolbar.textProps) as (keyof TextEditProps)[])),
        )
      case "Image":
        return dispatch(
          setImageProps(_.pick(selectedElement, Object.keys(state.toolbar.imageProps) as (keyof ImageEditProps)[])),
        )
      case "Shape":
        return dispatch(
          setShapeProps(_.pick(selectedElement, Object.keys(state.toolbar.shapeProps) as (keyof ShapeEditProps)[])),
        )
    }
  },
)

export const addElementThunk = createAsyncAppThunk<void, AddElementPayload>(
  "presentation/addElementThunk",
  (elementProps, { getState, dispatch }) => {
    const state = getState()
    const slide = state.presentation.presentation.slides[state.presentation.currentSlide]
    const slideCopy = { ...slide, elements: [...slide.elements] }
    let newEl

    if (state.toolbar.mode === "text") {
      slideCopy.elements.push((newEl = getTextConfig({ ...state.toolbar.textProps, ...elementProps })))
    } else if (state.toolbar.mode === "image") {
      slideCopy.elements.push((newEl = getImageConfig({ ...state.toolbar.imageProps, ...elementProps })))
    } else if (state.toolbar.mode === "shape") {
      slideCopy.elements.push((newEl = getShapeConfig({ ...state.toolbar.shapeProps, ...elementProps })))
    }

    dispatch(setElements(slideCopy.elements))
    dispatch(selectElementThunk(newEl!.id))
    dispatch(addHistoryRecord({ type: "DELETE", id: newEl!.id }))
  },
)

export const editElementThunk = createAsyncAppThunk<void, Partial<ElementProps>>(
  "presentation/editElementThunk",
  (elementProps, { getState, dispatch }) => {
    const state = getState()
    const slide = state.presentation.presentation.slides[state.presentation.currentSlide]
    const element = slide.elements.find((element) => element.id === elementProps.id)
    if (!element) return
    dispatch(addHistoryRecord({ type: "EDIT", oldProps: _.pick(element, Object.keys(elementProps)) }))
    dispatch(
      setElements(
        slide.elements.map((element) =>
          element.id === elementProps.id ? ({ ...element, ...elementProps } as ElementProps) : element,
        ),
      ),
    )
  },
)

export const deleteElementThunk = createAsyncAppThunk(
  "presentation/deleteElementThunk",
  (_, { getState, dispatch }) => {
    const state = getState()
    const slide = state.presentation.presentation.slides[state.presentation.currentSlide]
    const index = slide.elements.findIndex((element) => element.id === state.presentation.selectedId)
    dispatch(addHistoryRecord({ type: "ADD", element: slide.elements[index], position: index }))
    dispatch(setElements(slide.elements.filter((element) => element.id !== state.presentation.selectedId)))
  },
)

export const pasteElementThunk = createAsyncAppThunk("presentation/pasteElementThunk", (_, { getState, dispatch }) => {
  const state = getState()
  const slide = state.presentation.presentation.slides[state.presentation.currentSlide]
  const { copiedElement } = state.presentation
  if (!copiedElement) return
  const newElement = {
    ...copiedElement,
    // Again, we should always update ids to avoid collision
    id: nanoid(8),
    // Some difference in coordinates so element is not above another element
    x: copiedElement.x + COPIED_ELEMENT_X_DIF,
    y: copiedElement.y + COPIED_ELEMENT_Y_DIF,
  } as ElementProps
  dispatch(setElements([...slide.elements, newElement]))
  dispatch(selectElementThunk(newElement.id))
  dispatch(addHistoryRecord({ type: "DELETE", id: newElement.id }))
})

export const duplicateElementThunk = createAsyncAppThunk(
  "presentation/duplicateElementThunk",
  (__, { getState, dispatch }) => {
    const state = getState()
    const slide = state.presentation.presentation.slides[state.presentation.currentSlide]
    const element = slide.elements.find((element) => element.id === state.presentation.selectedId)!
    const newElement = {
      ...element,
      // Again, we should always update ids to avoid collision
      id: nanoid(8),
      // Some difference in coordinates so element is not above another element
      x: element.x + COPIED_ELEMENT_X_DIF,
      y: element.y + COPIED_ELEMENT_Y_DIF,
    }
    dispatch(setElements([...slide.elements, newElement]))
    dispatch(selectElementThunk(newElement.id))
    // Redefining copiedElement so coordinates will not be the same when paste 2 and more elements
    dispatch(setCopiedElement(_.omit(newElement, ["id"])))
    dispatch(addHistoryRecord({ type: "DELETE", id: newElement.id }))
  },
)

export const {
  setPresentation,
  setName,
  setSlides,
  setElements,
  setIsLoading,
  setIsCreating,
  setIsEditing,
  setIsSaving,
  setIsSwitched,
  setBackground,
  setTransition,
  setThumbnail,
  setSelectedId,
  setCopiedElement,
  copyElement,
} = presentationSlice.actions
export const presentationReducer = presentationSlice.reducer
