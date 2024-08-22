import _ from "lodash"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import {
  type HistoryRecord,
  type HistoryAction,
  type ElementProps,
  MAX_HISTORY_LENGTH,
  setElements,
} from "~/entities/presentation"
import { clear, setCurrentSlide, createAsyncAppThunk } from "~/shared/model"

interface HistoryState {
  undoStack: HistoryRecord[]
  redoStack: HistoryRecord[]
}

const initialState: HistoryState = {
  undoStack: [],
  redoStack: [],
}

const historySlice = createSlice({
  name: "presentation/history",
  initialState,
  reducers: {
    setUndoStack: (state, { payload }: PayloadAction<HistoryRecord[]>) => {
      state.undoStack = payload
    },
    setRedoStack: (state, { payload }: PayloadAction<HistoryRecord[]>) => {
      state.redoStack = payload
    },
    addHistoryRecord: (state, { payload }: PayloadAction<HistoryRecord>) => {
      state.undoStack.push(payload)
      if (state.undoStack.length > MAX_HISTORY_LENGTH) state.undoStack.pop()
      state.redoStack = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setCurrentSlide, (state) => {
      state.undoStack = initialState.undoStack
      state.redoStack = initialState.redoStack
    })
    builder.addCase(clear, (state) => {
      state.undoStack = initialState.undoStack
      state.redoStack = initialState.redoStack
    })
  },
})

export const applyHistoryStepThunk = createAsyncAppThunk<void, HistoryAction>(
  "history/applyHistoryStepThunk",
  async (payload, { getState, dispatch }) => {
    const state = getState()
    const stack = payload === "UNDO" ? state.history.undoStack : state.history.redoStack
    const invertedStack = payload === "UNDO" ? [...state.history.redoStack] : [...state.history.undoStack]
    const setStack = payload === "UNDO" ? setUndoStack : setRedoStack
    const setInvertedStack = payload === "UNDO" ? setRedoStack : setUndoStack
    const record = stack.at(-1)

    if (!record) return

    dispatch(setStack(stack.filter((_, index) => index !== stack.length - 1)))
    const slide = state.presentation.presentation.slides[state.presentation.currentSlide]
    let newElements = [...slide.elements]

    switch (record.type) {
      case "ADD": {
        invertedStack.push({ type: "DELETE", id: record.element.id })
        newElements.splice(record.position, 0, record.element)
        break
      }
      case "EDIT": {
        invertedStack.push({
          type: "EDIT",
          oldProps: _.pick(slide.elements.find((el) => el.id === record.oldProps.id)!, Object.keys(record.oldProps)),
        })
        newElements = newElements.map((element) =>
          element.id === record.oldProps.id ? { ...element, ...record.oldProps } : element,
        ) as ElementProps[]
        break
      }
      case "DELETE": {
        const index = slide.elements.findIndex((el) => el.id === record.id)
        invertedStack.push({ type: "ADD", element: slide.elements[index], position: index })
        newElements = newElements.filter((element) => element.id !== record.id)
        break
      }
    }

    dispatch(setInvertedStack(invertedStack))
    dispatch(setElements(newElements))
  },
)

export const { setUndoStack, setRedoStack, addHistoryRecord } = historySlice.actions
export const historyReducer = historySlice.reducer
