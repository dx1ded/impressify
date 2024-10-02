import type { UserAwareness } from "@server/hocuspocus/types"

import { cn } from "~/shared/lib"
import { useAppSelector } from "~/shared/model"
import { Tooltip, TooltipTrigger, TooltipContent } from "~/shared/ui-kit/tooltip"
import { Small } from "~/shared/ui/Typography"

const MAX_DISPLAYED_USERS = 4

interface ConnectionListProps {
  size?: "lg" | "sm"
  users: UserAwareness[]
  className?: string
}

export function ConnectionList({ className, users, size = "lg" }: ConnectionListProps) {
  const userId = useAppSelector((state) => state.user.id)

  const plusCount = users.length - MAX_DISPLAYED_USERS

  return (
    <div className={cn("flex items-center", size === "sm" ? "gap-1" : "gap-3", className)}>
      {plusCount > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "bg-primary flex items-center justify-center rounded-full",
                size === "sm" ? "h-6 w-6" : "h-8 w-8",
              )}>
              <Small className={cn("text-white", size === "sm" && "text-[0.625rem]")}>+{plusCount}</Small>
            </div>
          </TooltipTrigger>
          <TooltipContent>{plusCount} more users</TooltipContent>
        </Tooltip>
      )}
      {users.map(
        (user, index) =>
          index < MAX_DISPLAYED_USERS &&
          user.id !== userId && (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <img
                  className={cn("rounded-full", size === "sm" ? "h-6 w-6 border" : "h-8 w-8 border-2")}
                  style={{ borderColor: user.color }}
                  src={user.profilePicUrl}
                  alt={`${user.name} avatar`}
                />
              </TooltipTrigger>
              <TooltipContent>{user.name}</TooltipContent>
            </Tooltip>
          ),
      )}
    </div>
  )
}
