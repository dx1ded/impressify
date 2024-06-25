import type { FindUserPresentationsQuery, GetPresentationQuery } from "~/__generated__/graphql"
import type { ArrayElement } from "~/shared/lib"

export type FindPresentationItem = ArrayElement<NonNullable<FindUserPresentationsQuery["findUserPresentations"]>>
export type Presentation = NonNullable<GetPresentationQuery["getPresentation"]>
