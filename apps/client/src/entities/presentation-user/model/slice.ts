import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UserAwareness } from "@server/hocuspocus/types"

import { clear } from "~/shared/model"

interface UserState {
  connectedUsers: UserAwareness[]
  isEditor: boolean
  isCreator: boolean
}

const initialState: UserState = {
  // Users that are connected to presentation (including yourself)
  connectedUsers: [],
  // Is user editor (if not they can't modify presentation)
  isEditor: false,
  // Is user creator (if not they can't delete presentation)
  isCreator: false,
}

const userSlice = createSlice({
  name: "presentationUser",
  initialState,
  reducers: {
    setConnectedUsers: (state, { payload }: PayloadAction<UserAwareness[]>) => {
      state.connectedUsers = payload
    },
    setIsEditor: (state, { payload }: PayloadAction<boolean>) => {
      state.isEditor = payload
    },
    setIsCreator: (state, { payload }: PayloadAction<boolean>) => {
      state.isCreator = payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clear, (state) => {
      state.connectedUsers = initialState.connectedUsers
      state.isEditor = initialState.isEditor
      state.isCreator = initialState.isCreator
    })
  },
})

export const { setConnectedUsers, setIsEditor, setIsCreator } = userSlice.actions
export const presentationUserReducer = userSlice.reducer
