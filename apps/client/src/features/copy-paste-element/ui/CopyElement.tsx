import { copyElement, generateEditElementId } from "~/entities/presentation"
import type { ChildrenAsCallbackWithFn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

export function useCopyElement() {
  const selectedId = useAppSelector((state) => state.presentation.selectedId)
  const dispatch = useAppDispatch()
  const { flush } = useDebouncedFunctions()

  return () => {
    flush(generateEditElementId(selectedId))
    dispatch(copyElement())
  }
}

export function CopyElement({ children }: ChildrenAsCallbackWithFn) {
  return children(useCopyElement())
}
