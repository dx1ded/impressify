import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd"

import { EDIT_ELEMENT_ID, moveSlide, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import { SlideItem } from "~/pages/presentation/ui/SlideItem"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

export function SlideList() {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const dispatch = useAppDispatch()
  const { flush, flushWithPattern, deleteWithPattern, deleteDebounced } = useDebouncedFunctions()

  const dragEndHandler = (data: DropResult) => {
    if (!data.destination) return
    dispatch(moveSlide({ id: data.draggableId, newIndex: data.destination.index }))
    if (data.source.index !== data.destination.index) {
      deleteWithPattern(EDIT_ELEMENT_ID)
      deleteDebounced(TAKE_SCREENSHOT_ID)
    }
  }

  return (
    <DragDropContext
      onDragStart={() => {
        flushWithPattern(EDIT_ELEMENT_ID)
        flush(TAKE_SCREENSHOT_ID)
      }}
      onDragEnd={dragEndHandler}>
      <Droppable droppableId="slidelist-droppable">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-shrink-0 basis-52 flex-col gap-4 overflow-y-auto border-r pr-4">
            {slides.map((slide, i) => (
              <SlideItem key={slide.id} slide={slide} index={i} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
