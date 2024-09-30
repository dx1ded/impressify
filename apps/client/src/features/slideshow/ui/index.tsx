import { normalizePresentation } from "@server/hocuspocus/transform"
import type { YPresentation } from "@server/hocuspocus/types"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useRef, useState, useEffect, memo } from "react"

import { type SlideProps, setIsSlideshow, TAKE_SCREENSHOT_ID, EDIT_ELEMENT_ID } from "~/entities/presentation"
import { SlideshowSlide } from "~/features/slideshow/ui/SlideshowSlide"
import { type ChildrenAsCallbackWithFn, cn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"
import { Button } from "~/shared/ui-kit/button"

export const Slideshow = memo<ChildrenAsCallbackWithFn>(function Slideshow({ children }) {
  const [slides, setSlides] = useState<SlideProps[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const isSlideshow = useAppSelector((state) => state.presentation.isSlideshow)
  const dispatch = useAppDispatch()
  const containerRef = useRef<HTMLDivElement>(null)
  const { flush, flushWithPattern } = useDebouncedFunctions()
  const { getMap } = useYjs()

  const startSlideShow = async () => {
    if (!containerRef.current) return
    flushWithPattern(EDIT_ELEMENT_ID)
    flush(TAKE_SCREENSHOT_ID)

    const normalizedPresentation = normalizePresentation(getMap<YPresentation>())
    setSlides(normalizedPresentation.slides)
    dispatch(setIsSlideshow(true))
    await containerRef.current.requestFullscreen()
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        dispatch(setIsSlideshow(false))
        setCurrentSlide(0)
        setSlides([])
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
        {slides.length && (
          <>
            <SlideshowSlide slide={slides[currentSlide]} />
            <div className="absolute bottom-5 right-10 z-30 flex items-center gap-8">
              <Button
                type="button"
                variant="outline"
                className="flex h-20 w-20 items-center justify-center rounded-full shadow-md"
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide((value) => value - 1)}>
                <ChevronLeftIcon className="h-3/4 w-3/4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex h-20 w-20 items-center justify-center rounded-full shadow-md"
                disabled={currentSlide === slides.length - 1}
                onClick={() => setCurrentSlide((value) => value + 1)}>
                <ChevronRightIcon className="h-3/4 w-3/4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  )
})
