import { MenubarSeparator } from "@radix-ui/react-menubar"
import { ClipboardPaste, CopyIcon, RedoIcon, Trash2, UndoIcon } from "lucide-react"

import { CopyElement, PasteElement } from "~/features/copy-paste-element"
import { DeleteElement } from "~/features/delete-element"
import { DuplicateElement } from "~/features/duplicate-element"
import { HistoryRedo, HistoryUndo } from "~/features/history"
import { MenubarContent, MenubarItem, MenubarMenu, MenubarShortcut, MenubarTrigger } from "~/shared/ui-kit/menubar"

export function Edit() {
  return (
    <MenubarMenu>
      <MenubarTrigger className="px-2 py-0.5">Edit</MenubarTrigger>
      <MenubarContent>
        <HistoryUndo>
          {(undo) => (
            <MenubarItem onSelect={() => undo()}>
              <UndoIcon className="mr-2 h-5 w-5" />
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
          )}
        </HistoryUndo>
        <HistoryRedo>
          {(redo) => (
            <MenubarItem onSelect={() => redo()}>
              <RedoIcon className="mr-2 h-5 w-5" />
              Redo
              <MenubarShortcut>⌘Y</MenubarShortcut>
            </MenubarItem>
          )}
        </HistoryRedo>
        <MenubarSeparator />
        <CopyElement>
          {(copyElement) => (
            <MenubarItem onSelect={() => copyElement()}>
              <CopyIcon className="mr-2 h-5 w-5" />
              Copy
              <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
          )}
        </CopyElement>
        <PasteElement>
          {(pasteElement) => (
            <MenubarItem onSelect={() => pasteElement()}>
              <ClipboardPaste className="mr-2 h-5 w-5" />
              Paste
              <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          )}
        </PasteElement>
        <MenubarSeparator />
        <DeleteElement>
          {(deleteElement) => (
            <MenubarItem onSelect={() => deleteElement()}>
              <Trash2 className="mr-2 h-5 w-5" />
              Delete
            </MenubarItem>
          )}
        </DeleteElement>
        <DuplicateElement>
          {(duplicateElement) => (
            <MenubarItem onSelect={() => duplicateElement()}>
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
