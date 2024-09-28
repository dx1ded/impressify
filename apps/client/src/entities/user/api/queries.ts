import { gql } from "~/__generated__"

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
