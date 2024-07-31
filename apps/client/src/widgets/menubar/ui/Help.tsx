import { CircleHelpIcon, KeyboardIcon } from "lucide-react"

import { GetHelpDialog } from "~/features/get-help"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui-kit/dialog"
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "~/shared/ui-kit/menubar"
import { Shortcut } from "~/shared/ui/Shortcut"
import { Small } from "~/shared/ui/Typography"

export function Help() {
  return (
    <MenubarMenu>
      <MenubarTrigger className="px-2 py-0.5">Help</MenubarTrigger>
      <MenubarContent>
        <GetHelpDialog>
          {/* e.preventDefault because MenubarItem has custom behaviour */}
          <MenubarItem onSelect={(e) => e.preventDefault()}>
            <CircleHelpIcon className="mr-2 h-5 w-5" />
            Help
          </MenubarItem>
        </GetHelpDialog>
        {/* e.preventDefault because MenubarItem has custom behaviour */}
        <Dialog>
          <DialogTrigger asChild>
            <MenubarItem onSelect={(e) => e.preventDefault()}>
              <KeyboardIcon className="mr-2 h-5 w-5" />
              Keyboard shortcuts
            </MenubarItem>
          </DialogTrigger>
          <DialogContent className="max-h-[25rem] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Shortcuts</DialogTitle>
              <DialogDescription hidden>Keyboard shortcuts which you can use in your presentation</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <div className="flex items-center justify-between border-gray-100 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-2">
                <Small>Undo</Small>
                <Shortcut keys={["⌘", "Z"]} />
              </div>
              <div className="flex items-center justify-between border-gray-100  [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-2">
                <Small>Redo</Small>
                <Shortcut keys={["⌘", "Y"]} />
              </div>
              <div className="flex items-center justify-between border-gray-100  [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-2">
                <Small>Copy</Small>
                <Shortcut keys={["⌘", "C"]} />
              </div>
              <div className="flex items-center justify-between border-gray-100 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-2">
                <Small>Paste</Small>
                <Shortcut keys={["⌘", "V"]} />
              </div>
              <div className="flex items-center justify-between border-gray-100 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-2">
                <Small>Delete element</Small>
                <Shortcut keys={["Backspace"]} />
              </div>
              <div className="flex items-center justify-between border-gray-100 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-2">
                <Small>New slide</Small>
                <Shortcut keys={["Ctrl", "M"]} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </MenubarContent>
    </MenubarMenu>
  )
}
