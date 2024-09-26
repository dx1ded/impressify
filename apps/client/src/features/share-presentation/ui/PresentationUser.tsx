import { useMutation } from "@apollo/client"
import { useUser } from "@clerk/clerk-react"
import { DropdownMenuArrow, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import type { YPresentation } from "@server/hocuspocus/types"
import { EllipsisVerticalIcon } from "lucide-react"

import {
  type ChangeUserRoleMutation,
  type ChangeUserRoleMutationVariables,
  type GetPresentationDataQuery,
  type Presentation,
  Result,
  Role,
} from "~/__generated__/graphql"
import { CHANGE_USER_ROLE, GET_PRESENTATION_DATA } from "~/features/share-presentation/api"
import { cn } from "~/shared/lib"
import { useYjs } from "~/shared/model"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "~/shared/ui-kit/dropdown-menu"
import { Small, Text } from "~/shared/ui/Typography"

export type IPresentationUser = NonNullable<GetPresentationDataQuery["getPresentation"]>["users"][number]

interface PresentationUserProps {
  user: IPresentationUser
  isCurrentUserCreator: boolean
  presentationId: Presentation["id"]
}

export function PresentationUser({ user, isCurrentUserCreator, presentationId }: PresentationUserProps) {
  const { user: currentUser } = useUser()
  const [changeUserRole] = useMutation<ChangeUserRoleMutation, ChangeUserRoleMutationVariables>(CHANGE_USER_ROLE)
  const { getMap } = useYjs()

  const selectHandler = async (e: Event) => {
    const target = e.target as HTMLDivElement
    const role = target.dataset.value as Role
    await changeUserRole({
      variables: { presentationId, userId: user.id, role },
      update: (cache, query) => {
        if (query.data?.changeUserRole !== Result.Success) return
        const cachedData = cache.readQuery<GetPresentationDataQuery>({
          query: GET_PRESENTATION_DATA,
          variables: { presentationId },
        })

        if (cachedData?.getPresentation) {
          const updatedUsers = [...cachedData.getPresentation.users].map((_user) =>
            _user.id === user.id ? { ..._user, role } : _user,
          )

          getMap<YPresentation>()
            .get("users")
            ?.toArray()
            .find((_user) => _user.get("id") === user.id)
            ?.set("role", role)

          cache.writeQuery<GetPresentationDataQuery>({
            query: GET_PRESENTATION_DATA,
            data: {
              getPresentation: {
                ...cachedData.getPresentation,
                users: updatedUsers,
              },
            },
            variables: { presentationId },
          })
        }
      },
    })
  }

  // current user is owner but this current iteration is not them
  const isOwnerAndNotIteration = isCurrentUserCreator && user.id !== currentUser?.id

  return (
    <div className="group flex min-w-0 items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <img src={user.props.profilePicUrl} className="h-8 w-8 rounded-full" alt={user.props.name} />
        <div className="min-w-0">
          <Small as="p" className="mb-0.5 truncate">
            {user.props.name} {user.id === currentUser?.id ? "(you)" : ""}
          </Small>
          <p className="truncate text-xs font-normal text-gray-500">{user.props.email}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Small className={cn("text-grayish font-normal", isOwnerAndNotIteration && "group-hover:mr-2")}>
          {user.role === Role.Creator ? "Creator" : user.role === Role.Editor ? "Editor" : "Reader"}
        </Small>
        {isOwnerAndNotIteration && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="invisible flex h-7 w-0 scale-0 items-center justify-center rounded-full opacity-0 transition-all hover:bg-gray-100 group-hover:visible group-hover:w-7 group-hover:scale-100 group-hover:opacity-100">
                <EllipsisVerticalIcon className="h-4 w-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2" side="right">
              <Text className="mb-0.5 font-medium">Make as</Text>
              <DropdownMenuItem
                className="cursor-pointer p-1 text-gray-600 hover:bg-gray-100"
                data-value={Role.Reader}
                onSelect={selectHandler}>
                Reader
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer p-1 text-gray-600 hover:bg-gray-100"
                data-value={Role.Editor}
                onSelect={selectHandler}>
                Editor
              </DropdownMenuItem>
              <DropdownMenuArrow className="!text-pink-500" fill="#dee5ee" width={12} height={6} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
