import type { GetPresentationDataQuery, User } from "~/__generated__/graphql"
import type { UserRole } from "~/entities/user"

export function getUserRole(id: User["id"], data: NonNullable<GetPresentationDataQuery>["getPresentation"]): UserRole {
  if (data?.owner.id === id) return "owner"
  if (data?.editors.some((_user) => _user.id === id)) return "editor"
  return "reader"
}
