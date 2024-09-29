import type { NormalizedYSlide } from "@server/hocuspocus/types"
import { motion } from "framer-motion"

import { SLIDE_HEIGHT, SLIDE_WIDTH } from "~/entities/presentation"
import { getAnimationProps } from "~/features/slideshow/lib"

interface SlideshowSlideProps {
  slide: NormalizedYSlide
}

const ASPECT_RATIO = `${SLIDE_WIDTH / SLIDE_HEIGHT}/1`

export function SlideshowSlide({ slide }: SlideshowSlideProps) {
  return (
    <motion.img
      key={slide.id}
      src={slide.thumbnailUrl}
      className="h-full select-none"
      alt="Slide"
      style={{ aspectRatio: ASPECT_RATIO }}
      transition={{ duration: 0.75 }}
      {...getAnimationProps(slide.transition)}
    />
  )
}
