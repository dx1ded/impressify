import { ArrowLeftRightIcon, Copy, DropletIcon, Plus, Trash2 } from "lucide-react"
import { shallowEqual } from "react-redux"

import { AddSlide } from "~/features/add-slide"
import { ChangeSlideBackgroundDialog } from "~/features/change-slide-background"
import { ChangeSlideTransitionSheet } from "~/features/change-slide-transition"
import { DeleteSlide } from "~/features/delete-slide"
import { DuplicateSlide } from "~/features/duplicate-slide/ui"
import { useAppSelector } from "~/shared/model"
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "~/shared/ui-kit/menubar"

export function Slide() {
  const { currentSlide, isEditor, isLoading } = useAppSelector(
    (state) => ({
      currentSlide: state.presentation.currentSlide,
      isEditor: state.presentationUser.isEditor,
      isLoading: state.presentation.isLoading,
    }),
    shallowEqual,
  )
  const slides = useAppSelector((state) => state.presentation.presentation.slides)

  const slide = slides[currentSlide]

  return (
    <MenubarMenu>
      <MenubarTrigger className="px-2 py-0.5">Slide</MenubarTrigger>
      <MenubarContent>
        <AddSlide>
          {(addSlide) => (
            <MenubarItem disabled={!isEditor || isLoading} onSelect={addSlide}>
              <Plus className="mr-2 h-5 w-5" />
              New slide
              <MenubarShortcut>Ctrl+M</MenubarShortcut>
            </MenubarItem>
          )}
        </AddSlide>
        <DuplicateSlide>
          {(duplicateSlide) => (
            <MenubarItem disabled={!isEditor || isLoading} onSelect={() => duplicateSlide(slide.id)}>
              <Copy className="mr-2 h-5 w-5" />
              Duplicate slide
            </MenubarItem>
          )}
        </DuplicateSlide>
        <DeleteSlide>
          {(deleteSlide) => (
            <MenubarItem disabled={!isEditor || isLoading} onSelect={() => deleteSlide(slide.id)}>
              <Trash2 className="mr-2 h-5 w-5" />
              Delete slide
            </MenubarItem>
          )}
        </DeleteSlide>
        <MenubarSeparator />
        <ChangeSlideBackgroundDialog>
          {/* e.preventDefault because MenubarItem has custom behaviour */}
          <MenubarItem disabled={!isEditor || isLoading} onSelect={(e) => e.preventDefault()}>
            <DropletIcon className="mr-2 h-5 w-5" />
            Change background
          </MenubarItem>
        </ChangeSlideBackgroundDialog>
        <ChangeSlideTransitionSheet>
          {/* e.preventDefault because MenubarItem has custom behaviour */}
          <MenubarItem disabled={!isEditor || isLoading} onSelect={(e) => e.preventDefault()}>
            <ArrowLeftRightIcon className="mr-2 h-5 w-5" />
            Transition
          </MenubarItem>
        </ChangeSlideTransitionSheet>
      </MenubarContent>
    </MenubarMenu>
  )
}
