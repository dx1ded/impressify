import { combineReducers } from "@reduxjs/toolkit"

import { presentationReducer, recentPresentationsReducer } from "~/entities/presentation"
import { userReducer } from "~/entities/user"

export const rootReducer = combineReducers({
  user: userReducer,
  presentation: presentationReducer,
  recentPresentations: recentPresentationsReducer,
})
