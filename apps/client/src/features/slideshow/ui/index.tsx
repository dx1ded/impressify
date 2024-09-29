import type { NormalizedYSlide } from "@server/hocuspocus/types"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useRef, useState, useEffect } from "react"

import { setIsSlideshow } from "~/entities/presentation"
import { SlideshowSlide } from "~/features/slideshow/ui/SlideshowSlide"
import { type ChildrenAsCallbackWithFn, cn } from "~/shared/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"

export function Slideshow({ children }: ChildrenAsCallbackWithFn) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const isSlideshow = useAppSelector((state) => state.presentation.isSlideshow)
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const dispatch = useAppDispatch()

  const slidesSnapshotRef = useRef<NormalizedYSlide[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const startSlideShow = async () => {
    if (!containerRef.current) return

    slidesSnapshotRef.current = slides
    dispatch(setIsSlideshow(true))
    await containerRef.current.requestFullscreen()
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        dispatch(setIsSlideshow(false))
        setCurrentSlide(0)
      }
    }

    const keyDownHandler = (e: KeyboardEvent) => {
      if (!isSlideshow) return
      if (e.key === "ArrowLeft" && currentSlide !== 0) {
        setCurrentSlide((value) => value - 1)
      } else if (e.key === "ArrowRight" && currentSlide !== slides.length - 1) {
        setCurrentSlide((value) => value + 1)
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("keydown", keyDownHandler)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("keydown", keyDownHandler)
    }
  }, [dispatch, currentSlide, isSlideshow, slides.length])

  return (
    <>
      {children(startSlideShow)}
      <div
        ref={containerRef}
        className={cn(
          "left-0 top-0 z-50 flex h-full w-full justify-center bg-black",
          isSlideshow ? "absolute" : "hidden",
        )}
        hidden={!isSlideshow}>
        {slidesSnapshotRef.current?.length && (
          <>
            <SlideshowSlide slide={slidesSnapshotRef.current[currentSlide]} />
            <div className="absolute bottom-5 right-10 z-30 flex items-center gap-8">
              <button
                type="button"
                className="flex h-20 w-20 items-center justify-center rounded-full border bg-white shadow-md disabled:opacity-50"
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide((value) => value - 1)}>
                <ChevronLeftIcon className="h-3/4 w-3/4" />
              </button>
              <button
                type="button"
                className="flex h-20 w-20 items-center justify-center rounded-full border bg-white shadow-md disabled:opacity-50"
                disabled={currentSlide === slidesSnapshotRef.current.length - 1}
                onClick={() => setCurrentSlide((value) => value + 1)}>
                <ChevronRightIcon className="h-3/4 w-3/4" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
