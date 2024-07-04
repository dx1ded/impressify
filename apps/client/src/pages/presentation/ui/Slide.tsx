import { Layer, Stage } from "react-konva"
import type { KonvaEventObject } from "konva/lib/Node"
import { Stage as StageClass } from "konva/lib/Stage"

import {
  addElement,
  ElementWrapper,
  getElement,
  setSelectedId,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
} from "~/entities/presentation"
import { useAppDispatch, useAppSelector } from "~/shared/model"

export function Slide() {
  const { presentation, currentSlide, toolbar, selectedId, isLoading } = useAppSelector((state) => state.presentation)
  const dispatch = useAppDispatch()

  const slide = presentation.slides[currentSlide]

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    if (!stage) return
    const pointerPosition = stage.getPointerPosition()
    if (!pointerPosition) return

    if (toolbar.mode === "cursor") {
      // drop selected item (if something is selected)
      if (e.target instanceof StageClass) return dispatch(setSelectedId(-1))
      return
    }

    dispatch(addElement({ x: pointerPosition.x, y: pointerPosition.y }))
  }

  if (isLoading) return <p>Loading ...</p>

  return (
    <div className="flex flex-1 items-center justify-center">
      <Stage width={SLIDE_WIDTH} height={SLIDE_HEIGHT} className="border bg-white" onClick={handleStageClick}>
        <Layer>
          {slide.elements.map((element, i) => (
            <ElementWrapper
              key={i}
              Element={getElement(element)}
              props={element}
              isSelected={element.id === selectedId}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}
