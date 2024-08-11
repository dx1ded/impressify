import { Redo, Undo } from "lucide-react"

import { HistoryRedo, HistoryUndo } from "~/features/history"
import { cn } from "~/shared/lib"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function History() {
  return (
    <ToolbarGroup>
      <HistoryUndo>
        {(undo, isActive) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(!isActive && "pointer-events-none opacity-50")}>
                <ToolbarButton Icon={Undo} onClick={() => undo()} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Undo (⌘+Z)</TooltipContent>
          </Tooltip>
        )}
      </HistoryUndo>
      <HistoryRedo>
        {(redo, isActive) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(!isActive && "pointer-events-none opacity-50")}>
                <ToolbarButton Icon={Redo} onClick={() => redo()} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Redo (⌘+Y)</TooltipContent>
          </Tooltip>
        )}
      </HistoryRedo>
    </ToolbarGroup>
  )
}
