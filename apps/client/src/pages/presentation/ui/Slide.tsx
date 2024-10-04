import type { UserAwareness, YPresentation } from "@server/hocuspocus/types"
import { transformNormalizedToYElement } from "@server/hocuspocus/transform"
import { memo, useEffect, useMemo, useRef } from "react"
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
  editElement,
  setSelectedId,
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
import { ProportionalImage } from "~/shared/ui/ProportionalImage"

const SCREENSHOT_DEBOUCE_TIME = 2500
const UPDATE_CURSOR_DEBOUNCE_TIME = 150

export const Slide = memo(function Slide() {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const connectedUsers = useAppSelector((state) => state.presentationUser.connectedUsers)
  const {
    currentSlide,
    presentationId,
    userId,
    selectedId,
    isLoading,
    isCreating,
    isEditing,
    mode,
    imageHeight,
    isEditor,
  } = useAppSelector(
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
      isEditor: state.presentationUser.isEditor,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<StageClass>(null)
  const { register, flush } = useDebouncedFunctions()
  const { getMap, updateAwareness } = useYjs()

  // Responsive stage
  useEffect(() => {
    const fitStageIntoParentContainer = () => {
      const container = containerRef.current
      const stage = stageRef.current
      if (!container || !stage) return

      // Get the container size (the container should automatically resize)
      const containerWidth = container.offsetWidth

      // but we also make the full scene visible
      // so we need to scale all objects on canvas
      const scale = containerWidth / SLIDE_WIDTH

      stage.width(SLIDE_WIDTH * scale)
      stage.height(SLIDE_HEIGHT * scale)
      stage.scale({ x: scale, y: scale })
    }

    // Run it initially to fit the stage to its container
    fitStageIntoParentContainer()

    // Recalculate scale on window resize
    window.addEventListener("resize", fitStageIntoParentContainer)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", fitStageIntoParentContainer)
    }
  }, [])

  const slide = slides[currentSlide]

  let takeScreenshot = () => {}

  if (stageRef.current) {
    takeScreenshot = register(
      TAKE_SCREENSHOT_ID,
      () => {
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

        dispatch(setThumbnail(dataUrl))
        getMap<YPresentation>().get("slides")?.get(currentSlide)?.set("thumbnailUrl", dataUrl)
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
      dispatch(setSelectedId(NOT_SELECTED))
      dispatch(setMode("cursor"))
      dispatch(resetToolbarElementProps())
      updateAwareness<UserAwareness>({ selectedId: NOT_SELECTED })
    }

    if (isCreating) {
      // Flushing previous selected item changes before creating a new element
      flush(generateEditElementId(selectedId))
      const newEl = dispatch(
        addElement({
          // Adjusting x and y based on stage scale
          x: pointerPosition.x / stage.scaleX(),
          y: pointerPosition.y / stage.scaleY(),
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
        // Adjusting x and y based on stage scale
        x: e.evt.layerX / e.currentTarget.scaleX(),
        y: e.evt.layerY / e.currentTarget.scaleY(),
        isOutsideBoundaries: false,
      },
    })
  }, UPDATE_CURSOR_DEBOUNCE_TIME)

  const mouseLeaveHandler = (e: KonvaEventObject<MouseEvent>) => {
    mouseMoveHandlerDebounced.cancel()
    updateAwareness<UserAwareness>({
      cursor: {
        // Adjusting x and y based on stage scale
        x: e.evt.layerX / e.currentTarget.scaleX(),
        y: e.evt.layerY / e.currentTarget.scaleY(),
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
    <div className="flex min-w-0 flex-1 items-center justify-center">
      <div ref={containerRef} className="relative w-full min-w-0 shadow-xl" style={{ maxWidth: SLIDE_WIDTH }}>
        {connectedUsersExcludingYourself.map(
          (connectedUser) =>
            connectedUser.currentSlideId === slides[currentSlide]?.id &&
            isNotNullable(connectedUser.cursor.x) &&
            isNotNullable(connectedUser.cursor.y) && (
              <Cursor
                key={connectedUser.id}
                name={connectedUser.name}
                color={connectedUser.color}
                // Adjusting x and y based on stage scale
                x={connectedUser.cursor.x * (stageRef.current?.scaleX() || 1)}
                y={connectedUser.cursor.y * (stageRef.current?.scaleY() || 1)}
                isVisible={!connectedUser.cursor.isOutsideBoundaries}
              />
            ),
        )}
        <Stage
          ref={stageRef}
          width={SLIDE_WIDTH}
          height={SLIDE_HEIGHT}
          listening={isEditor && !isLoading}
          style={{ cursor: isCreating ? "crosshair" : "default" }}
          onClick={handleStageClick}
          onMouseMove={mouseMoveHandlerDebounced}
          onMouseLeave={mouseLeaveHandler}>
          <Layer>
            {isLoading ? (
              <Rect x={0} y={0} width={SLIDE_WIDTH} height={SLIDE_HEIGHT} fill="rgba(0, 0, 0, 0.025)" />
            ) : (
              <>
                {/* Background */}
                {isColor(slide.bg) ? (
                  <Rect x={0} y={0} width={SLIDE_WIDTH} height={SLIDE_HEIGHT} listening={false} fill={slide.bg} />
                ) : (
                  <ProportionalImage
                    x={0}
                    y={0}
                    width={SLIDE_WIDTH}
                    height={SLIDE_HEIGHT}
                    listening={false}
                    image={createImage(slide.bg)}
                  />
                )}
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
