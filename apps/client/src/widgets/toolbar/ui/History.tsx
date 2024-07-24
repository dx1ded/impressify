import { Redo, Undo } from "lucide-react"

import { applyHistory, EDIT_ELEMENT_ID, TAKE_SCREENSHOT_ID } from "~/entities/presentation"
import { cn } from "~/shared/lib"
import { useAppDispatch, useAppSelector, useDebouncedFunctions } from "~/shared/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function History() {
  const { undoStack, redoStack } = useAppSelector((state) => state.presentation.history)
  const dispatch = useAppDispatch()
  const { call, flushWithPattern } = useDebouncedFunctions()

  return (
    <ToolbarGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(!undoStack.length && "pointer-events-none opacity-50")}>
            <ToolbarButton
              Icon={Undo}
              onClick={() => {
                flushWithPattern(EDIT_ELEMENT_ID)
                dispatch(applyHistory("UNDO"))
                call(TAKE_SCREENSHOT_ID)
              }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>Undo (⌘+Z)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(!redoStack.length && "pointer-events-none opacity-50")}>
            <ToolbarButton
              Icon={Redo}
              onClick={() => {
                flushWithPattern(EDIT_ELEMENT_ID)
                dispatch(applyHistory("REDO"))
                call(TAKE_SCREENSHOT_ID)
              }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>Redo (⌘+Y)</TooltipContent>
      </Tooltip>
    </ToolbarGroup>
  )
}
