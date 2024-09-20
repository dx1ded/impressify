import type { YPresentation } from "@server/hocuspocus/types"
import { transformNormalizedToYElement } from "@server/hocuspocus/transform"
import { memo, useRef } from "react"
import { Layer, Rect, Stage } from "react-konva"
import { shallowEqual } from "react-redux"
import type { KonvaEventObject } from "konva/lib/Node"
import { Stage as StageClass } from "konva/lib/Stage"

import {
  ElementWrapper,
  getElement,
  addElement,
  generateEditElementId,
  selectElement,
  resetToolbarElementProps,
  setMode,
  setThumbnail,
  setIsEditing,
  setIsCreating,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
  NOT_SELECTED,
  TAKE_SCREENSHOT_ID,
  editElement,
} from "~/entities/presentation"
import { createImage, isColor, uploadImageToStorage } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"

const SCREENSHOT_DEBOUCE_TIME = 5000

export const Slide = memo(function Slide() {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const { currentSlide, presentationId, selectedId, isLoading, isCreating, isEditing, mode, imageHeight } =
    useAppSelector(
      (state) => ({
        currentSlide: state.presentation.currentSlide,
        presentationId: state.presentation.presentation.id,
        selectedId: state.presentation.selectedId,
        isLoading: state.presentation.isLoading,
        isCreating: state.presentation.isCreating,
        isEditing: state.presentation.isEditing,
        mode: state.toolbar.mode,
        imageHeight: state.toolbar.imageProps.height,
      }),
      shallowEqual,
    )
  const dispatch = useAppDispatch()
  const stageRef = useRef<StageClass>(null)
  const { register, flush } = useDebouncedFunctions()
  const { getMap } = useYjs()

  const slide = slides[currentSlide]

  let takeScreenshot = () => {}

  if (stageRef.current) {
    takeScreenshot = register(
      TAKE_SCREENSHOT_ID,
      async () => {
        if (!stageRef.current) return
        // Hiding transformers (if there are some)
        const transformers = stageRef.current.find("Transformer")
        transformers.forEach((tr) => tr.visible(false))
        const dataUrl = stageRef.current.toDataURL()
        transformers.forEach((tr) => tr.visible(true))
        const uploadedImageUrl = await uploadImageToStorage(dataUrl, `${presentationId}/${slide.id}/thumbnail`)
        dispatch(setThumbnail(uploadedImageUrl))
        getMap<YPresentation>().get("slides")?.get(currentSlide)?.set("thumbnailUrl", uploadedImageUrl)
      },
      SCREENSHOT_DEBOUCE_TIME,
      [slide?.id],
    )
  }

  const handleStageClick = async (e: KonvaEventObject<MouseEvent>) => {
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
      dispatch(resetToolbarElementProps())
    }

    if (isCreating) {
      // Flushing previous selected item changes before creating a new element
      flush(generateEditElementId(selectedId))
      const newEl = dispatch(
        addElement({
          x: pointerPosition.x,
          y: pointerPosition.y,
          // Height will be ignored for Text and Shape but used for Image only
          height: imageHeight,
        }),
      )
      dispatch(setIsCreating(false))
      // Uploading dataUrl to firebase/storage if the element is image
      if (newEl.__typename === "Image") {
        const uploadedImageUrl = await uploadImageToStorage(newEl.imageUrl, `${presentationId}/${slide.id}/${newEl.id}`)
        dispatch(editElement({ id: newEl.id, imageUrl: uploadedImageUrl }))
        newEl.imageUrl = uploadedImageUrl
      }
      // Pushing new element to yjs document
      getMap<YPresentation>()
        .get("slides")
        ?.get(currentSlide)
        ?.get("elements")
        ?.push([transformNormalizedToYElement(newEl)])

      takeScreenshot()
    }
  }

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
                  currentSlide={currentSlide}
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
