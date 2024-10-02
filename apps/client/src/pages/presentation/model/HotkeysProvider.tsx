import { type ReactNode, memo, useEffect } from "react"
import { shallowEqual } from "react-redux"

import { useAddSlide } from "~/features/add-slide"
import { useRedoHistory, useUndoHistory } from "~/features/apply-history"
import { useCopyElement, usePasteElement } from "~/features/copy-paste-element"
import { useDeleteElement } from "~/features/delete-element"
import { useDuplicateElement } from "~/features/duplicate-element"
import { useAppSelector, useStableCallback } from "~/shared/model"

export const HotkeysProvider = memo<{ children: ReactNode }>(function HotkeyProvider({ children }) {
  const { isEditing, isSlideshow, isEditor } = useAppSelector(
    (state) => ({
      isEditing: state.presentation.isEditing,
      isSlideshow: state.presentation.isSlideshow,
      isEditor: state.presentationUser.isEditor,
    }),
    shallowEqual,
  )
  const undoHistory = useStableCallback(useUndoHistory())
  const redoHistory = useStableCallback(useRedoHistory())
  const copyElement = useStableCallback(useCopyElement())
  const pasteElement = useStableCallback(usePasteElement())
  const deleteElement = useStableCallback(useDeleteElement())
  const duplicateElement = useStableCallback(useDuplicateElement())
  const addSlide = useStableCallback(useAddSlide())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing || isSlideshow || !isEditor) return

      const key = e.key.toLowerCase()
      const isCtrlOrCmd = e.ctrlKey || e.metaKey

      if (key === "backspace") deleteElement()
      else if (isCtrlOrCmd && key === "z") undoHistory()
      else if (isCtrlOrCmd && key === "y") redoHistory()
      else if (isCtrlOrCmd && key === "c") copyElement()
      else if (isCtrlOrCmd && key === "v") pasteElement()
      else if (isCtrlOrCmd && key === "o") duplicateElement()
      else if (e.ctrlKey && key === "m") addSlide()
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    isSlideshow,
    isEditor,
    isEditing,
    addSlide,
    copyElement,
    deleteElement,
    duplicateElement,
    pasteElement,
    redoHistory,
    undoHistory,
  ])

  return children
})
