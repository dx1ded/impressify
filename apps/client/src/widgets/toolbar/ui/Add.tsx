import { PlusIcon } from "lucide-react"

import { addSlide, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import { useAppDispatch, useDebouncedFunctions } from "~/shared/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function Add() {
  const dispatch = useAppDispatch()
  const { flush, flushWithPattern } = useDebouncedFunctions()

  return (
    <ToolbarGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToolbarButton
            Icon={PlusIcon}
            onClick={() => {
              flush(TAKE_SCREENSHOT_ID)
              flushWithPattern(EDIT_ELEMENT_ID)
              dispatch(addSlide())
            }}
          />
        </TooltipTrigger>
        <TooltipContent>New slide (Ctrl+M)</TooltipContent>
      </Tooltip>
    </ToolbarGroup>
  )
}
