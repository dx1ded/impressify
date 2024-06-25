import { combineReducers } from "@reduxjs/toolkit"

import { presentationReducer } from "~/entities/presentation"
import { userReducer } from "~/entities/user"

export const rootReducer = combineReducers({
  presentation: presentationReducer,
  user: userReducer,
})
