import { combineReducers } from "@reduxjs/toolkit"

import { presentationReducer } from "~/entities/presentation"

export const rootReducer = combineReducers({
  presentation: presentationReducer,
})
