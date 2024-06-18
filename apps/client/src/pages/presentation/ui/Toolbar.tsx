import { Add } from "~/pages/presentation/ui/toolbar-items/Add"
import { CursorMode } from "~/pages/presentation/ui/toolbar-items/CursorMode"
import { History } from "~/pages/presentation/ui/toolbar-items/History"
import { ImageMode } from "~/pages/presentation/ui/toolbar-items/ImageMode"
import { Mode } from "~/pages/presentation/ui/toolbar-items/Mode"
import { ShapeMode } from "~/pages/presentation/ui/toolbar-items/ShapeMode"
import { TextMode } from "~/pages/presentation/ui/toolbar-items/TextMode"
import { ToolbarSeparator } from "~/shared/ui/Toolbar"

export function Toolbar() {
  return (
    <div className="bg-secondary mb-6 flex items-center rounded-3xl px-4 py-2">
      <Add />
      <ToolbarSeparator />
      <History />
      <ToolbarSeparator />
      <Mode />
      <ToolbarSeparator />
      {/* <CursorMode /> */}
      <TextMode />
      {/* <ImageMode /> */}
      {/* <ShapeMode /> */}
    </div>
  )
}
