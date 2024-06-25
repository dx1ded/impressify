import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  userId: string | null
}

const initialState: UserState = {
  userId: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, { payload }: PayloadAction<string>) => {
      state.userId = payload
    },
  },
})

export const { setUserId } = userSlice.actions
export const userReducer = userSlice.reducer
