import { MenubarSeparator } from "@radix-ui/react-menubar"
import { ClipboardPaste, CopyIcon, RedoIcon, Trash2, UndoIcon } from "lucide-react"
import { shallowEqual } from "react-redux"

import { CopyElement, PasteElement } from "~/features/copy-paste-element"
import { RedoHistory, UndoHistory } from "~/features/apply-history"
import { DeleteElement } from "~/features/delete-element"
import { DuplicateElement } from "~/features/duplicate-element"
import { useAppSelector } from "~/shared/model"
import { MenubarContent, MenubarItem, MenubarMenu, MenubarShortcut, MenubarTrigger } from "~/shared/ui-kit/menubar"

export function Edit() {
  const { isEditor, isLoading } = useAppSelector(
    (state) => ({
      isEditor: state.presentationUser.isEditor,
      isLoading: state.presentation.isLoading,
    }),
    shallowEqual,
  )

  return (
    <MenubarMenu>
      <MenubarTrigger className="px-2 py-0.5">Edit</MenubarTrigger>
      <MenubarContent>
        <UndoHistory>
          {(undo) => (
            <MenubarItem disabled={!isEditor || isLoading} onSelect={() => undo()}>
              <UndoIcon className="mr-2 h-5 w-5" />
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
          )}
        </UndoHistory>
        <RedoHistory>
          {(redo) => (
            <MenubarItem disabled={!isEditor || isLoading} onSelect={() => redo()}>
              <RedoIcon className="mr-2 h-5 w-5" />
              Redo
              <MenubarShortcut>⌘Y</MenubarShortcut>
            </MenubarItem>
          )}
        </RedoHistory>
        <MenubarSeparator />
        <CopyElement>
          {(copyElement) => (
            <MenubarItem disabled={!isEditor || isLoading} onSelect={() => copyElement()}>
              <CopyIcon className="mr-2 h-5 w-5" />
              Copy
              <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
          )}
        </CopyElement>
        <PasteElement>
          {(pasteElement) => (
            <MenubarItem disabled={!isEditor || isLoading} onSelect={() => pasteElement()}>
              <ClipboardPaste className="mr-2 h-5 w-5" />
              Paste
              <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          )}
        </PasteElement>
        <MenubarSeparator />
        <DeleteElement>
          {(deleteElement) => (
            <MenubarItem disabled={!isEditor || isLoading} onSelect={() => deleteElement()}>
              <Trash2 className="mr-2 h-5 w-5" />
              Delete
            </MenubarItem>
          )}
        </DeleteElement>
        <DuplicateElement>
          {(duplicateElement) => (
            <MenubarItem disabled={!isEditor || isLoading} onSelect={() => duplicateElement()}>
              <CopyIcon className="mr-2 h-5 w-5" />
              Duplicate
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
          )}
        </DuplicateElement>
      </MenubarContent>
    </MenubarMenu>
  )
}
