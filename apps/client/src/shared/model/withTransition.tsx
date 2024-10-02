import { motion, MotionProps } from "framer-motion"
import { ComponentType } from "react"

export const withTransition = <P extends object>(WrappedComponent: ComponentType<P>, motionProps?: MotionProps) => {
  return function (props: P) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 1 } }}
        {...motionProps}>
        <WrappedComponent {...props} />
      </motion.div>
    )
  }
}
