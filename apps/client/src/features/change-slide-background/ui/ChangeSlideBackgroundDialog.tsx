import type { YPresentation } from "@server/hocuspocus/types"
import { PaintBucketIcon } from "lucide-react"
import type { ChangeEvent, ReactNode } from "react"
import { shallowEqual } from "react-redux"
import { toast } from "sonner"

import { DEFAULT_BG_COLOR, TAKE_SCREENSHOT_ID, setBackground, MAX_IMAGE_SIZE } from "~/entities/presentation"
import { convertFileToDataUrl, uploadImageToStorage } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions, useYjs } from "~/shared/model"
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
import { Toaster } from "~/shared/ui-kit/sonner"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ColorPicker } from "~/shared/ui/ColorPicker"
import { Small } from "~/shared/ui/Typography"

export function ChangeSlideBackgroundDialog({ children }: { children: ReactNode }) {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const { currentSlide, presentationId } = useAppSelector(
    (state) => ({
      currentSlide: state.presentation.currentSlide,
      presentationId: state.presentation.presentation.id,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()
  const { call } = useDebouncedFunctions()
  const { getMap } = useYjs()

  const slide = slides[currentSlide]
  if (!slide) return

  const changeBackground = (bg: string) => {
    const newBg = bg === "transparent" ? "#ffffff" : bg
    dispatch(setBackground(newBg))
    getMap<YPresentation>().get("slides")?.get(currentSlide).set("bg", newBg)
    call(TAKE_SCREENSHOT_ID)
  }

  const fileChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (!files || !files.length) return
    if (files[0].size > MAX_IMAGE_SIZE)
      return toast(`File cannot be larger than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`, { position: "top-right" })
    const dataUrl = await convertFileToDataUrl(files[0])
    const uploadedImageUrl = await uploadImageToStorage(dataUrl, `${presentationId}/${slide.id}/bg`)
    changeBackground(uploadedImageUrl)
  }

  return (
    <Dialog>
      <Toaster />
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
