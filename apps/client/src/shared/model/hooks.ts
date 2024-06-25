import { useDispatch, type TypedUseSelectorHook, useSelector } from "react-redux"

import type { AppDispatch, AppStore } from "~/app/model"

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppStore> = useSelector
