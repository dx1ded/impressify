import { useQuery } from "@apollo/client"

import type { FindUserPresentationsQuery, FindUserPresentationsQueryVariables } from "~/__generated__/graphql"
import { FIND_USER_PRESENTATIONS, PresentationPreview, setRecentPresentations } from "~/entities/presentation"
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

  return (
    <div className="py-6">
      <Container>
        <div className="mb-5 flex items-center justify-between">
          <Text className="font-semibold">Recent presentations</Text>
          <SortPresentations />
        </div>
        <div className={cn("grid gap-4", view === "grid" ? "grid-cols-5" : "grid-cols-1")}>
          {loading ? (
            <>
              <Skeleton className={cn(view === "grid" ? "h-[11.125rem]" : "h-[3.875rem]")} />
              <Skeleton className={cn(view === "grid" ? "h-[11.125rem]" : "h-[3.875rem]")} />
              <Skeleton className={cn(view === "grid" ? "h-[11.125rem]" : "h-[3.875rem]")} />
              <Skeleton className={cn(view === "grid" ? "h-[11.125rem]" : "h-[3.875rem]")} />
              <Skeleton className={cn(view === "grid" ? "h-[11.125rem]" : "h-[3.875rem]")} />
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
                          records: presentation.history.records.filter((record) => record.user.id === userId),
                        },
                      }))
                      .map((presentation) => (
                        <PresentationPreview
                          key={presentation.id}
                          presentation={presentation}
                          view={view}
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
