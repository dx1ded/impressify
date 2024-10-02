import { shallowEqual } from "react-redux"

import { useAppSelector } from "~/shared/model"
import type { ModeProps } from "~/widgets/toolbar/lib"
import { ChangeSlideBackgroundDialog } from "~/features/change-slide-background"
import { ChangeSlideTransitionSheet } from "~/features/change-slide-transition"
import { ToolbarButton, ToolbarGroup, ToolbarSeparator } from "~/shared/ui/Toolbar"

export function CursorMode({ isActive }: ModeProps) {
  const { isEditor, isLoading } = useAppSelector(
    (state) => ({
      isEditor: state.presentationUser.isEditor,
      isLoading: state.presentation.isLoading,
    }),
    shallowEqual,
  )

  return (
    <div style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <ToolbarGroup>
        <ChangeSlideBackgroundDialog>
          <ToolbarButton disabled={!isEditor || isLoading}>Background</ToolbarButton>
        </ChangeSlideBackgroundDialog>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ChangeSlideTransitionSheet>
          <ToolbarButton disabled={!isEditor || isLoading}>Transition</ToolbarButton>
        </ChangeSlideTransitionSheet>
      </ToolbarGroup>
    </div>
  )
}
