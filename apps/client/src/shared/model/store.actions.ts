import { createAction } from "@reduxjs/toolkit"

import type { SlideId } from "~/entities/presentation"

export const setCurrentSlide = createAction<{ id: SlideId; index: number }>("presentation/setCurrentSlide")
export const clear = createAction("clear")
