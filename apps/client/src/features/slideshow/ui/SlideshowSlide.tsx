import { motion } from "framer-motion"

import { type SlideProps, SLIDE_HEIGHT, SLIDE_WIDTH } from "~/entities/presentation"
import { getAnimationProps } from "~/features/slideshow/lib"

interface SlideshowSlideProps {
  slide: SlideProps
}

const ASPECT_RATIO = `${SLIDE_WIDTH / SLIDE_HEIGHT}/1`
const DEFAULT_DURATION = 0.6

export function SlideshowSlide({ slide }: SlideshowSlideProps) {
  return (
    <motion.img
      key={slide.id}
      src={slide.thumbnailUrl}
      className="block w-full select-none"
      alt="Slide"
      style={{ aspectRatio: ASPECT_RATIO }}
      transition={{ duration: DEFAULT_DURATION }}
      {...getAnimationProps(slide.transition)}
    />
  )
}
