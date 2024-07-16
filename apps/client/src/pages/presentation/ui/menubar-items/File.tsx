import { DownloadIcon, Files, Info, PencilLine, SquarePlus, Trash2, UserPlus } from "lucide-react"

import { DEFAULT_NAME } from "~/entities/presentation"
import { CreatePresentation } from "~/features/create-presentation"
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "~/shared/ui-kit/menubar"

export function File() {
  return (
    <MenubarMenu>
      <MenubarTrigger className="px-2 py-0.5">File</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger>
            <SquarePlus className="mr-2 h-5 w-5" />
            New
          </MenubarSubTrigger>
          <MenubarSubContent>
            <CreatePresentation>
              {(createPresentation) => (
                <MenubarItem onClick={() => createPresentation(DEFAULT_NAME)}>Presentation</MenubarItem>
              )}
            </CreatePresentation>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSub>
          <MenubarSubTrigger>
            <Files className="mr-2 h-5 w-5" />
            Make a copy
          </MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem>Current slide</MenubarItem>
            <MenubarItem>Entire presentation</MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem>
          <UserPlus className="mr-2 h-5 w-5" />
          Share
        </MenubarItem>
        <MenubarItem>
          <DownloadIcon className="mr-2 h-5 w-5" />
          Download
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <PencilLine className="mr-2 h-5 w-5" />
          Rename
        </MenubarItem>
        <MenubarItem>
          <Trash2 className="mr-2 h-5 w-5" />
          Move to trash
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <Info className="mr-2 h-5 w-5" />
          Details
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
