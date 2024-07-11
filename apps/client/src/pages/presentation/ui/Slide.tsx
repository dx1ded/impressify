import { Layer, Rect, Stage } from "react-konva"
import { shallowEqual } from "react-redux"
import type { KonvaEventObject } from "konva/lib/Node"
import { Stage as StageClass } from "konva/lib/Stage"

import {
  addElement,
  ElementWrapper,
  getElement,
  resetToolbar,
  setMode,
  setIsEditing,
  selectElement,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
  NOT_SELECTED,
  setIsCreating,
} from "~/entities/presentation"
import { useAppDispatch, useAppSelector } from "~/shared/model"

export function Slide() {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const { currentSlide, selectedId, isLoading, isCreating, isEditing, mode } = useAppSelector(
    (state) => ({
      currentSlide: state.presentation.currentSlide,
      selectedId: state.presentation.selectedId,
      isLoading: state.presentation.isLoading,
      isCreating: state.presentation.isCreating,
      isEditing: state.presentation.isEditing,
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

    if (isEditing) return dispatch(setIsEditing(false))

    // dropping selected item when click on empty part of the stage
    if (e.target instanceof StageClass && !isCreating && selectedId !== NOT_SELECTED) {
      dispatch(selectElement(NOT_SELECTED))
      dispatch(setMode("cursor"))
      dispatch(resetToolbar())
      return
    }

    if (isCreating) {
      dispatch(addElement({ x: pointerPosition.x, y: pointerPosition.y }))
      dispatch(setIsCreating(false))
    }
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
                isCreating={isCreating}
                isEditing={element.__typename === "Text" ? isEditing && element.id === selectedId : false}
              />
            ))
          )}
        </Layer>
      </Stage>
    </div>
  )
}
