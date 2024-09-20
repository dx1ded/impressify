import type { ModeProps } from "~/widgets/toolbar/lib"
import { ChangeSlideBackgroundDialog } from "~/features/change-slide-background"
import { ChangeSlideTransitionSheet } from "~/features/change-slide-transition"
import { ToolbarButton, ToolbarGroup, ToolbarSeparator } from "~/shared/ui/Toolbar"

export function CursorMode({ isActive }: ModeProps) {
  return (
    <div style={{ display: isActive ? "flex" : "none" }} aria-hidden={isActive}>
      <ToolbarGroup>
        <ChangeSlideBackgroundDialog>
          <ToolbarButton>Background</ToolbarButton>
        </ChangeSlideBackgroundDialog>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ChangeSlideTransitionSheet>
          <ToolbarButton>Transition</ToolbarButton>
        </ChangeSlideTransitionSheet>
      </ToolbarGroup>
    </div>
  )
}
