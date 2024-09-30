import { PopoverClose } from "@radix-ui/react-popover"
import { AppWindow, EllipsisVertical, PanelRightIcon, Trash2, Type, Users } from "lucide-react"
import type { MouseEvent } from "react"
import { useNavigate } from "react-router-dom"

import { type FindPresentationItem, formatDate } from "~/entities/presentation"
import type { IDeleteAlert } from "~/features/delete-presentation"
import type { IRenameDialog } from "~/features/rename-presentation"
import type { ViewTypes } from "~/features/sort-presentations"
import { cn } from "~/shared/lib"
import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui-kit/popover"
import { Small } from "~/shared/ui/Typography"

interface PresentationPreviewProps {
  presentation: FindPresentationItem
  view: ViewTypes
  isEditor: boolean
  isCreator: boolean
  DeleteAlert: IDeleteAlert
  RenameDialog: IRenameDialog
}

export function PresentationPreview({
  presentation,
  view,
  isEditor,
  isCreator,
  DeleteAlert,
  RenameDialog,
}: PresentationPreviewProps) {
  const navigate = useNavigate()

  const slide = presentation.slides[0]
  const record = presentation.history.records[0]

  const clickHandler = (e: MouseEvent<HTMLDivElement>) => {
    const element = e.target as HTMLElement
    if (!element.dataset.preview) return
    navigate(`/presentation/${presentation.id}`)
  }

  return (
    <div
      className={cn(
        "cursor-pointer rounded border border-gray-200 shadow [&>*]:pointer-events-none",
        view === "list" && "rounded-2xl",
      )}
      role="link"
      tabIndex={0}
      aria-label="Open the presentation"
      data-preview
      onClick={clickHandler}>
      <img
        src={slide.thumbnailUrl}
        className={cn("h-36 w-full rounded-t border-b", view === "list" && "hidden")}
        alt="Presentation thumbnail"
      />
      <div className={cn("flex flex-col gap-2 p-3 pr-1.5", view === "list" && "flex-row items-center p-5")}>
        <Small className={cn("block truncate", view === "list" && "!text-[1rem]")}>{presentation.name}</Small>
        <div className={cn("flex items-center gap-1", view === "list" && "ml-auto gap-5")}>
          <PanelRightIcon className={cn("text-primary h-4 w-4", view === "list" && "hidden")} />
          {presentation.users.length > 1 && <Users className="text-primary h-4 w-4" />}
          {record && <p className="text-grayish text-xs font-medium">Opened {formatDate(record.lastOpened)}</p>}
          <div className="ml-auto [&>*]:pointer-events-auto">
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className={cn("flex h-4 w-4 items-center", view === "list" && "h-5 w-5")}>
                  <EllipsisVertical className="h-full w-full" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-52 px-0 py-2">
                {/* Didn't make `isEditor` true if user is creator because it would be too complex .filter function */}
                {(isEditor || isCreator) && (
                  <RenameDialog presentationId={presentation.id} presentationName={presentation.name}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100">
                      <Type className="h-4 w-4" />
                      Rename
                    </button>
                  </RenameDialog>
                )}
                {isCreator && (
                  <DeleteAlert presentationId={presentation.id}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </DeleteAlert>
                )}
                <PopoverClose asChild>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100"
                    onClick={() => window.open(`/presentation/${presentation.id}`, "_blank")}>
                    <AppWindow className="h-4 w-4" />
                    Open in new window
                  </button>
                </PopoverClose>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
