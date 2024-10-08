import { useUser } from "@clerk/clerk-react"

import { type GetSharePresentationInfoQuery, type Presentation, Role } from "~/__generated__/graphql"
import { PresentationUser } from "~/features/share-presentation/ui/PresentationUser"
import { Skeleton } from "~/shared/ui-kit/skeleton"

interface UserListProps {
  presentationId: Presentation["id"]
  data: GetSharePresentationInfoQuery["getPresentation"]
  loading: boolean
}

export function UserList({ presentationId, data, loading }: UserListProps) {
  const { user: currentUser } = useUser()

  return (
    <div className="grid gap-3">
      {loading ? (
        <>
          <Skeleton className="h-9 rounded-xl" />
          <Skeleton className="h-9 rounded-xl" />
          <Skeleton className="h-9 rounded-xl" />
        </>
      ) : (
        data?.users.map((user) => (
          <PresentationUser
            key={user.props.id}
            user={user}
            isCurrentUserCreator={
              data?.users.find((_user) => _user.role === Role.Creator)?.props.id === currentUser?.id
            }
            presentationId={presentationId}
          />
        ))
      )}
    </div>
  )
}
