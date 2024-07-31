import { CopyIcon, Trash2Icon } from "lucide-react"

import { type SlideProps, EDIT_ELEMENT_ID, setCurrentSlide, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import { DeleteSlide } from "~/features/delete-slide"
import { DuplicateSlide } from "~/features/duplicate-slide/ui"
import { cn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"

interface SlideItemProps {
  slide: SlideProps
  index: number
}

export function SlideItem({ slide, index }: SlideItemProps) {
  const dispatch = useAppDispatch()
  const currentSlide = useAppSelector((state) => state.presentation.currentSlide)
  const { flush, flushWithPattern, deleteWithPattern, deleteDebounced } = useDebouncedFunctions()

  return (
    <div className="group flex h-28 w-full flex-shrink-0 gap-2">
      <div className="flex h-full flex-col items-center gap-2">
        <small className="mb-auto font-bold">{index + 1}</small>
        <DuplicateSlide>
          {(duplicateSlide) => (
            <button
              type="button"
              className="invisible h-[1.125rem] w-[1.125rem] opacity-0 transition duration-300 group-hover:visible group-hover:opacity-100"
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
        className="w-full"
        onClick={() => {
          flushWithPattern(EDIT_ELEMENT_ID)
          flush(TAKE_SCREENSHOT_ID)
          deleteWithPattern(EDIT_ELEMENT_ID)
          deleteDebounced(TAKE_SCREENSHOT_ID)
          dispatch(setCurrentSlide(index))
        }}>
        <img
          src={slide.thumbnailUrl}
          alt="Slide thumbnail"
          className={cn(
            "h-full w-full max-w-[10.375rem] rounded-md border-2 border-white shadow",
            index === currentSlide && "border-blue-500",
          )}
        />
      </button>
    </div>
  )
}
