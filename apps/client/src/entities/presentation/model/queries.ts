import { gql } from "~/__generated__"

export const FIND_USER_PRESENTATIONS = gql(`#graphql
  query FindUserPresentations($preview: Boolean!, $sortBy: String!) {
    findUserPresentations(preview: $preview, sortBy: $sortBy) {
      id
      name
      users {
        id
      }
      slides {
        thumbnailUrl
      }
      history {
        records {
          lastOpened
          user {
            id
          }
        }
      }
    }
  }
`)

export const GET_PRESENTATION = gql(`#graphql
  query GetPresentation($presentationId: String!) {
    getPresentation(id: $presentationId) {
      id
      name
      slides {
        thumbnailUrl
        id
        elements {
          ...ElementFields
        }
      }
    }
  }
`)
