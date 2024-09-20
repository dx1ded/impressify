import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { Alignment, ShapeType } from "~/__generated__/graphql"
import type { AppDispatch, AppStore } from "~/app/model"
import {
  type Mode,
  type ImageEditProps,
  type ShapeEditProps,
  type TextEditProps,
  editElement,
  DEFAULT_BORDER_COLOR,
  DEFAULT_FILL_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_STROKE_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_TEXT_COLOR,
} from "~/entities/presentation"
import { clear, switchCurrentSlide } from "~/shared/model"

interface ToolbarState {
  mode: Mode
  textProps: TextEditProps
  imageProps: ImageEditProps
  shapeProps: ShapeEditProps
}

const initialState: ToolbarState = {
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
}

const toolbarSlice = createSlice({
  name: "toolbar",
  initialState,
  reducers: {
    setMode: (state, { payload }: PayloadAction<Mode>) => {
      state.mode = payload
    },
    setTextProps: (state, { payload }: PayloadAction<Partial<TextEditProps>>) => {
      state.textProps = { ...state.textProps, ...payload }
    },
    setImageProps: (state, { payload }: PayloadAction<Partial<ImageEditProps>>) => {
      state.imageProps = { ...state.imageProps, ...payload }
    },
    setShapeProps: (state, { payload }: PayloadAction<Partial<ShapeEditProps>>) => {
      state.shapeProps = { ...state.shapeProps, ...payload }
    },
    resetToolbarElementProps: (state) => {
      state.textProps = initialState.textProps
      state.imageProps = initialState.imageProps
      state.shapeProps = {
        ...initialState.shapeProps,
        type: state.shapeProps.type,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(switchCurrentSlide, (state) => {
      state.mode = initialState.mode
      state.textProps = initialState.textProps
      state.imageProps = initialState.imageProps
      state.shapeProps = initialState.shapeProps
    })
    builder.addCase(clear, (state) => {
      state.mode = initialState.mode
      state.textProps = initialState.textProps
      state.imageProps = initialState.imageProps
      state.shapeProps = initialState.shapeProps
    })
  },
})

export const updateTextProps =
  (textProps: Partial<TextEditProps>) => (dispatch: AppDispatch, getState: () => AppStore) => {
    dispatch(setTextProps(textProps))
    dispatch(editElement({ ...textProps, id: getState().presentation.selectedId }))
  }

export const updateImageProps =
  (imageProps: Partial<ImageEditProps>) => (dispatch: AppDispatch, getState: () => AppStore) => {
    dispatch(setImageProps(imageProps))
    dispatch(editElement({ ...imageProps, id: getState().presentation.selectedId }))
  }

export const updateShapeProps =
  (shapeProps: Partial<ShapeEditProps>) => (dispatch: AppDispatch, getState: () => AppStore) => {
    dispatch(setShapeProps(shapeProps))
    dispatch(editElement({ ...shapeProps, id: getState().presentation.selectedId }))
  }

export const { setMode, resetToolbarElementProps, setTextProps, setImageProps, setShapeProps } = toolbarSlice.actions
export const toolbarReducer = toolbarSlice.reducer
