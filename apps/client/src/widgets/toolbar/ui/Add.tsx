import { PlusIcon } from "lucide-react"
import { shallowEqual } from "react-redux"

import { AddSlide } from "~/features/add-slide"
import { useAppSelector } from "~/shared/model"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { ToolbarButton, ToolbarGroup } from "~/shared/ui/Toolbar"

export function Add() {
  const { isEditor, isLoading } = useAppSelector(
    (state) => ({
      isEditor: state.user.isEditor,
      isLoading: state.presentation.isLoading,
    }),
    shallowEqual,
  )

  return (
    <ToolbarGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <AddSlide>
            {(addSlide) => <ToolbarButton Icon={PlusIcon} disabled={!isEditor || isLoading} onClick={addSlide} />}
          </AddSlide>
        </TooltipTrigger>
        <TooltipContent>New slide (Ctrl+M)</TooltipContent>
      </Tooltip>
    </ToolbarGroup>
  )
}
