import { Layer, Rect, Stage } from "react-konva"

import { SLIDE_HEIGHT, SLIDE_WIDTH } from "~/entities/presentation"

export function Slide() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Stage width={SLIDE_WIDTH} height={SLIDE_HEIGHT} className="border bg-white">
        <Layer>
          <Rect width={50} height={50} fill="red" x={100} y={100} />
        </Layer>
      </Stage>
    </div>
  )
}
