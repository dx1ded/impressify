import { useMutation } from "@apollo/client"
import type { User } from "@server/entities/User"
import { transformNormalizedToYUser } from "@server/hocuspocus/transform"
import type { YPresentation } from "@server/hocuspocus/types"

import {
  type InviteMutation,
  type InviteMutationVariables,
  type ChangeUserRoleMutation,
  type ChangeUserRoleMutationVariables,
  type KickMutation,
  type KickMutationVariables,
  type GetSharePresentationInfoQuery,
  Result,
} from "~/__generated__/graphql"
import { GET_SHARE_PRESENTATION_INFO } from "~/features/share-presentation/api"
import { INVITE_USER, KICK_USER, CHANGE_USER_ROLE } from "~/entities/presentation-user"
import { useYjs } from "~/shared/model"

type useInviteUserFnProps = Omit<InviteMutationVariables, "userId"> & {
  user: User
}

export const useInviteUser = () => {
  const [inviteUser] = useMutation<InviteMutation, InviteMutationVariables>(INVITE_USER)
  const { getMap } = useYjs()

  return async ({ user, presentationId, role }: useInviteUserFnProps) => {
    await inviteUser({
      variables: { userId: user.id, presentationId, role },
      update: (cache, query) => {
        if (query.data?.invite !== Result.Success) return
        const cachedData = cache.readQuery<GetSharePresentationInfoQuery>({
          query: GET_SHARE_PRESENTATION_INFO,
          variables: { presentationId },
        })

        if (cachedData?.getPresentation?.users) {
          const updatedUsers = [...cachedData.getPresentation.users, { role, props: user }]
          const yUsers = getMap<YPresentation>().get("users")
          if (!yUsers?.toArray().find((_user) => _user.get("id") === user.id)) {
            yUsers?.push([transformNormalizedToYUser({ id: user.id, role })])
          }

          cache.writeQuery<GetSharePresentationInfoQuery>({
            query: GET_SHARE_PRESENTATION_INFO,
            data: {
              getPresentation: {
                ...cachedData.getPresentation,
                users: updatedUsers,
              },
            },
            variables: { presentationId },
          })
        }
      },
    })
  }
}

export const useChangeUserRole = () => {
  const [changeUserRole] = useMutation<ChangeUserRoleMutation, ChangeUserRoleMutationVariables>(CHANGE_USER_ROLE)
  const { getMap } = useYjs()

  return async ({ userId, presentationId, role }: ChangeUserRoleMutationVariables) => {
    await changeUserRole({
      variables: { presentationId, userId, role },
      update: (cache, query) => {
        if (query.data?.changeUserRole !== Result.Success) return
        const cachedData = cache.readQuery<GetSharePresentationInfoQuery>({
          query: GET_SHARE_PRESENTATION_INFO,
          variables: { presentationId },
        })

        if (cachedData?.getPresentation) {
          const updatedUsers = [...cachedData.getPresentation.users].map((_user) =>
            _user.props.id === userId ? { ..._user, role } : _user,
          )

          getMap<YPresentation>()
            .get("users")
            ?.toArray()
            .find((_user) => _user.get("id") === userId)
            ?.set("role", role)

          cache.writeQuery<GetSharePresentationInfoQuery>({
            query: GET_SHARE_PRESENTATION_INFO,
            data: {
              getPresentation: {
                ...cachedData.getPresentation,
                users: updatedUsers,
              },
            },
            variables: { presentationId },
          })
        }
      },
    })
  }
}

export const useKickUser = () => {
  const [kickUser] = useMutation<KickMutation, KickMutationVariables>(KICK_USER)
  const { getMap } = useYjs()

  return async ({ userId, presentationId }: KickMutationVariables) => {
    await kickUser({
      variables: { presentationId, userId },
      update: (cache, query) => {
        if (query.data?.kick !== Result.Success) return
        const cachedData = cache.readQuery<GetSharePresentationInfoQuery>({
          query: GET_SHARE_PRESENTATION_INFO,
          variables: { presentationId },
        })

        if (cachedData?.getPresentation) {
          const updatedUsers = [...cachedData.getPresentation.users].filter((_user) => _user.props.id !== userId)

          const yUsers = getMap<YPresentation>().get("users")
          yUsers?.delete(yUsers?.toArray().findIndex((_user) => _user.get("id") === userId))

          cache.writeQuery<GetSharePresentationInfoQuery>({
            query: GET_SHARE_PRESENTATION_INFO,
            data: {
              getPresentation: {
                ...cachedData.getPresentation,
                users: updatedUsers,
              },
            },
            variables: { presentationId },
          })
        }
      },
    })
  }
}
