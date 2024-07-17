import { MenubarSeparator } from "@radix-ui/react-menubar"
import { ClipboardPaste, Copy, CopyIcon, RedoIcon, Scissors, Trash2, UndoIcon } from "lucide-react"

import { MenubarContent, MenubarItem, MenubarMenu, MenubarShortcut, MenubarTrigger } from "~/shared/ui-kit/menubar"

export function Edit() {
  return (
    <MenubarMenu>
      <MenubarTrigger className="px-2 py-0.5">Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <UndoIcon className="mr-2 h-5 w-5" />
          Undo
          <MenubarShortcut>⌘Z</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>
          <RedoIcon className="mr-2 h-5 w-5" />
          Redo
          <MenubarShortcut>⌘Y</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <Scissors className="mr-2 h-5 w-5" />
          Cut
          <MenubarShortcut>⌘X</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>
          <CopyIcon className="mr-2 h-5 w-5" />
          Copy
          <MenubarShortcut>⌘C</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>
          <ClipboardPaste className="mr-2 h-5 w-5" />
          Paste
          <MenubarShortcut>⌘V</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <Trash2 className="mr-2 h-5 w-5" />
          Delete
        </MenubarItem>
        <MenubarItem>
          <Copy className="mr-2 h-5 w-5" />
          Duplicate
          <MenubarShortcut>⌘O</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
