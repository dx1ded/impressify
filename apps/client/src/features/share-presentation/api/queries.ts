import { gql } from "~/__generated__"

export const GET_SHARE_PRESENTATION_INFO = gql(`#graphql
  query GetSharePresentationInfo($presentationId: ID!) {
    getPresentation(id: $presentationId) {
      name
      users {
        role
        props {
          id
          name
          email
          profilePicUrl
        }
      }
    }
  }
`)
