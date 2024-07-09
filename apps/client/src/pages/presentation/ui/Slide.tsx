import { Layer, Rect, Stage } from "react-konva"
import { shallowEqual } from "react-redux"
import type { KonvaEventObject } from "konva/lib/Node"
import { Stage as StageClass } from "konva/lib/Stage"
import { Text as TextClass } from "konva/lib/shapes/Text"
import { Image as ImageClass } from "konva/lib/shapes/Image"
import { Shape as ShapeClass } from "konva/lib/Shape"

import {
  addElement,
  changeTextProps,
  ElementWrapper,
  getElement,
  resetToolbar,
  setMode,
  selectElement,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
  NOT_SELECTED,
} from "~/entities/presentation"
import { useAppDispatch, useAppSelector } from "~/shared/model"

export function Slide() {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const { currentSlide, selectedId, isLoading, isEditing, mode } = useAppSelector(
    (state) => ({
      currentSlide: state.presentation.currentSlide,
      selectedId: state.presentation.selectedId,
      isLoading: state.presentation.isLoading,
      isEditing: state.presentation.toolbar.textProps.isEditing,
      mode: state.presentation.toolbar.mode,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    if (!stage) return
    const pointerPosition = stage.getPointerPosition()
    if (!pointerPosition) return

    // - Click logic -

    if (isEditing) return dispatch(changeTextProps({ isEditing: false }))

    if (e.target instanceof StageClass && !isEditing && selectedId !== NOT_SELECTED) {
      // dropping selected item (if something is selected)
      dispatch(selectElement(NOT_SELECTED))
      dispatch(setMode("cursor"))
      dispatch(resetToolbar())
      return
    }

    if (
      (e.target instanceof TextClass && mode !== "text") ||
      (e.target instanceof ImageClass && mode !== "image") ||
      (e.target instanceof ShapeClass && mode !== "shape") ||
      mode === "cursor"
    )
      return

    dispatch(addElement({ x: pointerPosition.x, y: pointerPosition.y }))
  }

  const slide = slides[currentSlide]

  return (
    <div className="flex flex-1 items-center justify-center">
      <Stage width={SLIDE_WIDTH} height={SLIDE_HEIGHT} className="border bg-white" onClick={handleStageClick}>
        <Layer>
          {isLoading ? (
            <Rect x={0} y={0} width={SLIDE_WIDTH} height={SLIDE_HEIGHT} fill="rgba(0, 0, 0, 0.025)" />
          ) : (
            slide.elements.map((element, i) => (
              <ElementWrapper
                key={i}
                Element={getElement(element)}
                props={element}
                mode={mode}
                isSelected={element.id === selectedId}
                isEditing={element.__typename === "Text" ? isEditing && element.id === selectedId : false}
              />
            ))
          )}
        </Layer>
      </Stage>
    </div>
  )
}
