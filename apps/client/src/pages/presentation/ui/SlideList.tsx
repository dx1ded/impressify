import { CopyIcon, Trash2Icon } from "lucide-react"

export function SlideList() {
  return (
    <div className="flex flex-shrink-0 basis-52 flex-col gap-4 overflow-y-auto border-r pr-4">
      <div className="group flex h-24 flex-shrink-0 gap-2">
        <div className="flex h-full flex-col items-center gap-2">
          <small className="mb-auto font-bold">1</small>
          <button
            type="button"
            className="invisible h-[1.125rem] w-[1.125rem] opacity-0 transition duration-300 group-hover:visible group-hover:opacity-100">
            <CopyIcon className="h-full w-full" />
          </button>
          <button
            type="button"
            className="invisible h-[1.125rem] w-[1.125rem] opacity-0 transition duration-300 group-hover:visible group-hover:opacity-100">
            <Trash2Icon className="h-full w-full" />
          </button>
        </div>
        <div className="flex-1 rounded-md border-2 border-blue-500 bg-white" />
      </div>
    </div>
  )
}
