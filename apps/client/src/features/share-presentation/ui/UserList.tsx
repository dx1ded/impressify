import { useUser } from "@clerk/clerk-react"

import type { GetPresentationDataQuery, Presentation } from "~/__generated__/graphql"
import { getUserRole } from "~/features/share-presentation/lib"
import { PresentationUser } from "~/features/share-presentation/ui/PresentationUser"
import { Skeleton } from "~/shared/ui-kit/skeleton"

interface UserListProps {
  presentationId: Presentation["id"]
  data: GetPresentationDataQuery["getPresentation"]
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
            key={user.id}
            user={user}
            role={getUserRole(user?.id, data)}
            isCurrentUserOwner={data?.owner.id === currentUser?.id}
            presentationId={presentationId}
          />
        ))
      )}
    </div>
  )
}
