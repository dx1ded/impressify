import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  id: string | null
  token: string | null
}

const initialState: UserState = {
  id: null,
  token: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<Pick<UserState, "id" | "token">>) => {
      state.id = payload.id
      state.token = payload.token
    },
  },
})

export const { setUser } = userSlice.actions
export const userReducer = userSlice.reducer
