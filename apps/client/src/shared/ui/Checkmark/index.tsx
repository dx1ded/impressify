import { Check } from "lucide-react"

interface CheckmarkProps {
  /**
   * width in rem
   */
  width?: number
  /**
   * height in rem
   */
  height?: number
}

export function Checkmark({ width, height }: CheckmarkProps) {
  return (
    <div
      className="bg-primary flex items-center justify-center rounded-full"
      style={{
        width: width ? `${width}rem` : "1rem",
        height: height ? `${height}rem` : "1rem",
      }}>
      <Check width="50%" height="50%" className="text-white" />
    </div>
  )
}
