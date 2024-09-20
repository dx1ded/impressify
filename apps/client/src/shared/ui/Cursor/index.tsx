import { MousePointer2Icon } from "lucide-react"

interface CursorProps {
  name: string
  color: string
  x: number
  y: number
}

export function Cursor({ name, color, x, y }: CursorProps) {
  return (
    <div
      className="ease pointer-events-none absolute z-40 transition-all duration-300"
      style={{ top: `${y}px`, left: `${x}px` }}>
      <MousePointer2Icon className="h-4 w-4" style={{ color }} />
      <p
        className="absolute bottom-1 right-0.5 translate-x-full translate-y-full text-nowrap rounded px-1 py-0.5 text-xs text-white"
        style={{ backgroundColor: color }}>
        {name}
      </p>
    </div>
  )
}
