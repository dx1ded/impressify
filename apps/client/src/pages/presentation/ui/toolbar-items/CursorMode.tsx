import { PaintBucketIcon } from "lucide-react"
import type { ChangeEvent } from "react"
import { shallowEqual } from "react-redux"

import { DEFAULT_BG_COLOR, setBackground, setTransition, useScreenshot } from "~/entities/presentation"
import type { ModeProps } from "~/pages/presentation/lib"
import { convertFileToDataUrl } from "~/shared/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"
import { Button } from "~/shared/ui-kit/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui-kit/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/shared/ui-kit/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "~/shared/ui-kit/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ColorPicker } from "~/shared/ui/ColorPicker"
import { ToolbarButton, ToolbarGroup, ToolbarSeparator } from "~/shared/ui/Toolbar"
import { Small } from "~/shared/ui/Typography"

export function CursorMode({ isActive }: ModeProps) {
  const { presentation, currentSlide } = useAppSelector(
    (state) => ({
      presentation: state.presentation.presentation,
      currentSlide: state.presentation.currentSlide,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()
  const { takeScreenshot } = useScreenshot()

  const slide = presentation.slides[currentSlide]
  if (!slide) return

  const changeBackground = (dataUrl: string) => {
    dispatch(setBackground(dataUrl))
    if (takeScreenshot) takeScreenshot()
  }

  const fileChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (!files || !files.length) return
    const dataUrl = await convertFileToDataUrl(files[0])
    changeBackground(dataUrl)
  }

  return (
    <div style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <ToolbarGroup>
        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <ToolbarButton>Background</ToolbarButton>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Slide background</TooltipContent>
          </Tooltip>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Background</DialogTitle>
              <DialogDescription className="sr-only">Use this dialog to change background</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Small className="text-grayish">Color</Small>
                <ColorPicker color={slide.bgColor} onChange={(color) => changeBackground(color)}>
                  <Button variant="outline" size="sm" className="rounded-b-none">
                    <PaintBucketIcon className="h-5 w-5" />
                  </Button>
                </ColorPicker>
              </div>
              <div className="flex items-center justify-between">
                <Small className="text-grayish">Image</Small>
                <label htmlFor="change-bgimage">
                  <Button variant="outline" size="sm" asChild>
                    <span>Choose image</span>
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    id="change-bgimage"
                    accept="image/*"
                    onChange={fileChangeHandler}
                  />
                </label>
              </div>
              <div className="flex items-center justify-between">
                <Small className="text-grayish">Reset to theme</Small>
                <Button variant="outline" size="sm" onClick={() => changeBackground(DEFAULT_BG_COLOR)}>
                  Reset
                </Button>
              </div>
            </div>
            <DialogFooter className="border-t border-gray-100 pt-3">
              <DialogClose asChild>
                <Button variant="blue" className="px-6">
                  Done
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <Sheet>
          <Tooltip>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>
                <ToolbarButton>Transition</ToolbarButton>
              </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent>Slide transition</TooltipContent>
          </Tooltip>
          <SheetContent>
            <SheetHeader>
              <DialogTitle>Slide transition</DialogTitle>
              <SheetDescription>
                Transition will be applied in presentation mode when switching to the slide.
              </SheetDescription>
            </SheetHeader>
            <div className="mb-3 mt-7">
              <Small className="mb-1.5 block">Type</Small>
              <Select defaultValue={slide.transition} onValueChange={(value) => dispatch(setTransition(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Transition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="slide_from_right">Slide from right</SelectItem>
                  <SelectItem value="slide_from_left">Slide from left</SelectItem>
                  <SelectItem value="flip">Flip</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="blue" size="sm" className="px-5">
                  Done
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </ToolbarGroup>
    </div>
  )
}
