import { Redo, Undo } from "lucide-react"

import { applyHistory } from "~/entities/presentation"
import { cn } from "~/shared/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function History() {
  const { undoStack, redoStack } = useAppSelector((state) => state.presentation.history)
  const dispatch = useAppDispatch()

  return (
    <ToolbarGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(!undoStack.length && "pointer-events-none opacity-50")}>
            <ToolbarButton Icon={Undo} onClick={() => dispatch(applyHistory("UNDO"))} />
          </div>
        </TooltipTrigger>
        <TooltipContent>Undo (⌘+Z)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(!redoStack.length && "pointer-events-none opacity-50")}>
            <ToolbarButton Icon={Redo} onClick={() => dispatch(applyHistory("REDO"))} />
          </div>
        </TooltipTrigger>
        <TooltipContent>Redo (⌘+Y)</TooltipContent>
      </Tooltip>
    </ToolbarGroup>
  )
}
