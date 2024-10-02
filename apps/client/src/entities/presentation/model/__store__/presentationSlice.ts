import _ from "lodash"
import { diff as deepDiff } from "deep-diff"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { NormalizedYPresentation } from "@server/hocuspocus/types"
import { nanoid } from "nanoid"

import type { AppDispatch, AppStore } from "~/app/model"
import {
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
  setMode,
  resetToolbarElementProps,
  NOT_SELECTED,
  COPIED_ELEMENT_X_DIF,
  COPIED_ELEMENT_Y_DIF,
} from "~/entities/presentation"
import { Transition } from "~/__generated__/graphql"
import { switchCurrentSlide, clear } from "~/shared/model"

interface PresentationState {
  presentation: NormalizedYPresentation
  copiedElement: Omit<ElementProps, "id"> | null
  currentSlide: number
  selectedId: ElementId
  isLoading: boolean
  isCreating: boolean
  isEditing: boolean
  isSaving: boolean
  isSlideshow: boolean
}

const initialState: PresentationState = {
  presentation: {
    id: "",
    name: "",
    slides: [],
    users: [],
    template: undefined,
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
  // is slideshow turned on
  isSlideshow: false,
}

const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    setPresentation: (state, { payload }: PayloadAction<NormalizedYPresentation>) => {
      state.presentation = payload
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
    setIsSlideshow: (state, { payload }: PayloadAction<boolean>) => {
      state.isSlideshow = payload
    },
    setName: (state, { payload }: PayloadAction<string>) => {
      state.presentation.name = payload
    },
    setCurrentSlide: (state, { payload }: PayloadAction<number>) => {
      state.currentSlide = payload
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
    builder.addCase(switchCurrentSlide, (state, { payload }) => {
      state.currentSlide = payload
      state.isEditing = false
      state.isCreating = false
      state.selectedId = NOT_SELECTED
    })

    builder.addCase(clear, (state) => {
      state.presentation = initialState.presentation
      state.currentSlide = initialState.currentSlide
      state.selectedId = initialState.selectedId
      state.isLoading = initialState.isLoading
      state.isCreating = initialState.isCreating
      state.isEditing = initialState.isEditing
      state.isSaving = initialState.isSaving
    })
  },
})

export const addSlide = () => (dispatch: AppDispatch, getState: () => AppStore) => {
  const { presentation } = getState().presentation
  const newSlide = getSlideConfig(presentation.template)
  const newSlides = [...presentation.slides, newSlide]
  dispatch(setSlides(newSlides))
  dispatch(switchCurrentSlide(newSlides.length - 1))
  return newSlide
}

export const moveSlide =
  ({ id, newIndex }: { id: SlideId; newIndex: number }) =>
  (dispatch: AppDispatch, getState: () => AppStore) => {
    const newSlides = [...getState().presentation.presentation.slides]
    const deleteIndex = newSlides.findIndex((slide) => slide.id === id)!
    const slideCopy = { ...newSlides[deleteIndex] }
    newSlides.splice(deleteIndex, 1)
    newSlides.splice(newIndex, 0, slideCopy)
    dispatch(setSlides(newSlides))
    dispatch(setCurrentSlide(newIndex))

    return { deleteIndex, newIndex }
  }

export const duplicateSlide =
  (slideId: SlideId, thumbnailUrl?: string) => (dispatch: AppDispatch, getState: () => AppStore) => {
    const newSlides = [...getState().presentation.presentation.slides]
    const index = newSlides.findIndex((slide) => slide.id === slideId)!
    const slide = newSlides[index]
    const newSlide = {
      ...slide,
      // If custom `thumbnailUrl` provided use that one
      ...(thumbnailUrl ? { thumbnailUrl } : {}),
      // It is necessary to change slide id and its elements' ids to avoid collision
      id: nanoid(8),
      elements: slide.elements.map((el) => ({ ...el, id: nanoid(8) })),
    }
    const newIndex = index + 1
    newSlides.splice(newIndex, 0, newSlide)
    dispatch(setSlides(newSlides))
    dispatch(switchCurrentSlide(newIndex))

    return { newSlide, newIndex }
  }

export const deleteSlide = (slideId: SlideId) => (dispatch: AppDispatch, getState: () => AppStore) => {
  const state = getState()
  const newSlides = [...state.presentation.presentation.slides]
  const { currentSlide } = state.presentation
  if (newSlides.length === 1) return
  const indexToDelete = newSlides.findIndex((slide) => slide.id === slideId)
  newSlides.splice(indexToDelete, 1)
  const newIndex = currentSlide === newSlides.length ? newSlides.length - 1 : currentSlide
  if (newIndex !== currentSlide) dispatch(switchCurrentSlide(newIndex))
  dispatch(setSlides(newSlides))

  return newSlides[newIndex].id
}

export const selectElement = (elementId: ElementId) => (dispatch: AppDispatch, getState: () => AppStore) => {
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
}

