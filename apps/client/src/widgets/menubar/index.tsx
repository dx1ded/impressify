import { Edit } from "~/widgets/menubar/ui/Edit"
import { File } from "~/widgets/menubar/ui/File"
import { Help } from "~/widgets/menubar/ui/Help"
import { Insert } from "~/widgets/menubar/ui/Insert"
import { Slide } from "~/widgets/menubar/ui/Slide"
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
