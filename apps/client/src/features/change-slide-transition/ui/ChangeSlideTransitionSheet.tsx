import type { YPresentation } from "@server/hocuspocus/types"
import type { ReactNode } from "react"

import { Transition } from "~/__generated__/graphql"
import { setTransition } from "~/entities/presentation"
import { useAppDispatch, useAppSelector, useYjs } from "~/shared/model"
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
  const { getMap } = useYjs()

  const slide = slides[currentSlide]
  if (!slide) return

  const changeHandler = (value: Transition) => {
    dispatch(setTransition(value))
    getMap<YPresentation>().get("slides")?.get(currentSlide).set("transition", value)
  }

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
          <Select defaultValue={slide.transition} onValueChange={changeHandler}>
            <SelectTrigger>
              <SelectValue placeholder="Transition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Transition.None}>None</SelectItem>
              <SelectItem value={Transition.Fade}>Fade</SelectItem>
              <SelectItem value={Transition.SlideFromLeft}>Slide from left</SelectItem>
              <SelectItem value={Transition.SlidesFromRight}>Slide from right</SelectItem>
              <SelectItem value={Transition.Flip}>Flip</SelectItem>
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
