import type { GetPresentationDataQuery } from "~/__generated__/graphql"

export type IPresentationUser = NonNullable<GetPresentationDataQuery["getPresentation"]>["users"][number]
