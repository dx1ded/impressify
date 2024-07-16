import type { ImageEditProps, Mode, ShapeEditProps, TextEditProps } from "~/entities/presentation"

interface ToolbarState {
  mode: Mode
  textProps: TextEditProps
  imageProps: ImageEditProps
  shapeProps: ShapeEditProps
}
