import { memo } from "react"

import { useAppSelector } from "~/shared/model"
import { ToolbarSeparator } from "~/shared/ui/Toolbar"
import { Add } from "~/widgets/toolbar/ui/Add"
import { History } from "~/widgets/toolbar/ui/History"
import { Mode } from "~/widgets/toolbar/ui/Mode"
import { CursorMode } from "~/widgets/toolbar/ui/CursorMode"
import { TextMode } from "~/widgets/toolbar/ui/TextMode"
import { ImageMode } from "~/widgets/toolbar/ui/ImageMode"
import { ShapeMode } from "~/widgets/toolbar/ui/ShapeMode"

export const Toolbar = memo(function Toolbar() {
  const mode = useAppSelector((state) => state.toolbar.mode)

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
})
