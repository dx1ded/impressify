import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UserAwareness } from "@server/hocuspocus/types"

import { clear } from "~/shared/model"

interface UserState {
  id: string | null
  token: string | null
  connectedUsers: UserAwareness[]
}

const initialState: UserState = {
  id: null,
  token: null,
  // Users that are subscribed to the presentation update (including yourself)
  connectedUsers: [],
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
  },
  extraReducers: (builder) => {
    builder.addCase(clear, (state) => {
      state.connectedUsers = []
    })
  },
})

export const { setUser, setConnectedUsers } = userSlice.actions
export const userReducer = userSlice.reducer
