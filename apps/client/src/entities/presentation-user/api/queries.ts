import { gql } from "~/__generated__"

export const INVITE_USER = gql(`#graphql
  mutation Invite($userId: ID!, $presentationId: ID!, $role: Role!) {
    invite(userId: $userId, presentationId: $presentationId, role: $role)
  }
`)

export const KICK_USER = gql(`#graphql
  mutation Kick($userId: ID!, $presentationId: ID!) {
    kick(userId: $userId, presentationId: $presentationId)
  }
`)

export const CHANGE_USER_ROLE = gql(`#graphql
  mutation ChangeUserRole($userId: ID!, $presentationId: ID!, $role: Role!) {
    changeUserRole(userId: $userId, presentationId: $presentationId, role: $role)
  }
`)
