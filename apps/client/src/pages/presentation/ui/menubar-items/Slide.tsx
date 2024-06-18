import { ArrowLeftRightIcon, Copy, DropletIcon, Plus, Trash2 } from "lucide-react"

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "~/shared/ui-kit/menubar"

export function Slide() {
  return (
    <MenubarMenu>
      <MenubarTrigger className="px-2 py-0.5">Slide</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <Plus className="mr-2 h-5 w-5" />
          New slide
          <MenubarShortcut>Ctrl+M</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>
          <Copy className="mr-2 h-5 w-5" />
          Duplicate slide
        </MenubarItem>
        <MenubarItem>
          <Trash2 className="mr-2 h-5 w-5" />
          Delete slide
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <DropletIcon className="mr-2 h-5 w-5" />
          Change background
        </MenubarItem>
        <MenubarItem>
          <ArrowLeftRightIcon className="mr-2 h-5 w-5" />
          Transition
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
