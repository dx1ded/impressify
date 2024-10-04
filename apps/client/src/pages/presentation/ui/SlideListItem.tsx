import { Draggable } from "@hello-pangea/dnd"
import type { UserAwareness } from "@server/hocuspocus/types"
import { CopyIcon, SparklesIcon, Trash2Icon } from "lucide-react"
import { shallowEqual } from "react-redux"

import { Transition } from "~/__generated__/graphql"
import { type SlideProps, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import { DeleteSlide } from "~/features/delete-slide"
import { DuplicateSlide } from "~/features/duplicate-slide/ui"
import { ConnectionList } from "~/pages/presentation/ui/ConnectionList"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, switchCurrentSlide, useYjs } from "~/shared/model"
import { cn } from "~/shared/lib"

interface SlideListItemProps {
  slide: SlideProps
  index: number
  isDragging: boolean
}

export function SlideListItem({ slide, index, isDragging }: SlideListItemProps) {
  const connectedUsers = useAppSelector((state) => state.presentationUser.connectedUsers)
  const { currentSlide, isEditor, isLoading } = useAppSelector(
    (state) => ({
      currentSlide: state.presentation.currentSlide,
      isEditor: state.presentationUser.isEditor,
      isLoading: state.presentation.isLoading,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()
  const { flush, flushWithPattern, deleteWithPattern } = useDebouncedFunctions()
  const { updateAwareness } = useYjs()

  const switchSlide = () => {
    if (index === currentSlide) return
    if (isEditor) {
      flushWithPattern(EDIT_ELEMENT_ID)
      flush(TAKE_SCREENSHOT_ID)
      deleteWithPattern(EDIT_ELEMENT_ID)
    }
    dispatch(switchCurrentSlide(index))
    updateAwareness<UserAwareness>({ currentSlideId: slide.id })
  }

  return (
    <Draggable
      draggableId={slide.id}
      index={index}
      isDragDisabled={!isEditor || isLoading}
      disableInteractiveElementBlocking>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          // mb-4 is used instead of container gap + for every element to avoid the issue related to gaps with react-beautiful-dnd
          className="group mb-4 flex h-28 w-full flex-shrink-0 gap-2 max-lg:h-24">
          <div className="flex h-full flex-col items-center gap-2">
            {!isDragging && <small className="font-bold">{index + 1}</small>}
            {slide.transition !== Transition.None && (
              <SparklesIcon className="h-[1.125rem] w-[1.125rem] text-yellow-500" />
            )}
            <DuplicateSlide>
              {(duplicateSlide) => (
                <button
                  type="button"
                  className="invisible mt-auto h-[1.125rem] w-[1.125rem] opacity-0 transition duration-300 group-hover:visible group-hover:opacity-100"
                  onClick={() => duplicateSlide(slide.id)}>
                  <CopyIcon className="h-full w-full" />
                </button>
              )}
            </DuplicateSlide>
            <DeleteSlide>
              {(deleteSlide) => (
                <button
                  type="button"
                  className="invisible h-[1.125rem] w-[1.125rem] text-red-600 opacity-0 transition duration-300 group-hover:visible group-hover:opacity-100"
                  onClick={() => deleteSlide(slide.id)}>
                  <Trash2Icon className="h-full w-full" />
                </button>
              )}
            </DeleteSlide>
          </div>
          <button
            type="button"
            className={cn(
              "group relative block flex-1 overflow-hidden rounded-md border-2 border-white shadow",
              index === currentSlide && "border-blue-500",
            )}
            onClick={switchSlide}>
            <img src={slide.thumbnailUrl} alt="Slide thumbnail" className="h-full w-full" />
            <ConnectionList
              size="sm"
              className="absolute bottom-1.5 right-2 translate-y-[95%] transition-transform group-hover:translate-y-0"
              users={connectedUsers.filter((_user) => _user.currentSlideId === slide.id)}
            />
          </button>
        </div>
      )}
    </Draggable>
  )
}
