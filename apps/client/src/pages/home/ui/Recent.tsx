import { useQuery, useSubscription } from "@apollo/client"

import {
  type FindUserPresentationsQuery,
  type FindUserPresentationsQueryVariables,
  type PresentationListUpdatedSubscription,
  type PresentationListUpdatedSubscriptionVariables,
  PresentationUpdateType,
  Role,
} from "~/__generated__/graphql"
import {
  FIND_USER_PRESENTATIONS,
  PRESENTATION_LIST_UPDATED,
  PresentationPreview,
  setRecentPresentations,
} from "~/entities/presentation"
import { SortPresentations } from "~/features/sort-presentations"
import { DeletePresentationAlert } from "~/features/delete-presentation"
import { RenamePresentationDialog } from "~/features/rename-presentation"
import { cn } from "~/shared/lib"
import { useAppDispatch, useAppSelector } from "~/shared/model"
import { Skeleton } from "~/shared/ui-kit/skeleton"
import { Container } from "~/shared/ui/Container"
import { Text } from "~/shared/ui/Typography"

export function Recent() {
  const { items, view, sort } = useAppSelector((state) => state.recentPresentations)
  const userId = useAppSelector((state) => state.user.id)
  const dispatch = useAppDispatch()
  const { loading } = useQuery<FindUserPresentationsQuery, FindUserPresentationsQueryVariables>(
    FIND_USER_PRESENTATIONS,
    {
      variables: { preview: true, sortBy: sort },
      fetchPolicy: "network-only",
      onCompleted(data) {
        const result = data.findUserPresentations
        if (!result) return
        dispatch(setRecentPresentations(result))
      },
    },
  )

  // Presentation list subscription
  useSubscription<PresentationListUpdatedSubscription, PresentationListUpdatedSubscriptionVariables>(
    PRESENTATION_LIST_UPDATED,
    {
      onData(options) {
        const operation = options.data.data?.presentationListUpdated
        if (!operation) return
        let newItems = [...items]
        if (operation.type === PresentationUpdateType.Added) {
          newItems.unshift(operation.presentation)
        } else if (operation.type === PresentationUpdateType.Changed) {
          newItems = newItems.map((_presentation) =>
            _presentation.id === operation.presentation.id ? operation.presentation : _presentation,
          )
        } else if (operation.type === PresentationUpdateType.Deleted) {
          newItems = newItems.filter((_presentation) => _presentation.id !== operation.presentation.id)
        }
        dispatch(setRecentPresentations(newItems))
      },
    },
  )

  return (
    <div className="py-6">
      <Container>
        <div className="mb-5 flex items-center justify-between">
          <Text className="font-semibold">Recent presentations</Text>
          <SortPresentations />
        </div>
        <div
          className={cn(
            "grid gap-4",
            view === "grid"
              ? "max-xs:grid-cols-1 grid-cols-5 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2"
              : "grid-cols-1",
          )}>
          {loading ? (
            <>
              <Skeleton className={cn(view === "grid" ? "h-[12.125rem]" : "h-[3.875rem]")} />
              <Skeleton className={cn(view === "grid" ? "h-[12.125rem]" : "h-[3.875rem]")} />
              <Skeleton className={cn(view === "grid" ? "h-[12.125rem]" : "h-[3.875rem]")} />
              <Skeleton className={cn(view === "grid" ? "h-[12.125rem]" : "h-[3.875rem]")} />
              <Skeleton className={cn(view === "grid" ? "h-[12.125rem]" : "h-[3.875rem]")} />
            </>
          ) : (
            <DeletePresentationAlert>
              {(DeleteAlert) => (
                <RenamePresentationDialog>
                  {(RenameDialog) =>
                    items
                      // Map to get only records for current user (so presentation.history.records[0] is going to be the needed record)
                      .map((presentation) => ({
                        ...presentation,
                        history: {
                          ...presentation.history,
                          records: presentation.history.records.filter((record) => record.user.props.id === userId),
                        },
                      }))
                      .map((presentation) => (
                        <PresentationPreview
                          key={presentation.id}
                          presentation={presentation}
                          view={view}
                          isEditor={presentation.users.find((_user) => _user.props.id === userId)?.role === Role.Editor}
                          isCreator={
                            presentation.users.find((_user) => _user.props.id === userId)?.role === Role.Creator
                          }
                          DeleteAlert={DeleteAlert}
                          RenameDialog={RenameDialog}
                        />
                      ))
                  }
                </RenamePresentationDialog>
              )}
            </DeletePresentationAlert>
          )}
        </div>
      </Container>
    </div>
  )
}
