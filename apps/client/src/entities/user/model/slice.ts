import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UserAwareness } from "@server/hocuspocus/types"

import { clear } from "~/shared/model"

interface UserState {
  id: string | null
  token: string | null
  connectedUsers: UserAwareness[]
  isEditor: boolean
  isCreator: boolean
}

const initialState: UserState = {
  id: null,
  token: null,
  // Users that are subscribed to the presentation update (including yourself)
  connectedUsers: [],
  // Is user editor (if not they can't modify presentation)
  isEditor: false,
  // Is user creator (if not they can't delete presentation)
  isCreator: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<Pick<UserState, "id" | "token">>) => {
      state.id = payload.id
      state.token = payload.token
    },
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
      state.connectedUsers = []
    })
  },
})

export const { setUser, setConnectedUsers, setIsEditor, setIsCreator } = userSlice.actions
export const userReducer = userSlice.reducer
