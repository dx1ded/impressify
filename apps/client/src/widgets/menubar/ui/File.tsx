import { DownloadIcon, Files, Info, PencilLine, SquarePlus, Trash2, UserPlus } from "lucide-react"
import { shallowEqual } from "react-redux"

import { PresentationInfoDialog } from "~/entities/presentation"
import { DownloadPresentation } from "~/features/download-presentation"
import { DuplicatePresentation } from "~/features/duplicate-presentation"
import { CreatePresentation } from "~/features/create-presentation"
import { DeletePresentationAlert } from "~/features/delete-presentation"
import { DuplicateSlide } from "~/features/duplicate-slide"
import { RenamePresentationDialog } from "~/features/rename-presentation"
import { SharePresentationDialog } from "~/features/share-presentation"
import { useAppSelector, useDebouncedFunctions } from "~/shared/model"
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "~/shared/ui-kit/menubar"

export function File() {
  const { presentationId, presentationName, currentSlide, isEditor, isCreator, isLoading } = useAppSelector(
    (state) => ({
      presentationId: state.presentation.presentation.id,
      presentationName: state.presentation.presentation.name,
      currentSlide: state.presentation.currentSlide,
      isEditor: state.presentationUser.isEditor,
      isCreator: state.presentationUser.isCreator,
      isLoading: state.presentation.isLoading,
    }),
    shallowEqual,
  )
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const { flushAll, deleteAll } = useDebouncedFunctions()

  const slide = slides[currentSlide]

  return (
    <MenubarMenu>
      <MenubarTrigger className="px-2 py-0.5">File</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger>
            <SquarePlus className="mr-2 h-5 w-5" />
            New
          </MenubarSubTrigger>
          <MenubarSubContent>
            <CreatePresentation>
              {(createPresentation) => (
                <MenubarItem
                  disabled={isLoading}
                  onSelect={() => {
                    flushAll()
                    deleteAll()
                    createPresentation()
                  }}>
                  Presentation
                </MenubarItem>
              )}
            </CreatePresentation>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSub>
          <MenubarSubTrigger disabled={isLoading}>
            <Files className="mr-2 h-5 w-5" />
            Make a copy
          </MenubarSubTrigger>
          <MenubarSubContent>
            <DuplicateSlide>
              {(duplicateSlide) => (
                <MenubarItem disabled={!isEditor} onSelect={() => duplicateSlide(slide.id)}>
                  Current slide
                </MenubarItem>
              )}
            </DuplicateSlide>
            <DuplicatePresentation>
              {(duplicatePresentation) => (
                <MenubarItem onSelect={() => duplicatePresentation(presentationId)}>Entire presentation</MenubarItem>
              )}
            </DuplicatePresentation>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <SharePresentationDialog presentationId={presentationId}>
          {/* e.preventDefault because MenubarItem has custom behaviour */}
          <MenubarItem disabled={!isEditor || isLoading} onSelect={(e) => e.preventDefault()}>
            <UserPlus className="mr-2 h-5 w-5" />
            Share
          </MenubarItem>
        </SharePresentationDialog>
        <DownloadPresentation>
          {(downloadPresentation) => (
            <MenubarItem disabled={isLoading} onSelect={() => downloadPresentation(presentationName, slides)}>
              <DownloadIcon className="mr-2 h-5 w-5" />
              Download
            </MenubarItem>
          )}
        </DownloadPresentation>
        <MenubarSeparator />
        <RenamePresentationDialog>
          {(RenameDialog) => (
            <RenameDialog presentationId={presentationId} presentationName={presentationName}>
              {/* e.preventDefault because MenubarItem has custom behaviour */}
              <MenubarItem disabled={!isEditor || isLoading} onSelect={(e) => e.preventDefault()}>
                <PencilLine className="mr-2 h-5 w-5" />
                Rename
              </MenubarItem>
            </RenameDialog>
          )}
        </RenamePresentationDialog>
        <DeletePresentationAlert>
          {(DeleteAlert) => (
            <DeleteAlert presentationId={presentationId} beforeHandler={deleteAll}>
              {/* e.preventDefault because MenubarItem has custom behaviour */}
              <MenubarItem disabled={!isCreator || isLoading} onSelect={(e) => e.preventDefault()}>
                <Trash2 className="mr-2 h-5 w-5" />
                Move to trash
              </MenubarItem>
            </DeleteAlert>
          )}
        </DeletePresentationAlert>
        <MenubarSeparator />
        <PresentationInfoDialog presentationId={presentationId}>
          {/* e.preventDefault because MenubarItem has custom behaviour */}
          <MenubarItem disabled={isLoading} onSelect={(e) => e.preventDefault()}>
            <Info className="mr-2 h-5 w-5" />
            Details
          </MenubarItem>
        </PresentationInfoDialog>
      </MenubarContent>
    </MenubarMenu>
  )
}
