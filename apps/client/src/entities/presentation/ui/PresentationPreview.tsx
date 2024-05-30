import { AppWindow, EllipsisVertical, Users } from "lucide-react"

import { DeletePresentationOption } from "~/features/delete-presentation"
import { EditPresentationNameOption } from "~/features/edit-presentation-name"
import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui-kit/popover"
import { Small } from "~/shared/ui/Typography"

export function PresentationPreview() {
  return (
    <div className="rounded border border-gray-200 shadow">
      <img
        src="https://ssl.gstatic.com/docs/templates/thumbnails/1E6hdH0vSvl4KN-Qw-iY2PZ7Z7tbDtu8RCQdcPAgp4SY_400.png"
        className="w-full rounded-t"
        alt="Presentation thumbnail"
      />
      <div className="p-4 pr-1.5">
        <Small className="mb-2.5 block truncate pb-0.5">Inquiry Assignment - Before reading asdasd a das</Small>
        <div className="flex items-center gap-1">
          <Users className="text-primary h-4 w-4" />
          <p className="text-grayish text-xs font-medium">Opened 8.06 pm</p>
          <div className="ml-auto">
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="flex h-4 w-4 items-center">
                  <EllipsisVertical className="h-full w-full" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-52 px-0 py-2">
                <EditPresentationNameOption />
                <DeletePresentationOption />
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100">
                  <AppWindow className="h-4 w-4" />
                  Open in new window
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
