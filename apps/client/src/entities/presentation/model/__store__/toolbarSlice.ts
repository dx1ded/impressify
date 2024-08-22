import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { Alignment, ShapeType } from "~/__generated__/graphql"
import {
  type Mode,
  type ImageEditProps,
  type ShapeEditProps,
  type TextEditProps,
  editElementThunk,
  DEFAULT_BORDER_COLOR,
  DEFAULT_FILL_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_STROKE_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_TEXT_COLOR,
} from "~/entities/presentation"
import { clear, createAsyncAppThunk, setCurrentSlide } from "~/shared/model"

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
    builder.addCase(setCurrentSlide, (state) => {
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

export const updateTextPropsThunk = createAsyncAppThunk<void, Partial<TextEditProps>>(
  "toolbar/updateTextProps",
  (textProps, { getState, dispatch }) => {
    dispatch(setTextProps(textProps))
    dispatch(editElementThunk({ ...textProps, id: getState().presentation.selectedId }))
  },
)

export const updateImagePropsThunk = createAsyncAppThunk<void, Partial<ImageEditProps>>(
  "toolbar/updateImageProps",
  (imageProps, { getState, dispatch }) => {
    dispatch(setImageProps(imageProps))
    dispatch(editElementThunk({ ...imageProps, id: getState().presentation.selectedId }))
  },
)

export const updateShapePropsThunk = createAsyncAppThunk<void, Partial<ShapeEditProps>>(
  "toolbar/updateShapeProps",
  (shapeProps, { getState, dispatch }) => {
    dispatch(setShapeProps(shapeProps))
    dispatch(editElementThunk({ ...shapeProps, id: getState().presentation.selectedId }))
  },
)

export const { setMode, resetToolbarElementProps, setTextProps, setImageProps, setShapeProps } = toolbarSlice.actions
export const toolbarReducer = toolbarSlice.reducer
