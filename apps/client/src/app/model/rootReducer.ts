import { combineReducers } from "@reduxjs/toolkit"

import {
  presentationReducer,
  recentPresentationsReducer,
  toolbarReducer,
  historyReducer,
} from "~/entities/presentation"
import { userReducer } from "~/entities/user"

export const rootReducer = combineReducers({
  user: userReducer,
  presentation: presentationReducer,
  recentPresentations: recentPresentationsReducer,
  toolbar: toolbarReducer,
  history: historyReducer,
})
