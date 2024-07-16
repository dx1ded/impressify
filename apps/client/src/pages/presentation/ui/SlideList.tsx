import { SlideItem } from "~/pages/presentation/ui/SlideItem"
import { useAppSelector } from "~/shared/model"

export function SlideList() {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)

  return (
    <div className="flex flex-shrink-0 basis-52 flex-col gap-4 overflow-y-auto border-r pr-4">
      {slides.map((slide, i) => (
        <SlideItem key={slide.id} slide={slide} index={i} />
      ))}
    </div>
  )
}
