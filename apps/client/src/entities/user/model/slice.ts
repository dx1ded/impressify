import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { ConnectedUser } from "~/__generated__/graphql"
import { clear, setCurrentSlide } from "~/shared/model"

interface UserState {
  id: string | null
  connectedUsers: ConnectedUser[]
}

const initialState: UserState = {
  id: null,
  // Users that are subscribed to the presentation update (including yourself)
  connectedUsers: [],
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, { payload }: PayloadAction<string>) => {
      state.id = payload
    },
    setConnectedUsers: (state, { payload }: PayloadAction<ConnectedUser[]>) => {
      state.connectedUsers = payload
    },
    updateConnectedUser: (state, { payload }: PayloadAction<Partial<ConnectedUser>>) => {
      state.connectedUsers = state.connectedUsers.map((user) =>
        user.id === payload.id ? { ...user, ...payload } : user,
      )
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setCurrentSlide, (state, { payload }) => {
      state.connectedUsers = state.connectedUsers.map((user) =>
        user.id === state.id ? { ...user, currentSlideId: payload.id } : user,
      )
    })
    builder.addCase(clear, (state) => {
      state.connectedUsers = []
    })
  },
})

export const { setUserId, setConnectedUsers, updateConnectedUser } = userSlice.actions
export const userReducer = userSlice.reducer
