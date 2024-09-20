import { createAction } from "@reduxjs/toolkit"

// The difference between `switchCurrentSlide` and `setCurrentSlide` is that first propagates cases in other reducers (cleaning history, toolbar, etc)
export const switchCurrentSlide = createAction<number>("presentation/switchCurrentSlide")
export const clear = createAction("clear")
