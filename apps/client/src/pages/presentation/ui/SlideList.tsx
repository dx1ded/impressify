import { DragDropContext, type DragStart, Droppable, type DropResult } from "@hello-pangea/dnd"
import { transformNormalizedToYSlide } from "@server/hocuspocus/transform"
import type { UserAwareness, YPresentation } from "@server/hocuspocus/types"
import { memo, useState } from "react"

import { moveSlide, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import { SlideListItem } from "~/pages/presentation/ui/SlideListItem"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, switchCurrentSlide, useYjs } from "~/shared/model"

export const SlideList = memo(function SlideList() {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const currentSlide = useAppSelector((state) => state.presentation.currentSlide)
  const dispatch = useAppDispatch()
  const [isDragging, setIsDragging] = useState(false)
  const { flush, flushWithPattern, deleteWithPattern, deleteDebounced } = useDebouncedFunctions()
  const { provider, getMap, updateAwareness } = useYjs()

  const dragStartHandler = (data: DragStart) => {
    setIsDragging(true)
    flushWithPattern(EDIT_ELEMENT_ID)
    flush(TAKE_SCREENSHOT_ID)
    if (data.source.index === currentSlide) return
    dispatch(switchCurrentSlide(data.source.index))
    updateAwareness<UserAwareness>({ currentSlideId: slides[data.source.index].id })
  }

  const dragEndHandler = (data: DropResult) => {
    if (data.destination && data.source.index !== data.destination.index) {
      deleteWithPattern(EDIT_ELEMENT_ID)
      deleteDebounced(TAKE_SCREENSHOT_ID)
      const { deleteIndex, newIndex } = dispatch(moveSlide({ id: data.draggableId, newIndex: data.destination.index }))
      const slide = slides[deleteIndex]
      const ySlides = getMap<YPresentation>().get("slides")
      provider?.document.transact(() => {
        ySlides?.delete(deleteIndex)
        ySlides?.insert(newIndex, [transformNormalizedToYSlide(slide)])
      })
      // Not updating awareness because it will be handled in `updateHandler`
    }
    setIsDragging(false)
  }

  return (
    <DragDropContext onDragStart={dragStartHandler} onDragEnd={dragEndHandler}>
      <Droppable droppableId="slidelist-droppable">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-shrink-0 basis-52 overflow-y-auto border-r pr-4">
            {slides.map((slide, i) => (
              <SlideListItem key={slide.id} slide={slide} index={i} isDragging={isDragging} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
})
