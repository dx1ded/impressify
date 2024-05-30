import { Type } from "lucide-react"

export function EditPresentationNameOption() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100">
      <Type className="h-4 w-4" />
      Rename
    </button>
  )
}
