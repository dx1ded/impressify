import { UserButton } from "@clerk/clerk-react"
import type { YPresentation } from "@server/hocuspocus/types"
import { memo } from "react"
import { shallowEqual } from "react-redux"
import { useDebouncedCallback } from "use-debounce"

import { MAX_NAME_LENGTH, NOT_SELECTED, setSelectedId } from "~/entities/presentation"
import { SharePresentationDialog } from "~/features/share-presentation"
import { Slideshow } from "~/features/slideshow"
import { ConnectionList } from "~/pages/presentation/ui/ConnectionList"
import { SavingIcon } from "~/pages/presentation/ui/SavingIcon"
import { Menubar } from "~/widgets/menubar"
import { useAppDispatch, useAppSelector, useYjs } from "~/shared/model"
import { Button } from "~/shared/ui-kit/button"
import { Skeleton } from "~/shared/ui-kit/skeleton"
import { Logo } from "~/shared/ui/Logo"
import { ResizableInput } from "~/shared/ui/ResizableInput"

const DEBOUNCE_CHANGE_NAME_TIME = 200

export const Header = memo(function Header() {
  const connectedUsers = useAppSelector((state) => state.presentationUser.connectedUsers)
  const { name, presentationId, isLoading, isEditor } = useAppSelector(
    (state) => ({
      name: state.presentation.presentation.name,
      presentationId: state.presentation.presentation.id,
      isLoading: state.presentation.isLoading,
      isEditor: state.presentationUser.isEditor,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()
  const { getMap } = useYjs()

  const debouncedChangeName = useDebouncedCallback((newName: string) => {
    const yPresentation = getMap<YPresentation>()
    const yName = yPresentation.get("name")!
    if (name !== newName) {
      yName.delete(0, name.length)
      yName.insert(0, newName)
    }
  }, DEBOUNCE_CHANGE_NAME_TIME)

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
                className="rounded border border-transparent bg-transparent px-1 py-0.5 font-medium hover:border-gray-300"
                value={name}
                maxLength={MAX_NAME_LENGTH}
                disabled={!isEditor}
                onChange={(e) => debouncedChangeName(e.target.value)}
                onFocus={() => dispatch(setSelectedId(NOT_SELECTED))}
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
          <Slideshow>
            {(startSlideshow) => (
              <Button
                variant="outline"
                className="rounded-3xl px-6 font-semibold"
                disabled={isLoading}
                onClick={() => startSlideshow()}>
                Slideshow
              </Button>
            )}
          </Slideshow>
          <SharePresentationDialog presentationId={presentationId}>
            <Button variant="blue" className="rounded-3xl px-6 font-semibold" disabled={!isEditor}>
              Share
            </Button>
          </SharePresentationDialog>
          <UserButton appearance={{ elements: { userButtonAvatarBox: { width: "2rem", height: "2rem" } } }} />
        </div>
      </div>
    </header>
  )
})
