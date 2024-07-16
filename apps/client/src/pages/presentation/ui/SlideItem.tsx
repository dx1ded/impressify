import { CopyIcon, Trash2Icon } from "lucide-react"

import { copySlide, deleteSlide, setCurrentSlide, type SlideProps, useScreenshot } from "~/entities/presentation"
import { cn } from "~/shared/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"

interface SlideItemProps {
  slide: SlideProps
  index: number
}

export function SlideItem({ slide, index }: SlideItemProps) {
  const dispatch = useAppDispatch()
  const currentSlide = useAppSelector((state) => state.presentation.currentSlide)
  const { takeScreenshot } = useScreenshot()

  return (
    <div className="group flex h-28 w-full flex-shrink-0 gap-2">
      <div className="flex h-full flex-col items-center gap-2">
        <small className="mb-auto font-bold">{index + 1}</small>
        <button
          type="button"
          className="invisible h-[1.125rem] w-[1.125rem] opacity-0 transition duration-300 group-hover:visible group-hover:opacity-100">
          <CopyIcon
            className="h-full w-full"
            onClick={() => {
              takeScreenshot?.flush()
              dispatch(copySlide(slide.id))
            }}
          />
        </button>
        <button
          type="button"
          className="invisible h-[1.125rem] w-[1.125rem] text-red-600 opacity-0 transition duration-300 group-hover:visible group-hover:opacity-100">
          <Trash2Icon
            className="h-full w-full"
            onClick={() => {
              if (index === currentSlide) takeScreenshot?.cancel()
              dispatch(deleteSlide(slide.id))
            }}
          />
        </button>
      </div>
      <button
        type="button"
        className="w-full"
        onClick={() => {
          takeScreenshot?.flush()
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
