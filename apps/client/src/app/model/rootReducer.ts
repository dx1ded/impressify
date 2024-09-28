import { combineReducers } from "@reduxjs/toolkit"

import {
  presentationReducer,
  recentPresentationsReducer,
  toolbarReducer,
  historyReducer,
} from "~/entities/presentation"
import { userReducer } from "~/entities/user"
import { presentationUserReducer } from "~/entities/presentation-user"

export const rootReducer = combineReducers({
  user: userReducer,
  presentation: presentationReducer,
  presentationUser: presentationUserReducer,
  recentPresentations: recentPresentationsReducer,
  toolbar: toolbarReducer,
  history: historyReducer,
})
