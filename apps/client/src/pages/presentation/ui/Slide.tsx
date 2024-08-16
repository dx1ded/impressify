import { memo, useRef } from "react"
import { Layer, Rect, Stage } from "react-konva"
import { shallowEqual } from "react-redux"
import type { KonvaEventObject } from "konva/lib/Node"
import { Stage as StageClass } from "konva/lib/Stage"

import {
  ElementWrapper,
  getElement,
  addElement,
  resetToolbar,
  setMode,
  setIsEditing,
  selectElement,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
  NOT_SELECTED,
  setIsCreating,
  setThumbnail,
  TAKE_SCREENSHOT_ID,
  SAVE_SLIDES_ID,
  setIsSaving,
  SYNCHRONIZE_STATE_ID,
} from "~/entities/presentation"
import { createImage, isColor } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

const SCREENSHOT_DEBOUCE_TIME = 5000

export const Slide = memo(function Slide() {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const { currentSlide, selectedId, isLoading, isCreating, isEditing, mode, imageHeight } = useAppSelector(
    (state) => ({
      currentSlide: state.presentation.currentSlide,
      selectedId: state.presentation.selectedId,
      isLoading: state.presentation.isLoading,
      isCreating: state.presentation.isCreating,
      isEditing: state.presentation.isEditing,
      mode: state.presentation.toolbar.mode,
      imageHeight: state.presentation.toolbar.imageProps.height,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()
  const stageRef = useRef<StageClass>(null)
  const { register, call } = useDebouncedFunctions()

  let takeScreenshot: (() => void) | undefined

  if (stageRef.current) {
    takeScreenshot = register(
      TAKE_SCREENSHOT_ID,
      () => {
        if (!stageRef.current) return
        // Hiding transformers (if there are some)
        const transformers = stageRef.current.find("Transformer")
        transformers.forEach((tr) => tr.visible(false))
        const url = stageRef.current.toDataURL()
        transformers.forEach((tr) => tr.visible(true))
        dispatch(setThumbnail(url))
        call(SAVE_SLIDES_ID)
        dispatch(setIsSaving(true))
        call(SYNCHRONIZE_STATE_ID)
      },
      SCREENSHOT_DEBOUCE_TIME,
    )
  }

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
    }

    if (isCreating) {
      dispatch(
        addElement({
          x: pointerPosition.x,
          y: pointerPosition.y,
          // Height will be ignored for Text and Shape but used for Image only
          height: imageHeight,
        }),
      )
      call(SAVE_SLIDES_ID)
      dispatch(setIsSaving(true))
      call(SYNCHRONIZE_STATE_ID)
      dispatch(setIsCreating(false))
      if (takeScreenshot) takeScreenshot()
    }
  }

  const slide = slides[currentSlide]

  return (
    <div className="flex flex-1 items-center justify-center">
      <Stage
        ref={stageRef}
        className="border"
        width={SLIDE_WIDTH}
        height={SLIDE_HEIGHT}
        style={{ cursor: isCreating ? "crosshair" : "default" }}
        onClick={handleStageClick}>
        <Layer>
          {isLoading ? (
            <Rect x={0} y={0} width={SLIDE_WIDTH} height={SLIDE_HEIGHT} fill="rgba(0, 0, 0, 0.025)" />
          ) : (
            <>
              <Rect
                x={0}
                y={0}
                width={SLIDE_WIDTH}
                height={SLIDE_HEIGHT}
                listening={false}
                {...(isColor(slide.bg) ? { fill: slide.bg } : { fillPatternImage: createImage(slide.bg) })}
              />
              {slide.elements.map((element) => (
                <ElementWrapper
                  key={element.id}
                  Element={getElement(element)}
                  props={element}
                  mode={mode}
                  isSelected={element.id === selectedId}
                  isCreating={isCreating}
                  isEditing={element.__typename === "Text" ? isEditing && element.id === selectedId : false}
                />
              ))}
            </>
          )}
        </Layer>
      </Stage>
    </div>
  )
})
