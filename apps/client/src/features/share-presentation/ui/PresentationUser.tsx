import { useMutation } from "@apollo/client"
import { useUser } from "@clerk/clerk-react"
import { DropdownMenuArrow, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import type { YPresentation } from "@server/hocuspocus/types"
import { EllipsisVerticalIcon } from "lucide-react"

import {
  type GetPresentationDataQuery,
  type Presentation,
  Permission,
  ChangeUserRoleMutation,
  ChangeUserRoleMutationVariables,
} from "~/__generated__/graphql"
import type { UserRole } from "~/entities/user"
import { CHANGE_USER_ROLE, GET_PRESENTATION_DATA } from "~/features/share-presentation/api"
import type { IPresentationUser } from "~/features/share-presentation/lib"
import { cn } from "~/shared/lib"
import { useYjs } from "~/shared/model"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "~/shared/ui-kit/dropdown-menu"
import { Small, Text } from "~/shared/ui/Typography"

interface PresentationUserProps {
  user: IPresentationUser
  role: UserRole
  isCurrentUserOwner: boolean
  presentationId: Presentation["id"]
}

export function PresentationUser({ user, role, isCurrentUserOwner, presentationId }: PresentationUserProps) {
  const { user: currentUser } = useUser()
  const [changeUserRole] = useMutation<ChangeUserRoleMutation, ChangeUserRoleMutationVariables>(CHANGE_USER_ROLE)
  const { provider, getMap } = useYjs()

  const selectHandler = async (e: Event) => {
    const target = e.target as HTMLDivElement
    const permission = target.dataset.value as Permission
    await changeUserRole({
      variables: { presentationId, userId: user.id, permission },
      update: (cache) => {
        const cachedData = cache.readQuery<GetPresentationDataQuery>({
          query: GET_PRESENTATION_DATA,
          variables: { presentationId },
        })

        if (cachedData?.getPresentation) {
          let updatedReaders = [...cachedData.getPresentation.readers]
          let updatedEditors = [...cachedData.getPresentation.editors]
          const yReaders = getMap<YPresentation>().get("readers")
          const yEditors = getMap<YPresentation>().get("editors")

          if (permission === Permission.Read) {
            updatedReaders.push(user)
            updatedEditors = updatedEditors.filter((editor) => editor.id !== user.id)
            // Updating yjs document
            provider?.document?.transact(() => {
              yReaders?.push([user.id])
              yEditors?.delete(yEditors?.toArray().findIndex((editorId) => editorId === user.id)!)
            })
          } else if (permission === Permission.ReadWrite) {
            updatedEditors.push(user)
            updatedReaders = updatedReaders.filter((reader) => reader.id !== user.id)
            // Updating yjs document
            provider?.document?.transact(() => {
              yEditors?.push([user.id])
              yReaders?.delete(yReaders?.toArray().findIndex((readerId) => readerId === user.id)!)
            })
          }

          cache.writeQuery<GetPresentationDataQuery>({
            query: GET_PRESENTATION_DATA,
            data: {
              getPresentation: {
                ...cachedData.getPresentation,
                readers: updatedReaders,
                editors: updatedEditors,
              },
            },
            variables: { presentationId },
          })
        }
      },
    })
  }

  const isOwner = isCurrentUserOwner && user.id !== currentUser?.id

  return (
    <div className="group flex min-w-0 items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <img src={user.profilePicUrl} className="h-8 w-8 rounded-full" alt={user.name} />
        <div className="min-w-0">
          <Small as="p" className="mb-0.5 truncate">
            {user.name} {user.id === currentUser?.id ? "(you)" : ""}
          </Small>
          <p className="truncate text-xs font-normal text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Small className={cn("text-grayish font-normal", isOwner && "group-hover:mr-2")}>
          {role === "owner" ? "Owner" : role === "editor" ? "Editor" : "Reader"}
        </Small>
        {isOwner && (
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
                data-value={Permission.Read}
                onSelect={selectHandler}>
                Reader
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer p-1 text-gray-600 hover:bg-gray-100"
                data-value={Permission.ReadWrite}
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