export const addElement = (elementProps: AddElementPayload) => (dispatch: AppDispatch, getState: () => AppStore) => {
  const state = getState()
  const slide = state.presentation.presentation.slides[state.presentation.currentSlide]
  const slideCopy = { ...slide, elements: [...slide.elements] }
  let newElement: ElementProps | undefined

  if (state.toolbar.mode === "text") {
    slideCopy.elements.push((newElement = getTextConfig({ ...state.toolbar.textProps, ...elementProps })))
  } else if (state.toolbar.mode === "image") {
    slideCopy.elements.push((newElement = getImageConfig({ ...state.toolbar.imageProps, ...elementProps })))
  } else if (state.toolbar.mode === "shape") {
    slideCopy.elements.push((newElement = getShapeConfig({ ...state.toolbar.shapeProps, ...elementProps })))
  }

  if (!newElement) throw new Error("No new element was added")

  dispatch(setElements(slideCopy.elements))
  dispatch(selectElement(newElement.id))
  dispatch(addHistoryRecord({ type: "DELETE", id: newElement.id }))

  return { ...newElement }
}

export const editElement =
  (elementProps: Partial<ElementProps>) => (dispatch: AppDispatch, getState: () => AppStore) => {
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
  }

export const deleteElement = () => (dispatch: AppDispatch, getState: () => AppStore) => {
  const state = getState()
  const { selectedId } = state.presentation
  if (selectedId === NOT_SELECTED) return
  const slide = state.presentation.presentation.slides[state.presentation.currentSlide]
  const index = slide.elements.findIndex((element) => element.id === selectedId)
  if (index === -1) return
  dispatch(addHistoryRecord({ type: "ADD", element: slide.elements[index], position: index }))
  dispatch(setElements(slide.elements.filter((element) => element.id !== selectedId)))

  // Resetting toolbar
  if (!state.presentation.isCreating) {
    dispatch(setMode("cursor"))
    dispatch(resetToolbarElementProps())
  }

  return index
}

export const pasteElement = () => (dispatch: AppDispatch, getState: () => AppStore) => {
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
  dispatch(selectElement(newElement.id))
  dispatch(addHistoryRecord({ type: "DELETE", id: newElement.id }))

  return newElement
}

export const duplicateElement = () => (dispatch: AppDispatch, getState: () => AppStore) => {
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
  dispatch(selectElement(newElement.id))
  // Redefining copiedElement so coordinates will not be the same when paste 2 and more elements
  dispatch(setCopiedElement(_.omit(newElement, ["id"])))
  dispatch(addHistoryRecord({ type: "DELETE", id: newElement.id }))

  return newElement
}

export const updatePresentation =
  (updatedPresentation: NormalizedYPresentation) => (dispatch: AppDispatch, getState: () => AppStore) => {
    const state = getState()
    const currentPresentation = state.presentation.presentation

    // Doing deep comparison to avoid presentation update when other properties (not `presentation`) got updated in yjs
    const presentationDifferences = deepDiff(currentPresentation, updatedPresentation)
    if (!presentationDifferences) return

    // We do deep comparison for element props only. Additionally, it only applies for current slide (other slides just apply new elements array)
    const currentSlide = currentPresentation.slides[state.presentation.currentSlide]
    const updatedSlide = updatedPresentation.slides.find((_slide) => _slide.id === currentSlide.id)
    if (updatedSlide) {
      // Only check for differences in element properties
      const elementDifferences = deepDiff({ elements: currentSlide.elements }, { elements: updatedSlide.elements })
      if (elementDifferences) {
        const toolbarChanges: { [key: string]: any } = {}
        elementDifferences.forEach((change) => {
          if (change.kind === "E" && change.path?.[0] === "elements") {
            // Update the specific element property based on the deep diff
            _.set(
              updatedPresentation.slides[
                updatedPresentation.slides.findIndex((_slide) => _slide.id === updatedSlide.id)
              ],
              change.path,
              change.rhs,
            )

            toolbarChanges[change.path.at(-1)] = change.rhs
          }
        })

        // Updating toolbar (if applicable)
        const { selectedId } = state.presentation
        const selectedElement = updatedSlide.elements.find((_element) => _element.id === selectedId)
        if (selectedId !== NOT_SELECTED && selectedElement) {
          const setToolbarProps =
            selectedElement.__typename === "Text"
              ? setTextProps
              : selectedElement.__typename === "Image"
                ? setImageProps
                : setShapeProps

          dispatch(setToolbarProps(toolbarChanges))
        }
      }
    }

    // Dispatch the final updated presentation
    dispatch(setPresentation(updatedPresentation))
  }

export const {
  setPresentation,
  setSlides,
  setElements,
  setIsLoading,
  setIsCreating,
  setIsEditing,
  setIsSaving,
  setIsSlideshow,
  setName,
  setCurrentSlide,
  setBackground,
  setTransition,
  setThumbnail,
  setSelectedId,
  setCopiedElement,
  copyElement,
} = presentationSlice.actions
export const presentationReducer = presentationSlice.reducer
