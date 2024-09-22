import type { UserAwareness, YPresentation } from "@server/hocuspocus/types"
import { transformNormalizedToYElement } from "@server/hocuspocus/transform"
import { memo, useMemo, useRef } from "react"
import { Layer, Rect, Stage } from "react-konva"
import { shallowEqual } from "react-redux"
import type { KonvaEventObject } from "konva/lib/Node"
import { Stage as StageClass } from "konva/lib/Stage"
import { useDebouncedCallback } from "use-debounce"

import {
  ElementWrapper,
  getElement,
  addElement,
  generateEditElementId,
  selectElement,
  editElement,
  resetToolbarElementProps,
  setMode,
  setThumbnail,
  setIsEditing,
  setIsCreating,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
  NOT_SELECTED,
  TAKE_SCREENSHOT_ID,
  ELEMENT_SELECTION_NAME,
} from "~/entities/presentation"
import { createImage, isColor, isNotNullable, uploadImageToStorage } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"
import { Cursor } from "~/shared/ui/Cursor"

const SCREENSHOT_DEBOUCE_TIME = 5000
const UPDATE_CURSOR_DEBOUNCE_TIME = 150

const CONTAINER_BORDER_WIDTH = 2

export const Slide = memo(function Slide() {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const connectedUsers = useAppSelector((state) => state.user.connectedUsers)
  const { currentSlide, presentationId, userId, selectedId, isLoading, isCreating, isEditing, mode, imageHeight } =
    useAppSelector(
      (state) => ({
        currentSlide: state.presentation.currentSlide,
        presentationId: state.presentation.presentation.id,
        selectedId: state.presentation.selectedId,
        userId: state.user.id,
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
  const { getMap, updateAwareness } = useYjs()

  const slide = slides[currentSlide]

  let takeScreenshot = () => {}

  if (stageRef.current) {
    takeScreenshot = register(
      TAKE_SCREENSHOT_ID,
      async () => {
        if (!stageRef.current) return
        const transformers = stageRef.current.find("Transformer")
        // Other users element selections (if there are some)
        const selectionStrokes = stageRef.current.find(`.${ELEMENT_SELECTION_NAME}`)

        transformers.forEach((tr) => tr.visible(false))
        selectionStrokes.forEach((el) => el.visible(false))

        // Taking a screenshot while transformers and selectionStrokes are hidden
        const dataUrl = stageRef.current.toDataURL()

        transformers.forEach((tr) => tr.visible(true))
        selectionStrokes.forEach((el) => el.visible(true))

        const uploadedImageUrl = await uploadImageToStorage(dataUrl, `${presentationId}/${slide.id}/thumbnail`)
        dispatch(setThumbnail(uploadedImageUrl))
        getMap<YPresentation>().get("slides")?.get(currentSlide)?.set("thumbnailUrl", uploadedImageUrl)
      },
      SCREENSHOT_DEBOUCE_TIME,
      [slide?.id, currentSlide],
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
      updateAwareness<UserAwareness>({ selectedId: NOT_SELECTED })
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

      // Updating awareness
      updateAwareness<UserAwareness>({ selectedId: newEl.id })

      // Taking screenshot
      takeScreenshot()
    }
  }

  const mouseMoveHandlerDebounced = useDebouncedCallback((e: KonvaEventObject<MouseEvent>) => {
    updateAwareness<UserAwareness>({
      cursor: {
        x: e.evt.layerX,
        y: e.evt.layerY,
        isOutsideBoundaries: false,
      },
    })
  }, UPDATE_CURSOR_DEBOUNCE_TIME)

  const mouseLeaveHandler = (e: KonvaEventObject<MouseEvent>) => {
    mouseMoveHandlerDebounced.cancel()
    updateAwareness<UserAwareness>({
      cursor: {
        x: e.evt.layerX,
        y: e.evt.layerY,
        isOutsideBoundaries: true,
      },
    })
  }

  const connectedUsersExcludingYourself = connectedUsers.filter((connectedUser) => connectedUser.id !== userId)
  const selectedElementsByOthers = useMemo(
    () =>
      connectedUsersExcludingYourself.reduce<{ [key: string]: string }>((acc, connectedUser) => {
        const element = slide?.elements.find((element) => element.id === connectedUser.selectedId)
        if (element && !acc[element.id]) {
          acc[element.id] = connectedUser.color
        }
        return acc
      }, {}),
    [connectedUsersExcludingYourself, slide?.elements],
  )

  return (
    <div className="flex flex-1 items-center justify-center">
      <div
        className="relative border"
        style={{
          width: `${SLIDE_WIDTH + CONTAINER_BORDER_WIDTH}px`,
          height: `${SLIDE_HEIGHT + CONTAINER_BORDER_WIDTH}px`,
        }}>
        {connectedUsersExcludingYourself.map(
          (connectedUser) =>
            connectedUser.currentSlideId === slides[currentSlide]?.id &&
            isNotNullable(connectedUser.cursor.x) &&
            isNotNullable(connectedUser.cursor.y) && (
              <Cursor
                key={connectedUser.id}
                name={connectedUser.name}
                color={connectedUser.color}
                x={connectedUser.cursor.x}
                y={connectedUser.cursor.y}
                isVisible={!connectedUser.cursor.isOutsideBoundaries}
              />
            ),
        )}
        <Stage
          ref={stageRef}
          width={SLIDE_WIDTH}
          height={SLIDE_HEIGHT}
          style={{ cursor: isCreating ? "crosshair" : "default" }}
          onClick={handleStageClick}
          onMouseMove={mouseMoveHandlerDebounced}
          onMouseLeave={mouseLeaveHandler}>
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
                    // Might be `undefined`
                    anotherUserColor={selectedElementsByOthers[element.id]}
                  />
                ))}
              </>
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  )
})
