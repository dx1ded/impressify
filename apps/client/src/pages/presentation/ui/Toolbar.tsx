import { useAppSelector } from "~/shared/model"
import { ToolbarSeparator } from "~/shared/ui/Toolbar"
import { Add } from "~/pages/presentation/ui/toolbar-items/Add"
import { History } from "~/pages/presentation/ui/toolbar-items/History"
import { Mode } from "~/pages/presentation/ui/toolbar-items/Mode"
import { CursorMode } from "~/pages/presentation/ui/toolbar-items/CursorMode"
import { TextMode } from "~/pages/presentation/ui/toolbar-items/TextMode"
import { ImageMode } from "~/pages/presentation/ui/toolbar-items/ImageMode"
import { ShapeMode } from "~/pages/presentation/ui/toolbar-items/ShapeMode"

export function Toolbar() {
  const mode = useAppSelector((state) => state.presentation.toolbar.mode)

  return (
    <div className="bg-secondary mb-6 flex items-center rounded-3xl px-4 py-2">
      <Add />
      <ToolbarSeparator />
      <History />
      <ToolbarSeparator />
      <Mode />
      <ToolbarSeparator />
      {/*
        Modes only change their visibility, in fact they are always rendered. This is done for extra optimization
        ... because there are some components like <ColorPicker> that take a bunch of time and resources to be rendered
      */}
      <CursorMode isActive={mode === "cursor"} />
      <TextMode isActive={mode === "text"} />
      <ImageMode isActive={mode === "image"} />
      <ShapeMode isActive={mode === "shape"} />
    </div>
  )
}
