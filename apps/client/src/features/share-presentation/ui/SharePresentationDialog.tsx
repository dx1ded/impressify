import { useQuery, useLazyQuery } from "@apollo/client"
import { type ChangeEvent, type ReactNode, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

import {
  type FindUsersQuery,
  type FindUsersQueryVariables,
  type GetSharePresentationInfoQuery,
  type GetSharePresentationInfoQueryVariables,
  type Presentation,
} from "~/__generated__/graphql"
import { GET_SHARE_PRESENTATION_INFO } from "~/features/share-presentation/api"
import { SearchList } from "~/features/share-presentation/ui/SearchList"
import { UserList } from "~/features/share-presentation/ui/UserList"
import { FIND_USERS } from "~/entities/user"
import { Button } from "~/shared/ui-kit/button"
import { Input } from "~/shared/ui-kit/input"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "~/shared/ui-kit/dialog"
import { Skeleton } from "~/shared/ui-kit/skeleton"
import { Text } from "~/shared/ui/Typography"

const FIND_USERS_DEBOUNCE_TIME = 500
const USERS_LIMIT = 5

interface SharePresentationDialogProps {
  presentationId: Presentation["id"]
  children: ReactNode
}

export function SharePresentationDialog({ presentationId, children }: SharePresentationDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getPresentationInfoResult = useQuery<GetSharePresentationInfoQuery, GetSharePresentationInfoQueryVariables>(
    GET_SHARE_PRESENTATION_INFO,
    {
      fetchPolicy: "network-only",
      variables: { presentationId },
      skip: !isDialogOpen,
    },
  )
  const [findUsers, findUsersResult] = useLazyQuery<FindUsersQuery, FindUsersQueryVariables>(FIND_USERS, {
    onCompleted(data) {
      setIsMenuOpen(!!data?.findUsers?.length)
    },
  })

  const inputChangeHandler = useDebouncedCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) return setIsMenuOpen(false)
    await findUsers({ variables: { query: value, limit: USERS_LIMIT } })
  }, FIND_USERS_DEBOUNCE_TIME)

  const presentationData = getPresentationInfoResult.data?.getPresentation
  const findUsersData = findUsersResult.data?.findUsers

  return (
    <Dialog onOpenChange={(value) => setIsDialogOpen(value)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={() => setIsMenuOpen(false)}>
        <DialogHeader className="min-w-0">
          {getPresentationInfoResult.loading ? (
            <>
              <Skeleton className="h-[1.6875rem] w-72" />
              <DialogTitle hidden>Loading presentation name</DialogTitle>
            </>
          ) : (
            <DialogTitle className="truncate leading-normal">Share &quot;{presentationData?.name}&quot;</DialogTitle>
          )}
          <DialogDescription hidden>Share this presentation with someone else to work in a team</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Input
            type="text"
            className="px-3 py-5"
            placeholder="Add people to work with you"
            onChange={inputChangeHandler}
          />
          <SearchList
            presentationId={presentationId}
            users={findUsersData?.filter(
              (user) => !presentationData?.users.some((_user) => _user.props.id === user.id),
            )}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>
        <div className="mb-2">
          <Text className="mb-3 font-medium">People with access</Text>
          <UserList
            presentationId={presentationId}
            data={presentationData}
            loading={getPresentationInfoResult.loading}
          />
        </div>
        <DialogClose asChild>
          <Button size="sm" variant="blue" className="rounded-3xl">
            Done
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
