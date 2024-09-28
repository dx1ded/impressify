import { useUser } from "@clerk/clerk-react"
import { DropdownMenuArrow, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { EllipsisVerticalIcon } from "lucide-react"

import { type GetSharePresentationInfoQuery, type Presentation, Role } from "~/__generated__/graphql"
import { useChangeUserRole, useKickUser } from "~/features/share-presentation/model"
import { cn } from "~/shared/lib"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/shared/ui-kit/dropdown-menu"
import { Small } from "~/shared/ui/Typography"

export type IPresentationUser = NonNullable<GetSharePresentationInfoQuery["getPresentation"]>["users"][number]

interface PresentationUserProps {
  user: IPresentationUser
  isCurrentUserCreator: boolean
  presentationId: Presentation["id"]
}

export function PresentationUser({ user, isCurrentUserCreator, presentationId }: PresentationUserProps) {
  const { user: currentUser } = useUser()
  const changeUserRole = useChangeUserRole()
  const kickUser = useKickUser()

  // current user is creator but this current iteration is not them
  const isCreator = isCurrentUserCreator && user.props.id !== currentUser?.id

  return (
    <div className="group flex min-w-0 items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <img src={user.props.profilePicUrl} className="h-8 w-8 rounded-full" alt={user.props.name} />
        <div className="min-w-0">
          <Small as="p" className="mb-0.5 truncate">
            {user.props.name} {user.props.id === currentUser?.id ? "(you)" : ""}
          </Small>
          <p className="truncate text-xs font-normal text-gray-500">{user.props.email}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Small className={cn("text-grayish font-normal", isCreator && "group-hover:mr-2")}>
          {user.role === Role.Creator ? "Creator" : user.role === Role.Editor ? "Editor" : "Reader"}
        </Small>
        {isCreator && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="invisible flex h-7 w-0 scale-0 items-center justify-center rounded-full opacity-0 transition-all hover:bg-gray-100 group-hover:visible group-hover:w-7 group-hover:scale-100 group-hover:opacity-100">
                <EllipsisVerticalIcon className="h-4 w-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2" side="right">
              <DropdownMenuItem
                className="cursor-pointer px-1.5 py-1 text-gray-600 hover:bg-gray-100 "
                disabled={user.role === Role.Reader}
                onSelect={() =>
                  changeUserRole({
                    userId: user.props.id,
                    presentationId,
                    role: Role.Reader,
                  })
                }>
                Reader
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer px-1.5 py-1 text-gray-600 hover:bg-gray-100"
                disabled={user.role === Role.Editor}
                onSelect={() =>
                  changeUserRole({
                    userId: user.props.id,
                    presentationId,
                    role: Role.Editor,
                  })
                }>
                Editor
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer px-1.5 py-1 text-gray-600 hover:bg-red-600 hover:text-white"
                onSelect={() =>
                  kickUser({
                    userId: user.props.id,
                    presentationId,
                  })
                }>
                Kick
              </DropdownMenuItem>
              <DropdownMenuArrow className="!text-pink-500" fill="#dee5ee" width={12} height={6} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
