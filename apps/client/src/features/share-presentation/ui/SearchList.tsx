import { useMutation } from "@apollo/client"
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu"
import type { YPresentation } from "@server/hocuspocus/types"
import { motion, AnimatePresence } from "framer-motion"

import {
  type FindUsersQuery,
  type GetPresentationDataQuery,
  type InviteMutation,
  type InviteMutationVariables,
  type Presentation,
  Permission,
} from "~/__generated__/graphql"
import { GET_PRESENTATION_DATA, INVITE_USER } from "~/features/share-presentation/api"
import type { IPresentationUser } from "~/features/share-presentation/lib"
import { useYjs } from "~/shared/model"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/shared/ui-kit/dropdown-menu"
import { Small, Text } from "~/shared/ui/Typography"

interface UserListProps {
  presentationId: Presentation["id"]
  users: FindUsersQuery["findUsers"]
  isMenuOpen: boolean
}

export function SearchList({ presentationId, users, isMenuOpen }: UserListProps) {
  const [inviteUser] = useMutation<InviteMutation, InviteMutationVariables>(INVITE_USER)
  const { getMap } = useYjs()

  const selectHandler = async (e: Event, user: IPresentationUser) => {
    const target = e.target as HTMLDivElement
    const permission = target.dataset.value as Permission
    await inviteUser({
      variables: { userId: user.id, presentationId, permission },
      update: (cache) => {
        // Get the current users from the cache
        const cachedData = cache.readQuery<GetPresentationDataQuery>({
          query: GET_PRESENTATION_DATA,
          variables: { presentationId },
        })

        if (cachedData?.getPresentation?.users) {
          // Add the newly invited user to the cached user list
          const updatedUsers = [...cachedData.getPresentation.users, user]
          const updatedReaders = [...cachedData.getPresentation.readers]
          const updatedEditors = [...cachedData.getPresentation.editors]

          if (permission === Permission.Read) {
            updatedReaders.push(user)
            const yReaders = getMap<YPresentation>().get("readers")
            if (!yReaders?.toArray().find((readerId) => readerId === user.id)) yReaders?.push([user.id])
          } else if (permission === Permission.ReadWrite) {
            updatedEditors.push(user)
            const yEditors = getMap<YPresentation>().get("editors")
            if (!yEditors?.toArray().find((editorId) => editorId === user.id)) yEditors?.push([user.id])
          }

          // Write the updated users back into the cache
          cache.writeQuery<GetPresentationDataQuery>({
            query: GET_PRESENTATION_DATA,
            data: {
              getPresentation: {
                ...cachedData.getPresentation,
                users: updatedUsers,
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

  return (
    <AnimatePresence>
      {isMenuOpen && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <motion.div
          className="absolute max-h-[17.5rem] w-full translate-y-0.5 overflow-y-auto rounded-md bg-blue-50 shadow"
          transition={{ duration: 0.15 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}>
          {users?.map((user) => (
            <DropdownMenu key={user.id}>
              <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer items-center gap-2 p-2">
                  <img src={user.profilePicUrl} className="h-8 w-8 rounded-full" alt={user.name} />
                  <div>
                    <Small>{user.name}</Small>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2" side="right">
                <Text className="mb-0.5 font-medium">Make as</Text>
                <DropdownMenuItem
                  className="cursor-pointer p-1 text-gray-600 hover:bg-gray-100"
                  data-value={Permission.Read}
                  onSelect={(e) => selectHandler(e, user)}>
                  Reader
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer p-1 text-gray-600 hover:bg-gray-100"
                  data-value={Permission.ReadWrite}
                  onSelect={(e) => selectHandler(e, user)}>
                  Editor
                </DropdownMenuItem>
                <DropdownMenuArrow className="!text-pink-500" fill="#dee5ee" width={12} height={6} />
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
