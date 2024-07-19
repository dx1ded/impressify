import { DownloadIcon, Files, Info, PencilLine, SquarePlus, Trash2, UserPlus } from "lucide-react"
import { useDispatch } from "react-redux"

import { copySlide, DEFAULT_NAME, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import { CopyPresentation } from "~/features/copy-presentation"
import { CreatePresentation } from "~/features/create-presentation"
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
  const presentationId = useAppSelector((state) => state.presentation.presentation.id)
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const currentSlide = useAppSelector((state) => state.presentation.currentSlide)
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
        <MenubarItem>
          <UserPlus className="mr-2 h-5 w-5" />
          Share
        </MenubarItem>
        <MenubarItem>
          <DownloadIcon className="mr-2 h-5 w-5" />
          Download
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <PencilLine className="mr-2 h-5 w-5" />
          Rename
        </MenubarItem>
        <MenubarItem>
          <Trash2 className="mr-2 h-5 w-5" />
          Move to trash
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <Info className="mr-2 h-5 w-5" />
          Details
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
