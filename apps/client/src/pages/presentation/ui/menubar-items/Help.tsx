import { CircleHelpIcon, KeyboardIcon } from "lucide-react"

import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "~/shared/ui-kit/menubar"

export function Help() {
  return (
    <MenubarMenu>
      <MenubarTrigger className="px-2 py-0.5">Help</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <CircleHelpIcon className="mr-2 h-5 w-5" />
          Help
        </MenubarItem>
        <MenubarItem>
          <KeyboardIcon className="mr-2 h-5 w-5" />
          Keyboard shortcuts
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
