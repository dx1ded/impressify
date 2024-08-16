import { DragDropContext, type DragStart, Droppable, type DropResult } from "@hello-pangea/dnd"
import { useState } from "react"

import {
  changeConnectedUser,
  EDIT_ELEMENT_ID,
  moveSlide,
  SAVE_SLIDES_ID,
  setCurrentSlide,
  setIsSaving,
  SYNCHRONIZE_STATE_ID,
  TAKE_SCREENSHOT_ID,
} from "~/entities/presentation"
import { SlideListItem } from "~/pages/presentation/ui/SlideListItem"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

export function SlideList() {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const connectedUsers = useAppSelector((state) => state.presentation.connectedUsers)
  const userId = useAppSelector((state) => state.user.userId)
  const dispatch = useAppDispatch()
  const [isDragging, setIsDragging] = useState(false)
  const { flush, flushWithPattern, deleteWithPattern, deleteDebounced, call } = useDebouncedFunctions()

  const dragStartHandler = (data: DragStart) => {
    setIsDragging(true)
    flushWithPattern(EDIT_ELEMENT_ID)
    flush(TAKE_SCREENSHOT_ID)
    dispatch(setCurrentSlide(data.source.index))
  }

  const dragEndHandler = (data: DropResult) => {
    if (data.destination && data.source.index !== data.destination.index) {
      deleteWithPattern(EDIT_ELEMENT_ID)
      deleteDebounced(TAKE_SCREENSHOT_ID)
      dispatch(moveSlide({ id: data.draggableId, newIndex: data.destination.index }))
      dispatch(changeConnectedUser({ id: userId!, currentSlide: data.destination.index }))
      call(SAVE_SLIDES_ID)
      dispatch(setIsSaving(true))
      call(SYNCHRONIZE_STATE_ID)
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
              <SlideListItem
                key={slide.id}
                slide={slide}
                users={connectedUsers.filter((_user) => _user.currentSlide === i)}
                index={i}
                isDragging={isDragging}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
