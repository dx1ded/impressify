import { configureStore } from "@reduxjs/toolkit"

import { rootReducer } from "~/app/model/rootReducer"

export const store = configureStore({
  reducer: rootReducer,
})

export type AppStore = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
