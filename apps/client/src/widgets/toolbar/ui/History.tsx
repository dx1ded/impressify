import { Redo, Undo } from "lucide-react"
import { shallowEqual } from "react-redux"

import { RedoHistory, UndoHistory } from "~/features/apply-history"
import { cn } from "~/shared/lib"
import { useAppSelector } from "~/shared/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function History() {
  const { isEditor, isLoading } = useAppSelector(
    (state) => ({
      isEditor: state.user.isEditor,
      isLoading: state.presentation.isLoading,
    }),
    shallowEqual,
  )

  return (
    <ToolbarGroup>
      <UndoHistory>
        {(undo, isActive) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(!isActive && "pointer-events-none opacity-50")}>
                <ToolbarButton Icon={Undo} disabled={!isEditor || isLoading} onClick={() => undo()} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Undo (⌘+Z)</TooltipContent>
          </Tooltip>
        )}
      </UndoHistory>
      <RedoHistory>
        {(redo, isActive) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(!isActive && "pointer-events-none opacity-50")}>
                <ToolbarButton Icon={Redo} disabled={!isEditor || isLoading} onClick={() => redo()} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Redo (⌘+Y)</TooltipContent>
          </Tooltip>
        )}
      </RedoHistory>
    </ToolbarGroup>
  )
}
