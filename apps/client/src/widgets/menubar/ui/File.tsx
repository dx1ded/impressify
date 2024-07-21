import { DownloadIcon, Files, Info, PencilLine, SquarePlus, Trash2, UserPlus } from "lucide-react"
import { shallowEqual, useDispatch } from "react-redux"

import { copySlide, DEFAULT_NAME, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import { CopyPresentation } from "~/features/copy-presentation"
import { CreatePresentation } from "~/features/create-presentation"
import { DeletePresentationAlert } from "~/features/delete-presentation"
import { PresentationInfoDialog } from "~/features/get-presentation-info"
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
  const { presentationId, presentationName, currentSlide, slides } = useAppSelector(
    (state) => ({
      presentationId: state.presentation.presentation.id,
      presentationName: state.presentation.presentation.name,
      slides: state.presentation.presentation.slides,
      currentSlide: state.presentation.currentSlide,
    }),
    shallowEqual,
  )
  const dispatch = useDispatch()
  const { flush, flushAll, flushWithPattern, deleteAll } = useDebouncedFunctions()

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
                  onClick={() => {
                    flushAll()
                    deleteAll()
                    createPresentation(DEFAULT_NAME)
                  }}>
                  Presentation
                </MenubarItem>
              )}
            </CreatePresentation>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSub>
          <MenubarSubTrigger>
            <Files className="mr-2 h-5 w-5" />
            Make a copy
          </MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem
              onClick={() => {
                flushWithPattern(EDIT_ELEMENT_ID)
                flush(TAKE_SCREENSHOT_ID)
                dispatch(copySlide(slide.id))
              }}>
              Current slide
            </MenubarItem>
            <CopyPresentation>
              {(copyPresentation) => (
                <MenubarItem
                  onClick={() => {
                    flushAll()
                    copyPresentation(presentationId)
                  }}>
                  Entire presentation
                </MenubarItem>
              )}
            </CopyPresentation>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <SharePresentationDialog presentationId={presentationId}>
          {/* e.preventDefault because MenubarItem has custom behaviour */}
          <MenubarItem onSelect={(e) => e.preventDefault()}>
            <UserPlus className="mr-2 h-5 w-5" />
            Share
          </MenubarItem>
        </SharePresentationDialog>
        <MenubarItem>
          <DownloadIcon className="mr-2 h-5 w-5" />
          Download
        </MenubarItem>
        <MenubarSeparator />
        <RenamePresentationDialog>
          {(RenameDialog) => (
            <RenameDialog presentationId={presentationId} presentationName={presentationName}>
              {/* e.preventDefault because MenubarItem has custom behaviour */}
              <MenubarItem onSelect={(e) => e.preventDefault()}>
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
              <MenubarItem onSelect={(e) => e.preventDefault()}>
                <Trash2 className="mr-2 h-5 w-5" />
                Move to trash
              </MenubarItem>
            </DeleteAlert>
          )}
        </DeletePresentationAlert>
        <MenubarSeparator />
        <PresentationInfoDialog presentationId={presentationId}>
          {/* e.preventDefault because MenubarItem has custom behaviour */}
          <MenubarItem onSelect={(e) => e.preventDefault()}>
            <Info className="mr-2 h-5 w-5" />
            Details
          </MenubarItem>
        </PresentationInfoDialog>
      </MenubarContent>
    </MenubarMenu>
  )
}
