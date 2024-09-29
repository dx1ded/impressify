import type { AnimationProps } from "framer-motion"

import { Transition } from "~/__generated__/graphql"

export function getAnimationProps(transition: Transition): AnimationProps {
  switch (transition) {
    case Transition.Fade:
      return { initial: { opacity: 0 }, animate: { opacity: 1 } }
    case Transition.SlideFromLeft:
      return { initial: { x: "-100%" }, animate: { x: 0 } }
    case Transition.SlideFromRight:
      return { initial: { x: "100%" }, animate: { x: 0 } }
    case Transition.Flip:
      return { initial: { rotateY: 180 }, animate: { rotateY: 0 } }
    default:
      return {}
  }
}
