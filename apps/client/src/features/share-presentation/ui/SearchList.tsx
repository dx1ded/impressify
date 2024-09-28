import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu"
import { AnimatePresence, motion } from "framer-motion"

import { type FindUsersQuery, type Presentation, Role } from "~/__generated__/graphql"
import { useInviteUser } from "~/features/share-presentation/model"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/shared/ui-kit/dropdown-menu"
import { Small, Text } from "~/shared/ui/Typography"

interface UserListProps {
  presentationId: Presentation["id"]
  users: FindUsersQuery["findUsers"]
  isMenuOpen: boolean
}

export function SearchList({ presentationId, users, isMenuOpen }: UserListProps) {
  const inviteUser = useInviteUser()

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
                  onSelect={() =>
                    inviteUser({
                      user,
                      presentationId,
                      role: Role.Reader,
                    })
                  }>
                  Reader
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer p-1 text-gray-600 hover:bg-gray-100"
                  onSelect={() =>
                    inviteUser({
                      user,
                      presentationId,
                      role: Role.Reader,
                    })
                  }>
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
