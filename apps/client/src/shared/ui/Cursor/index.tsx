import { MousePointer2Icon } from "lucide-react"

interface CursorProps {
  name: string
  x: number
  y: number
}

export function Cursor({ name, x, y }: CursorProps) {
  return (
    <div className="pointer-events-none absolute z-40" style={{ top: `${y}px`, left: `${x}px` }}>
      <MousePointer2Icon className="h-4 w-4 text-purple-500" />
      <p className="absolute bottom-1 right-0.5 translate-x-full translate-y-full text-nowrap rounded bg-purple-500 px-1 py-0.5 text-xs text-white">
        {name}
      </p>
    </div>
  )
}
