import { PaintBucketIcon } from "lucide-react"
import type { ChangeEvent, ReactNode } from "react"

import {
  DEFAULT_BG_COLOR,
  SAVE_SLIDES_ID,
  SYNCHRONIZE_STATE_ID,
  TAKE_SCREENSHOT_ID,
  setBackground,
  setIsSaving,
} from "~/entities/presentation"
import { convertFileToDataUrl } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ColorPicker } from "~/shared/ui/ColorPicker"
import { Small } from "~/shared/ui/Typography"

export function ChangeSlideBackgroundDialog({ children }: { children: ReactNode }) {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const currentSlide = useAppSelector((state) => state.presentation.currentSlide)
  const dispatch = useAppDispatch()
  const { call } = useDebouncedFunctions()

  const slide = slides[currentSlide]
  if (!slide) return

  const changeBackground = (dataUrl: string) => {
    dispatch(setBackground(dataUrl))
    call(TAKE_SCREENSHOT_ID)
    call(SAVE_SLIDES_ID)
    dispatch(setIsSaving(true))
    call(SYNCHRONIZE_STATE_ID)
  }

  const fileChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (!files || !files.length) return
    const dataUrl = await convertFileToDataUrl(files[0])
    changeBackground(dataUrl)
  }

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{children}</DialogTrigger>
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
            <ColorPicker color={slide.bg} onChange={(color) => changeBackground(color)}>
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
              <input type="file" className="hidden" id="change-bgimage" accept="image/*" onChange={fileChangeHandler} />
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
  )
}
