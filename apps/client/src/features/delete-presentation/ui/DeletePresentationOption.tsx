import { Trash2 } from "lucide-react"

export function DeletePresentationOption() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100">
      <Trash2 className="h-4 w-4" />
      Delete
    </button>
  )
}
