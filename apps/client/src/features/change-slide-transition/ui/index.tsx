import type { ReactNode } from "react"

import { setTransition } from "~/entities/presentation"
import { useAppDispatch, useAppSelector } from "~/shared/model"
import { Button } from "~/shared/ui-kit/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/shared/ui-kit/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/shared/ui-kit/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { Small } from "~/shared/ui/Typography"

export function ChangeSlideTransitionSheet({ children }: { children: ReactNode }) {
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const currentSlide = useAppSelector((state) => state.presentation.currentSlide)
  const dispatch = useAppDispatch()

  const slide = slides[currentSlide]
  if (!slide) return

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>{children}</SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>Slide transition</TooltipContent>
      </Tooltip>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Slide transition</SheetTitle>
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
  )
}
