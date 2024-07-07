import { Layer, Stage } from "react-konva"
import type { KonvaEventObject } from "konva/lib/Node"
import { Stage as StageClass } from "konva/lib/Stage"

import {
  addElement,
  changeTextProps,
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

    // - Click logic -

    if (toolbar.textProps.isEditing) return dispatch(changeTextProps({ isEditing: false }))

    if (e.target instanceof StageClass) {
      if (toolbar.mode === "cursor" && !toolbar.textProps.isEditing && selectedId !== -1) {
        // drop selected item (if something is selected)
        return dispatch(setSelectedId(-1))
      }
    }

    if (toolbar.mode !== "cursor") {
      dispatch(addElement({ x: pointerPosition.x, y: pointerPosition.y }))
    }
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
              // Internal optimization here. `isEditing` is only needed for Text so for all the other Elements it's unnecessary to update
              // So, when isEditing is updated, only Text elements are going to re-render (but not Image or Shape for example because it's always `false`)
              isEditing={element.__typename === "Text" ? toolbar.textProps.isEditing : false}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}
