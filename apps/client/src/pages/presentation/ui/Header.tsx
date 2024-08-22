import { UserButton } from "@clerk/clerk-react"
import { shallowEqual } from "react-redux"

import { CHANGE_NAME_ID, MAX_NAME_LENGTH } from "~/entities/presentation"
import { useRenamePresentation } from "~/features/rename-presentation"
import { SharePresentationDialog } from "~/features/share-presentation"
import { ConnectionList } from "~/pages/presentation/ui/ConnectionList"
import { SavingIcon } from "~/pages/presentation/ui/SavingIcon"
import { Menubar } from "~/widgets/menubar"
import { useAppSelector, useDebouncedFunctions } from "~/shared/model"
import { Button } from "~/shared/ui-kit/button"
import { Skeleton } from "~/shared/ui-kit/skeleton"
import { Logo } from "~/shared/ui/Logo"
import { ResizableInput } from "~/shared/ui/ResizableInput"

const DEBOUNCED_CHANGE_NAME_TIME = 2000

export function Header() {
  const connectedUsers = useAppSelector((state) => state.user.connectedUsers)
  const { name, isLoading, presentationId } = useAppSelector(
    (state) => ({
      name: state.presentation.presentation.name,
      isLoading: state.presentation.isLoading,
      presentationId: state.presentation.presentation.id,
    }),
    shallowEqual,
  )
  const { renamePresentation } = useRenamePresentation()
  const { register } = useDebouncedFunctions()

  const debouncedChangeName = register(
    CHANGE_NAME_ID,
    (name: string) => renamePresentation(presentationId, name),
    DEBOUNCED_CHANGE_NAME_TIME,
    [presentationId],
  )

  return (
    <header className="flex items-center justify-between py-2">
      <div className="flex items-start gap-1.5">
        <Logo noText size={3.25} url="/home" />
        <div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Skeleton className="h-[1.875rem] w-32" />
            ) : (
              <ResizableInput
                maxLength={MAX_NAME_LENGTH}
                value={name}
                className="rounded border border-transparent bg-transparent px-1 py-0.5 font-medium hover:border-gray-300"
                data-toast="Presentation name"
                onChange={(e) => debouncedChangeName(e.target.value)}
              />
            )}
            <SavingIcon />
          </div>
          <Menubar />
        </div>
      </div>
      <div className="flex items-center">
        <ConnectionList className="mr-3 border-r border-gray-200 py-0.5 pr-3" users={connectedUsers} />
        <div className="flex items-center gap-2.5">
          <Button variant="outline" className="rounded-3xl px-6 font-semibold">
            Slideshow
          </Button>
          <SharePresentationDialog presentationId={presentationId}>
            <Button variant="blue" className="rounded-3xl px-6 font-semibold">
              Share
            </Button>
          </SharePresentationDialog>
          <UserButton appearance={{ elements: { userButtonAvatarBox: { width: "2rem", height: "2rem" } } }} />
        </div>
      </div>
    </header>
  )
}
