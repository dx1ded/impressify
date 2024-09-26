import { gql } from "~/__generated__"

export const INVITE_USER = gql(`#graphql
  mutation Invite($userId: String!, $presentationId: String!, $role: Role!) {
    invite(userId: $userId, presentationId: $presentationId, role: $role)
  }
`)

export const GET_PRESENTATION_DATA = gql(`#graphql
  query GetPresentationData($presentationId: String!) {
    getPresentation(id: $presentationId) {
      name
      users {
        id
        role
        props {
          name
          email
          profilePicUrl
        }
      }
    }
  }
`)

export const FIND_USERS = gql(`#graphql
  query FindUsers($query: String!, $limit: Int!) {
    findUsers(query: $query, limit: $limit) {
      id
      name
      email
      profilePicUrl
    }
  }
`)

export const CHANGE_USER_ROLE = gql(`#graphql
  mutation ChangeUserRole($userId: String!, $presentationId: String!, $role: Role!) {
    changeUserRole(userId: $userId, presentationId: $presentationId, role: $role)
  }
`)
