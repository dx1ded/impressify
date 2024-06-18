import { Edit } from "~/pages/presentation/ui/menubar-items/Edit"
import { File } from "~/pages/presentation/ui/menubar-items/File"
import { Help } from "~/pages/presentation/ui/menubar-items/Help"
import { Insert } from "~/pages/presentation/ui/menubar-items/Insert"
import { Slide } from "~/pages/presentation/ui/menubar-items/Slide"
import { Menubar as UIMebubar } from "~/shared/ui-kit/menubar"

export function Menubar() {
  return (
    <UIMebubar className="inline-flex h-7 space-x-0 border-0 bg-transparent px-0">
      <File />
      <Edit />
      <Insert />
      <Slide />
      <Help />
    </UIMebubar>
  )
}
