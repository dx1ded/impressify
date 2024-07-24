import { MenubarSeparator } from "@radix-ui/react-menubar"
import { ClipboardPaste, Copy, CopyIcon, RedoIcon, Trash2, UndoIcon } from "lucide-react"

import {
  generateEditElementId,
  applyHistory,
  copyElement,
  deleteElement,
  duplicateElement,
  pasteElement,
  TAKE_SCREENSHOT_ID,
} from "~/entities/presentation"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"
import { MenubarContent, MenubarItem, MenubarMenu, MenubarShortcut, MenubarTrigger } from "~/shared/ui-kit/menubar"

export function Edit() {
  const selectedId = useAppSelector((state) => state.presentation.selectedId)
  const dispatch = useAppDispatch()
  const { call, flush, deleteDebounced } = useDebouncedFunctions()

  const EDIT_SELECTED_ELEMENT_ID = generateEditElementId(selectedId)

  return (
    <MenubarMenu>
      <MenubarTrigger className="px-2 py-0.5">Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem
          onClick={() => {
            flush(EDIT_SELECTED_ELEMENT_ID)
            dispatch(applyHistory("UNDO"))
            call(TAKE_SCREENSHOT_ID)
          }}>
          <UndoIcon className="mr-2 h-5 w-5" />
          Undo
          <MenubarShortcut>⌘Z</MenubarShortcut>
        </MenubarItem>
        <MenubarItem
          onClick={() => {
            flush(EDIT_SELECTED_ELEMENT_ID)
            dispatch(applyHistory("REDO"))
            call(TAKE_SCREENSHOT_ID)
          }}>
          <RedoIcon className="mr-2 h-5 w-5" />
          Redo
          <MenubarShortcut>⌘Y</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem
          onClick={() => {
            flush(EDIT_SELECTED_ELEMENT_ID)
            dispatch(copyElement())
          }}>
          <CopyIcon className="mr-2 h-5 w-5" />
          Copy
          <MenubarShortcut>⌘C</MenubarShortcut>
        </MenubarItem>
        <MenubarItem
          onClick={() => {
            flush(EDIT_SELECTED_ELEMENT_ID)
            dispatch(pasteElement())
            call(TAKE_SCREENSHOT_ID)
          }}>
          <ClipboardPaste className="mr-2 h-5 w-5" />
          Paste
          <MenubarShortcut>⌘V</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem
          onClick={() => {
            deleteDebounced(EDIT_SELECTED_ELEMENT_ID)
            dispatch(deleteElement())
            call(TAKE_SCREENSHOT_ID)
          }}>
          <Trash2 className="mr-2 h-5 w-5" />
          Delete
        </MenubarItem>
        <MenubarItem
          onClick={() => {
            flush(EDIT_SELECTED_ELEMENT_ID)
            dispatch(duplicateElement())
            call(TAKE_SCREENSHOT_ID)
          }}>
          <Copy className="mr-2 h-5 w-5" />
          Duplicate
          <MenubarShortcut>⌘O</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
